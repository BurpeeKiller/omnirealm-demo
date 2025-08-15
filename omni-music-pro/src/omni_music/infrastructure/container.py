"""
Container d'injection de dépendances

Cette classe configure et fournit toutes les dépendances de l'application
selon les principes de l'inversion de dépendance.
"""

from typing import List, Optional

from omni_music.application import (
    CreatePlaylistUseCase,
    DownloadTrackUseCase,
    SearchTracksUseCase,
    SyncPlaylistUseCase,
)
from omni_music.domain import MusicService, MusicSourceRepository

from .config import AppConfig
from .music_sources import YouTubeSource
from .repositories import JSONPlaylistRepository, SQLiteTrackRepository


class Container:
    """Container principal pour l'injection de dépendances"""

    def __init__(self, config: Optional[AppConfig] = None):
        self.config = config or AppConfig.load()

        # Cache des instances
        self._track_repository: Optional[SQLiteTrackRepository] = None
        self._playlist_repository: Optional[JSONPlaylistRepository] = None
        self._music_sources: Optional[List[MusicSourceRepository]] = None
        self._music_service: Optional[MusicService] = None

        # Use cases
        self._download_track_use_case: Optional[DownloadTrackUseCase] = None
        self._search_tracks_use_case: Optional[SearchTracksUseCase] = None
        self._create_playlist_use_case: Optional[CreatePlaylistUseCase] = None
        self._sync_playlist_use_case: Optional[SyncPlaylistUseCase] = None

    def track_repository(self) -> SQLiteTrackRepository:
        """Fournit le repository des pistes"""
        if self._track_repository is None:
            self._track_repository = SQLiteTrackRepository(self.config.database_path)
        return self._track_repository

    def playlist_repository(self) -> JSONPlaylistRepository:
        """Fournit le repository des playlists"""
        if self._playlist_repository is None:
            self._playlist_repository = JSONPlaylistRepository(self.config.playlists_dir)
        return self._playlist_repository

    def music_sources(self) -> List[MusicSourceRepository]:
        """Fournit les sources musicales"""
        if self._music_sources is None:
            self._music_sources = [
                YouTubeSource(self.config.downloads_dir),
                # DeezerSource(),  # Désactivé car pas d'API publique pour le téléchargement
            ]
        return self._music_sources

    def music_service(self) -> MusicService:
        """Fournit le service musical principal"""
        if self._music_service is None:
            self._music_service = MusicService(
                track_repository=self.track_repository(),
                playlist_repository=self.playlist_repository(),
                music_sources=self.music_sources()
            )
        return self._music_service

    # Use Cases

    def download_track_use_case(self) -> DownloadTrackUseCase:
        """Fournit le cas d'usage de téléchargement"""
        if self._download_track_use_case is None:
            self._download_track_use_case = DownloadTrackUseCase(self.music_service())
        return self._download_track_use_case

    def search_tracks_use_case(self) -> SearchTracksUseCase:
        """Fournit le cas d'usage de recherche"""
        if self._search_tracks_use_case is None:
            self._search_tracks_use_case = SearchTracksUseCase(self.music_service())
        return self._search_tracks_use_case

    def create_playlist_use_case(self) -> CreatePlaylistUseCase:
        """Fournit le cas d'usage de création de playlist"""
        if self._create_playlist_use_case is None:
            self._create_playlist_use_case = CreatePlaylistUseCase(self.music_service())
        return self._create_playlist_use_case

    def sync_playlist_use_case(self) -> SyncPlaylistUseCase:
        """Fournit le cas d'usage de synchronisation de playlist"""
        if self._sync_playlist_use_case is None:
            self._sync_playlist_use_case = SyncPlaylistUseCase(self.music_service())
        return self._sync_playlist_use_case
