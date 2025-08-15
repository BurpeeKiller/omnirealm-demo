"""
Cas d'usage de l'application

Ces classes implémentent les scénarios d'utilisation de l'application.
Elles orchestrent les interactions entre le domaine et l'infrastructure.
"""

from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Callable, List, Optional
from uuid import UUID

if TYPE_CHECKING:
    from omni_music.infrastructure.audio_converter import FFmpegConverter

from omni_music.domain import AudioFormat, MusicService, Playlist, Track


@dataclass
class DownloadTrackRequest:
    """Requête pour télécharger une piste"""
    url: str
    format: AudioFormat
    output_dir: Path
    progress_callback: Optional[Callable] = None


@dataclass
class DownloadTrackResponse:
    """Réponse du téléchargement d'une piste"""
    track: Optional[Track]
    file_path: Optional[Path]
    success: bool
    error_message: Optional[str] = None


class DownloadTrackUseCase:
    """Cas d'usage : Télécharger une piste audio"""

    def __init__(self, music_service: MusicService):
        self.music_service = music_service

    async def execute(self, request: DownloadTrackRequest) -> DownloadTrackResponse:
        """
        Exécute le téléchargement d'une piste

        Args:
            request: Les paramètres de la requête

        Returns:
            DownloadTrackResponse: Le résultat du téléchargement
        """
        try:
            # Créer le dossier de sortie s'il n'existe pas
            request.output_dir.mkdir(parents=True, exist_ok=True)

            # Télécharger la piste
            track = await self.music_service.download_track(
                url=request.url,
                format=request.format,
                output_dir=request.output_dir,
                progress_callback=request.progress_callback
            )

            return DownloadTrackResponse(
                track=track,
                file_path=track.file_path,
                success=True
            )

        except Exception as e:
            return DownloadTrackResponse(
                track=None,
                file_path=None,
                success=False,
                error_message=str(e)
            )


@dataclass
class SearchTracksRequest:
    """Requête pour rechercher des pistes"""
    query: str
    source: Optional[str] = None
    limit: int = 20


@dataclass
class SearchTracksResponse:
    """Réponse de la recherche de pistes"""
    tracks: List[Track]
    total_results: int
    success: bool
    error_message: Optional[str] = None


class SearchTracksUseCase:
    """Cas d'usage : Rechercher des pistes"""

    def __init__(self, music_service: MusicService):
        self.music_service = music_service

    async def execute(self, request: SearchTracksRequest) -> SearchTracksResponse:
        """
        Exécute la recherche de pistes

        Args:
            request: Les paramètres de recherche

        Returns:
            SearchTracksResponse: Les résultats de la recherche
        """
        try:
            tracks = await self.music_service.search_tracks(
                query=request.query,
                source=request.source
            )

            # Limiter les résultats
            limited_tracks = tracks[:request.limit]

            return SearchTracksResponse(
                tracks=limited_tracks,
                total_results=len(tracks),
                success=True
            )

        except Exception as e:
            return SearchTracksResponse(
                tracks=[],
                total_results=0,
                success=False,
                error_message=str(e)
            )


@dataclass
class CreatePlaylistRequest:
    """Requête pour créer une playlist"""
    name: str
    description: str = ""
    track_ids: Optional[List[UUID]] = None


@dataclass
class CreatePlaylistResponse:
    """Réponse de la création de playlist"""
    playlist: Optional[Playlist]
    success: bool
    error_message: Optional[str] = None


class CreatePlaylistUseCase:
    """Cas d'usage : Créer une nouvelle playlist"""

    def __init__(self, music_service: MusicService):
        self.music_service = music_service

    async def execute(self, request: CreatePlaylistRequest) -> CreatePlaylistResponse:
        """
        Exécute la création d'une playlist

        Args:
            request: Les paramètres de la playlist

        Returns:
            CreatePlaylistResponse: La playlist créée
        """
        try:
            playlist = await self.music_service.create_playlist(
                name=request.name,
                description=request.description,
                track_ids=request.track_ids
            )

            return CreatePlaylistResponse(
                playlist=playlist,
                success=True
            )

        except Exception as e:
            return CreatePlaylistResponse(
                playlist=None,
                success=False,
                error_message=str(e)
            )


@dataclass
class SyncPlaylistRequest:
    """Requête pour synchroniser une playlist externe"""
    playlist_url: str
    format: AudioFormat
    output_dir: Path


@dataclass
class SyncPlaylistResponse:
    """Réponse de la synchronisation de playlist"""
    playlist: Optional[Playlist]
    downloaded_count: int
    failed_count: int
    success: bool
    error_message: Optional[str] = None


class SyncPlaylistUseCase:
    """Cas d'usage : Synchroniser une playlist depuis une source externe"""

    def __init__(self, music_service: MusicService):
        self.music_service = music_service

    async def execute(self, request: SyncPlaylistRequest) -> SyncPlaylistResponse:
        """
        Exécute la synchronisation d'une playlist

        Args:
            request: Les paramètres de synchronisation

        Returns:
            SyncPlaylistResponse: Le résultat de la synchronisation
        """
        try:
            # Créer le dossier de sortie
            request.output_dir.mkdir(parents=True, exist_ok=True)

            # Synchroniser la playlist
            playlist = await self.music_service.sync_playlist_from_url(
                playlist_url=request.playlist_url,
                format=request.format,
                output_dir=request.output_dir
            )

            # Compter les pistes téléchargées
            downloaded = sum(1 for track in playlist.tracks if track.is_downloaded)
            failed = len(playlist.tracks) - downloaded

            return SyncPlaylistResponse(
                playlist=playlist,
                downloaded_count=downloaded,
                failed_count=failed,
                success=True
            )

        except Exception as e:
            return SyncPlaylistResponse(
                playlist=None,
                downloaded_count=0,
                failed_count=0,
                success=False,
                error_message=str(e)
            )


@dataclass
class ConvertAudioRequest:
    """Requête pour convertir un fichier audio"""
    source_path: Path
    target_format: AudioFormat
    output_dir: Optional[Path] = None


@dataclass
class ConvertAudioResponse:
    """Réponse de la conversion audio"""
    output_path: Optional[Path]
    success: bool
    error_message: Optional[str] = None


class ConvertAudioUseCase:
    """Cas d'usage : Convertir un fichier audio vers un autre format"""

    def __init__(self, audio_converter: "FFmpegConverter") -> None:
        self.audio_converter = audio_converter

    async def execute(self, request: ConvertAudioRequest) -> ConvertAudioResponse:
        """
        Exécute la conversion d'un fichier audio

        Args:
            request: Les paramètres de conversion

        Returns:
            ConvertAudioResponse: Le résultat de la conversion
        """
        try:
            # Déterminer le dossier de sortie
            output_dir = request.output_dir or request.source_path.parent
            output_dir.mkdir(parents=True, exist_ok=True)

            # Générer le nom du fichier de sortie
            output_name = request.source_path.stem + "." + request.target_format.extension
            output_path = output_dir / output_name

            # Convertir le fichier
            await self.audio_converter.convert(
                source=str(request.source_path),
                output=str(output_path),
                format=request.target_format
            )

            return ConvertAudioResponse(
                output_path=output_path,
                success=True
            )

        except Exception as e:
            return ConvertAudioResponse(
                output_path=None,
                success=False,
                error_message=str(e)
            )
