"""
Infrastructure Layer - Adaptateurs externes

Cette couche contient les implémentations concrètes des interfaces
définies dans le domaine. Elle gère les interactions avec les systèmes externes.
"""

from .audio_converter import FFmpegConverter
from .cache import DownloadSpeedTracker, TrackInfoCache
from .config import AppConfig
from .container import Container
from .music_sources import DeezerSource, YouTubeSource
from .repositories import JSONPlaylistRepository, SQLiteTrackRepository

__all__ = [
    "SQLiteTrackRepository",
    "JSONPlaylistRepository",
    "YouTubeSource",
    "DeezerSource",
    "FFmpegConverter",
    "AppConfig",
    "Container",
    "TrackInfoCache",
    "DownloadSpeedTracker",
]
