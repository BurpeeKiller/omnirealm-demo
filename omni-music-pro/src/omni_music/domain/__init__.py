"""
Domain Layer - Cœur métier de l'application

Ce module contient la logique métier pure, sans dépendances externes.
Toutes les règles métier et entités du domaine sont définies ici.
"""

from .exceptions import (
    ConversionError,
    DomainError,
    DownloadError,
    InvalidFormatError,
    MetadataError,
    PlaylistNotFoundError,
    QuotaExceededError,
    TrackNotFoundError,
)
from .models import Album, Artist, AudioFormat, Playlist, Track
from .repositories import MusicSourceRepository, PlaylistRepository, TrackRepository
from .services import MusicService

__all__ = [
    # Models
    "Track",
    "Playlist",
    "Album",
    "Artist",
    "AudioFormat",
    # Services
    "MusicService",
    # Repositories (interfaces)
    "TrackRepository",
    "PlaylistRepository",
    "MusicSourceRepository",
    # Exceptions
    "DomainError",
    "TrackNotFoundError",
    "PlaylistNotFoundError",
    "InvalidFormatError",
    "DownloadError",
    "ConversionError",
    "MetadataError",
    "QuotaExceededError",
]
