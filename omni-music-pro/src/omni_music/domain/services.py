"""
Services du domaine

Ces services contiennent la logique métier complexe qui ne peut pas
être encapsulée dans une seule entité.
"""

from pathlib import Path
from typing import Callable, List, Optional
from uuid import UUID

from .exceptions import (
    DownloadError,
    PlaylistNotFoundError,
    TrackNotFoundError,
)
from .models import AudioFormat, Playlist, Track
from .repositories import MusicSourceRepository, PlaylistRepository, TrackRepository


class MusicService:
    """Service principal pour la gestion de la musique"""

    def __init__(
        self,
        track_repository: TrackRepository,
        playlist_repository: PlaylistRepository,
        music_sources: List[MusicSourceRepository]
    ):
        self.track_repo = track_repository
        self.playlist_repo = playlist_repository
        self.music_sources = music_sources

    async def download_track(
        self,
        url: str,
        format: AudioFormat,
        output_dir: Path,
        progress_callback: Optional[Callable] = None
    ) -> Track:
        """
        Télécharge une piste depuis une URL

        Args:
            url: URL de la piste
            format: Format audio souhaité
            output_dir: Dossier de destination

        Returns:
            Track: La piste téléchargée

        Raises:
            DownloadError: Si le téléchargement échoue
        """
        # Trouver la source qui supporte cette URL
        source = self._find_source_for_url(url)
        if not source:
            raise DownloadError(url, "No source supports this URL")

        # Récupérer les infos de la piste
        track_info = await source.get_track_info(url)
        if not track_info:
            raise DownloadError(url, "Could not retrieve track information")

        # Télécharger la piste
        try:
            # Utiliser la méthode avec progress si disponible et demandée
            if progress_callback and hasattr(source, 'download_track_with_progress'):
                file_path = await source.download_track_with_progress(
                    track_info,
                    str(output_dir),
                    format,
                    progress_callback
                )
            else:
                file_path = await source.download_track(
                    track_info,
                    str(output_dir),
                    format
                )

            track_info.file_path = Path(file_path)
            track_info.format = format

            # Sauvegarder dans le repository
            await self.track_repo.save(track_info)

            return track_info

        except Exception as e:
            raise DownloadError(url, str(e)) from e

    async def create_playlist(
        self,
        name: str,
        description: str = "",
        track_ids: Optional[List[UUID]] = None
    ) -> Playlist:
        """
        Crée une nouvelle playlist

        Args:
            name: Nom de la playlist
            description: Description optionnelle
            track_ids: IDs des pistes à ajouter

        Returns:
            Playlist: La playlist créée
        """
        playlist = Playlist(name=name, description=description)

        # Ajouter les pistes si fournies
        if track_ids:
            for track_id in track_ids:
                track = await self.track_repo.get_by_id(track_id)
                if track:
                    playlist.add_track(track)

        await self.playlist_repo.save(playlist)
        return playlist

    async def add_track_to_playlist(
        self,
        playlist_id: UUID,
        track_id: UUID
    ) -> None:
        """
        Ajoute une piste à une playlist

        Args:
            playlist_id: ID de la playlist
            track_id: ID de la piste

        Raises:
            PlaylistNotFoundError: Si la playlist n'existe pas
            TrackNotFoundError: Si la piste n'existe pas
        """
        playlist = await self.playlist_repo.get_by_id(playlist_id)
        if not playlist:
            raise PlaylistNotFoundError(str(playlist_id))

        track = await self.track_repo.get_by_id(track_id)
        if not track:
            raise TrackNotFoundError(str(track_id))

        playlist.add_track(track)
        await self.playlist_repo.save(playlist)

    async def search_tracks(
        self,
        query: str,
        source: Optional[str] = None
    ) -> List[Track]:
        """
        Recherche des pistes

        Args:
            query: Terme de recherche
            source: Source spécifique (optionnel)

        Returns:
            List[Track]: Liste des pistes trouvées
        """
        results = []

        # Recherche locale d'abord
        local_tracks = await self.track_repo.get_by_title(query)
        results.extend(local_tracks)

        # Recherche sur les sources externes
        for music_source in self.music_sources:
            if source and music_source.__class__.__name__ != source:
                continue

            try:
                external_tracks = await music_source.search_tracks(query)
                results.extend(external_tracks)
            except Exception:
                # Continuer même si une source échoue
                pass

        return results

    async def sync_playlist_from_url(
        self,
        playlist_url: str,
        format: AudioFormat,
        output_dir: Path
    ) -> Playlist:
        """
        Synchronise une playlist depuis une URL externe

        Args:
            playlist_url: URL de la playlist
            format: Format audio pour les téléchargements
            output_dir: Dossier de destination

        Returns:
            Playlist: La playlist synchronisée
        """
        source = self._find_source_for_url(playlist_url)
        if not source:
            raise DownloadError(playlist_url, "No source supports this URL")

        # Récupérer les pistes de la playlist
        tracks = await source.get_playlist_tracks(playlist_url)

        # Créer la playlist locale
        from datetime import datetime
        playlist = Playlist(
            name=f"Imported from {playlist_url}",
            description=f"Playlist imported on {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        )

        # Télécharger chaque piste
        for track_info in tracks:
            try:
                file_path = await source.download_track(
                    track_info,
                    str(output_dir),
                    format
                )
                track_info.file_path = Path(file_path)
                track_info.format = format

                await self.track_repo.save(track_info)
                playlist.add_track(track_info)

            except Exception:
                # Continuer même si une piste échoue
                pass

        await self.playlist_repo.save(playlist)
        return playlist

    def _find_source_for_url(self, url: str) -> Optional[MusicSourceRepository]:
        """Trouve la source qui supporte une URL donnée"""
        for source in self.music_sources:
            if source.is_supported_url(url):
                return source
        return None
