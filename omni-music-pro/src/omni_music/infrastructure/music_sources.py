"""
Adaptateurs pour les sources de musique externes
"""

import asyncio
import re
import time
from pathlib import Path
from typing import Callable, List, Optional

import yt_dlp
from mutagen.id3 import ID3, TALB, TIT2, TPE1

from omni_music.domain import Artist, AudioFormat, MusicSourceRepository, Track
from omni_music.domain.exceptions import DownloadError

from .cache import DownloadSpeedTracker, TrackInfoCache
from .logging import get_logger, performance_monitor
from .retry import DOWNLOAD_RETRY_CONFIG, retry_async


class YouTubeSource(MusicSourceRepository):
    """Adaptateur pour YouTube via yt-dlp"""

    def __init__(self, download_dir: Path):
        self.download_dir = download_dir
        self.download_dir.mkdir(parents=True, exist_ok=True)

        # Initialiser le cache
        self.cache = TrackInfoCache(download_dir / "cache")
        self.speed_tracker = DownloadSpeedTracker(download_dir / "cache")

        # Logger spécialisé
        self.logger = get_logger("youtube_source")

        # Configuration yt-dlp optimisée pour la performance
        self.ydl_opts_base = {
            'quiet': True,
            'no_warnings': True,
            'extractaudio': True,
            'audioformat': 'mp3',
            'outtmpl': str(self.download_dir / '%(title)s.%(ext)s'),
            # Optimisations de performance
            'concurrent_fragment_downloads': 4,  # Téléchargements parallèles
            'http_chunk_size': 10485760,  # 10MB chunks pour vitesse
            'retries': 3,
            'fragment_retries': 3,
            'socket_timeout': 30,
            # Éviter les formats trop lourds
            'format': 'bestaudio[filesize<50M]/bestaudio[ext=m4a]/bestaudio',
        }

    @performance_monitor("youtube_search")
    @retry_async(DOWNLOAD_RETRY_CONFIG)
    async def search_tracks(self, query: str, limit: int = 10) -> List[Track]:
        """Recherche des pistes sur YouTube"""
        self.logger.info("Starting YouTube search", query=query, limit=limit)

        try:
            # Configuration pour la recherche
            ydl_opts = {
                **self.ydl_opts_base,
                'quiet': True,
                'extract_flat': True,
                'default_search': 'ytsearch10:' + query
            }

            # Exécution dans un thread pour éviter de bloquer
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(
                None, self._search_sync, ydl_opts
            )

            tracks: List[Track] = []
            for entry in results.get('entries', []):
                if len(tracks) >= limit:
                    break

                track = Track(
                    title=entry.get('title', 'Unknown'),
                    artist=Artist(name=entry.get('uploader', 'Unknown Artist')),
                    duration_seconds=entry.get('duration', 0),
                    source_url=entry.get('webpage_url', entry.get('url'))
                )
                tracks.append(track)

            return tracks

        except Exception as e:
            raise DownloadError("search", f"YouTube search failed: {str(e)}") from e

    def _search_sync(self, ydl_opts: dict) -> dict:
        """Recherche synchrone avec yt-dlp"""
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(ydl_opts['default_search'], download=False)
            return result if result is not None else {}

    async def get_track_info(self, url: str) -> Optional[Track]:
        """Récupère les informations d'une piste depuis son URL"""
        try:
            # Vérifier le cache d'abord
            cached_track = self.cache.get(url)
            if cached_track:
                return cached_track

            ydl_opts = {
                **self.ydl_opts_base,
                'quiet': True,
            }

            loop = asyncio.get_event_loop()
            info = await loop.run_in_executor(
                None, self._get_info_sync, url, ydl_opts
            )

            if not info:
                return None

            # Extraction des métadonnées
            artist_name = (
                info.get('artist') or
                info.get('uploader') or
                info.get('channel') or
                'Unknown Artist'
            )

            track = Track(
                title=info.get('title', 'Unknown'),
                artist=Artist(name=artist_name),
                duration_seconds=info.get('duration', 0),
                source_url=url,
                metadata={
                    'description': info.get('description', ''),
                    'view_count': info.get('view_count', 0),
                    'upload_date': info.get('upload_date', ''),
                    'thumbnail': info.get('thumbnail', ''),
                }
            )

            # Mettre en cache
            self.cache.set(url, track)

            return track

        except Exception as e:
            raise DownloadError(url, f"Failed to get track info: {str(e)}") from e

    def _get_info_sync(self, url: str, ydl_opts: dict) -> dict:
        """Récupération synchrone d'infos avec yt-dlp"""
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(url, download=False)
            return result if result is not None else {}

    async def download_track(
        self,
        track: Track,
        output_path: str,
        format: AudioFormat
    ) -> str:
        """Télécharge une piste dans le format spécifié"""
        try:
            # Configuration pour le téléchargement
            output_dir = Path(output_path)
            output_dir.mkdir(parents=True, exist_ok=True)

            # Nom de fichier sécurisé
            safe_title = self._sanitize_filename(track.title)
            output_file = output_dir / f"{safe_title}.{format.extension}"

            ydl_opts = {
                **self.ydl_opts_base,
                'outtmpl': str(output_file.with_suffix('.%(ext)s')),
                # Format optimisé selon qualité demandée
                'format': self._get_optimal_format(format),
                'postprocessors': self._get_optimized_postprocessors(format)
            }

            # Vérifier que l'URL existe
            if not track.source_url:
                raise DownloadError("", "Track has no source URL")

            # Téléchargement dans un thread
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None, self._download_sync, track.source_url, ydl_opts
            )

            # Le fichier réel peut avoir une extension différente
            actual_file = None
            for ext in [format.extension, 'mp3', 'm4a', 'webm']:
                candidate = output_file.with_suffix(f'.{ext}')
                if candidate.exists():
                    actual_file = candidate
                    break

            if not actual_file or not actual_file.exists():
                raise DownloadError(track.source_url, "Download completed but file not found")

            # Ajouter les métadonnées
            await self._add_metadata(actual_file, track)

            return str(actual_file)

        except Exception as e:
            source_url = track.source_url or "unknown"
            raise DownloadError(source_url, f"Download failed: {str(e)}") from e

    def _download_sync(self, url: str, ydl_opts: dict) -> None:
        """Téléchargement synchrone avec yt-dlp"""
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

    async def download_track_with_progress(
        self,
        track: Track,
        output_path: str,
        format: AudioFormat,
        progress_callback: Optional[Callable] = None
    ) -> str:
        """Télécharge avec callback de progression"""
        start_time = time.time()

        try:
            output_dir = Path(output_path)
            output_dir.mkdir(parents=True, exist_ok=True)

            safe_title = self._sanitize_filename(track.title)
            output_file = output_dir / f"{safe_title}.{format.extension}"

            # Hook de progression
            def progress_hook(d: dict) -> None:
                if progress_callback and d['status'] == 'downloading':
                    percent = d.get('_percent_str', 'N/A').strip('%')
                    speed = d.get('_speed_str', 'N/A')
                    eta = d.get('_eta_str', 'N/A')
                    progress_callback({
                        'percent': percent,
                        'speed': speed,
                        'eta': eta,
                        'status': 'downloading'
                    })
                elif progress_callback and d['status'] == 'finished':
                    progress_callback({
                        'percent': '100',
                        'speed': '',
                        'eta': '',
                        'status': 'processing'
                    })

            # Vérifier que l'URL existe
            if not track.source_url:
                raise DownloadError("", "Track has no source URL")

            # Utiliser format optimal basé sur l'historique si disponible
            optimal_format = self.speed_tracker.get_optimal_format(track.source_url)
            selected_format = optimal_format if optimal_format else self._get_optimal_format(format)

            ydl_opts = {
                **self.ydl_opts_base,
                'outtmpl': str(output_file.with_suffix('.%(ext)s')),
                'format': selected_format,
                'postprocessors': self._get_optimized_postprocessors(format),
                'progress_hooks': [progress_hook],
            }

            # Téléchargement avec callback
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None, self._download_sync, track.source_url, ydl_opts
            )

            # Trouver le fichier téléchargé
            actual_file = None
            for ext in [format.extension, 'mp3', 'm4a', 'webm']:
                candidate = output_file.with_suffix(f'.{ext}')
                if candidate.exists():
                    actual_file = candidate
                    break

            if not actual_file or not actual_file.exists():
                raise DownloadError(track.source_url, "Download completed but file not found")

            await self._add_metadata(actual_file, track)

            # Enregistrer les stats de performance
            end_time = time.time()
            download_duration = end_time - start_time
            if actual_file and actual_file.exists() and track.source_url:
                file_size = actual_file.stat().st_size
                self.speed_tracker.record_download(
                    track.source_url,
                    download_duration,
                    file_size,
                    format.extension
                )

            if progress_callback:
                progress_callback({
                    'percent': '100',
                    'speed': '',
                    'eta': '',
                    'status': 'completed'
                })

            return str(actual_file)

        except Exception as e:
            if progress_callback:
                progress_callback({
                    'percent': '0',
                    'speed': '',
                    'eta': '',
                    'status': 'error',
                    'error': str(e)
                })
            source_url = track.source_url or "unknown"
            raise DownloadError(source_url, f"Download failed: {str(e)}") from e

    async def get_playlist_tracks(self, playlist_url: str) -> List[Track]:
        """Récupère toutes les pistes d'une playlist"""
        try:
            ydl_opts = {
                **self.ydl_opts_base,
                'quiet': True,
                'extract_flat': True,
            }

            loop = asyncio.get_event_loop()
            info = await loop.run_in_executor(
                None, self._get_info_sync, playlist_url, ydl_opts
            )

            tracks = []
            for entry in info.get('entries', []):
                if entry.get('url'):
                    track_info = await self.get_track_info(entry['url'])
                    if track_info:
                        tracks.append(track_info)

            return tracks

        except Exception as e:
            raise DownloadError(playlist_url, f"Playlist extraction failed: {str(e)}") from e

    def is_supported_url(self, url: str) -> bool:
        """Vérifie si l'URL est supportée par YouTube"""
        youtube_patterns = [
            r'youtube\.com/watch',
            r'youtube\.com/playlist',
            r'youtu\.be/',
            r'youtube\.com/shorts/',
        ]

        return any(re.search(pattern, url) for pattern in youtube_patterns)

    def _sanitize_filename(self, filename: str) -> str:
        """Nettoie un nom de fichier des caractères interdits"""
        # Remplacer les caractères problématiques
        sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
        # Limiter la longueur
        max_filename_length = 100
        return sanitized[:max_filename_length] if len(sanitized) > max_filename_length else sanitized

    async def _add_metadata(self, file_path: Path, track: Track) -> None:
        """Ajoute les métadonnées ID3 à un fichier MP3"""
        if file_path.suffix.lower() != '.mp3':
            return

        try:
            # Charger ou créer les tags ID3
            try:
                tags = ID3(str(file_path))
            except Exception:
                tags = ID3()

            # Ajouter les métadonnées de base
            tags.add(TIT2(encoding=3, text=track.title))

            if track.artist:
                tags.add(TPE1(encoding=3, text=track.artist.name))

            if track.album:
                tags.add(TALB(encoding=3, text=track.album.title))

            # Sauvegarder les tags
            tags.save(str(file_path))

        except Exception:
            # Si l'ajout de métadonnées échoue, on continue quand même
            pass

    def _get_optimal_format(self, format: AudioFormat) -> str:
        """Sélectionne le format optimal selon la qualité demandée"""
        high_bitrate = 320
        medium_bitrate = 192

        if format.extension == 'mp3':
            if format.bitrate and format.bitrate >= high_bitrate:
                return 'bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio'
            elif format.bitrate and format.bitrate >= medium_bitrate:
                return 'bestaudio[filesize<30M][ext=m4a]/bestaudio[filesize<30M]'
            else:
                return 'worstaudio[ext=m4a]/worstaudio'
        elif format.extension == 'flac':
            return 'bestaudio[ext=flac]/bestaudio'
        else:
            return 'bestaudio[filesize<50M]/bestaudio[ext=m4a]/bestaudio'

    def _get_optimized_postprocessors(self, format: AudioFormat) -> list:
        """Configure les post-processeurs selon le format"""
        high_bitrate = 320
        processors = []

        if format.extension != 'm4a':  # Éviter re-encoding si possible
            processors.append({
                'key': 'FFmpegExtractAudio',
                'preferredcodec': format.extension,
                'preferredquality': str(min(format.bitrate, high_bitrate)) if format.bitrate else '256',
                'nopostoverwrites': False,
            })

        return processors


class DeezerSource(MusicSourceRepository):
    """Adaptateur pour Deezer (placeholder pour l'exemple)"""

    def __init__(self) -> None:
        # Note: L'API Deezer ne permet pas le téléchargement direct
        # Ceci est un exemple d'architecture uniquement
        pass

    async def search_tracks(self, _query: str, _limit: int = 10) -> List[Track]:
        """Recherche des pistes sur Deezer (métadonnées uniquement)"""
        # TODO: Implémenter avec l'API Deezer pour la recherche de métadonnées
        return []

    async def get_track_info(self, _url: str) -> Optional[Track]:
        """Récupère les informations d'une piste Deezer"""
        # TODO: Implémenter avec l'API Deezer
        return None

    async def download_track(
        self,
        track: Track,
        _output_path: str,
        _format: AudioFormat
    ) -> str:
        """Deezer ne permet pas le téléchargement via API publique"""
        source_url = track.source_url or "unknown"
        raise DownloadError(source_url, "Deezer download not available via public API")

    async def get_playlist_tracks(self, _playlist_url: str) -> List[Track]:
        """Récupère les métadonnées d'une playlist Deezer"""
        # TODO: Implémenter avec l'API Deezer
        return []

    def is_supported_url(self, url: str) -> bool:
        """Vérifie si l'URL est une URL Deezer"""
        return 'deezer.com' in url
