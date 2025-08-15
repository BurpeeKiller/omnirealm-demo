"""
Application Layer - Cas d'usage et orchestration

Cette couche contient les cas d'usage de l'application.
Elle orchestre les appels entre le domaine et l'infrastructure.
"""

from .use_cases import (
    ConvertAudioRequest,
    ConvertAudioResponse,
    ConvertAudioUseCase,
    CreatePlaylistRequest,
    CreatePlaylistResponse,
    CreatePlaylistUseCase,
    DownloadTrackRequest,
    DownloadTrackResponse,
    DownloadTrackUseCase,
    SearchTracksRequest,
    SearchTracksResponse,
    SearchTracksUseCase,
    SyncPlaylistRequest,
    SyncPlaylistResponse,
    SyncPlaylistUseCase,
)

__all__ = [
    # Use Cases
    "DownloadTrackUseCase",
    "SearchTracksUseCase",
    "CreatePlaylistUseCase",
    "SyncPlaylistUseCase",
    "ConvertAudioUseCase",
    # DTOs
    "DownloadTrackRequest",
    "DownloadTrackResponse",
    "SearchTracksRequest",
    "SearchTracksResponse",
    "CreatePlaylistRequest",
    "CreatePlaylistResponse",
    "SyncPlaylistRequest",
    "SyncPlaylistResponse",
    "ConvertAudioRequest",
    "ConvertAudioResponse",
]
