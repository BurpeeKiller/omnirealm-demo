"""
Interfaces des repositories (Ports)

Ces interfaces définissent les contrats pour l'accès aux données.
Les implémentations concrètes seront dans la couche infrastructure.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from .models import AudioFormat, Playlist, Track


class TrackRepository(ABC):
    """Interface pour la persistance des pistes audio"""

    @abstractmethod
    async def save(self, track: Track) -> None:
        """Sauvegarde une piste"""
        pass

    @abstractmethod
    async def get_by_id(self, track_id: UUID) -> Optional[Track]:
        """Récupère une piste par son ID"""
        pass

    @abstractmethod
    async def get_by_title(self, title: str) -> List[Track]:
        """Recherche des pistes par titre"""
        pass

    @abstractmethod
    async def get_by_artist(self, artist_name: str) -> List[Track]:
        """Recherche des pistes par artiste"""
        pass

    @abstractmethod
    async def get_all(self) -> List[Track]:
        """Récupère toutes les pistes"""
        pass

    @abstractmethod
    async def delete(self, track_id: UUID) -> bool:
        """Supprime une piste"""
        pass

    @abstractmethod
    async def exists(self, track_id: UUID) -> bool:
        """Vérifie si une piste existe"""
        pass


class PlaylistRepository(ABC):
    """Interface pour la persistance des playlists"""

    @abstractmethod
    async def save(self, playlist: Playlist) -> None:
        """Sauvegarde une playlist"""
        pass

    @abstractmethod
    async def get_by_id(self, playlist_id: UUID) -> Optional[Playlist]:
        """Récupère une playlist par son ID"""
        pass

    @abstractmethod
    async def get_by_name(self, name: str) -> List[Playlist]:
        """Recherche des playlists par nom"""
        pass

    @abstractmethod
    async def get_all(self) -> List[Playlist]:
        """Récupère toutes les playlists"""
        pass

    @abstractmethod
    async def delete(self, playlist_id: UUID) -> bool:
        """Supprime une playlist"""
        pass

    @abstractmethod
    async def exists(self, playlist_id: UUID) -> bool:
        """Vérifie si une playlist existe"""
        pass


class MusicSourceRepository(ABC):
    """Interface pour les sources de musique (YouTube, Deezer, etc.)"""

    @abstractmethod
    async def search_tracks(self, query: str, limit: int = 10) -> List[Track]:
        """Recherche des pistes sur la source"""
        pass

    @abstractmethod
    async def get_track_info(self, url: str) -> Optional[Track]:
        """Récupère les informations d'une piste depuis son URL"""
        pass

    @abstractmethod
    async def download_track(
        self,
        track: Track,
        output_path: str,
        format: AudioFormat
    ) -> str:
        """Télécharge une piste dans le format spécifié"""
        pass

    @abstractmethod
    async def get_playlist_tracks(self, playlist_url: str) -> List[Track]:
        """Récupère toutes les pistes d'une playlist"""
        pass

    @abstractmethod
    def is_supported_url(self, url: str) -> bool:
        """Vérifie si l'URL est supportée par cette source"""
        pass
