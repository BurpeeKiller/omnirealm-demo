"""
Modèles du domaine - Entités métier

Ces classes représentent les concepts métier de l'application.
Elles sont pures et ne dépendent d'aucune technologie externe.
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import List, Optional
from uuid import UUID, uuid4


class AudioFormat(Enum):
    """Formats audio supportés"""
    MP3_128 = "mp3_128"
    MP3_192 = "mp3_192"
    MP3_320 = "mp3_320"
    FLAC = "flac"
    WAV = "wav"
    AAC = "aac"
    OGG = "ogg"
    OPUS = "opus"

    @property
    def extension(self) -> str:
        """Retourne l'extension de fichier pour ce format"""
        if self.value.startswith("mp3"):
            return "mp3"
        return self.value

    @property
    def bitrate(self) -> Optional[int]:
        """Retourne le bitrate pour les formats MP3"""
        if self.value.startswith("mp3_"):
            return int(self.value.split("_")[1])
        return None


@dataclass
class Artist:
    """Représente un artiste musical"""
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    picture_url: Optional[str] = None

    def __post_init__(self) -> None:
        if not self.name:
            raise ValueError("Artist name cannot be empty")


@dataclass
class Album:
    """Représente un album musical"""
    id: UUID = field(default_factory=uuid4)
    title: str = ""
    artist: Optional[Artist] = None
    cover_url: Optional[str] = None
    release_date: Optional[datetime] = None
    total_tracks: int = 0

    def __post_init__(self) -> None:
        if not self.title:
            raise ValueError("Album title cannot be empty")


@dataclass
class Track:
    """Représente une piste audio"""
    id: UUID = field(default_factory=uuid4)
    title: str = ""
    artist: Optional[Artist] = None
    album: Optional[Album] = None
    duration_seconds: int = 0
    file_path: Optional[Path] = None
    format: Optional[AudioFormat] = None
    source_url: Optional[str] = None
    download_date: datetime = field(default_factory=datetime.now)
    metadata: dict = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not self.title:
            raise ValueError("Track title cannot be empty")
        if self.duration_seconds < 0:
            raise ValueError("Duration cannot be negative")

    @property
    def duration_formatted(self) -> str:
        """Retourne la durée formatée (MM:SS)"""
        minutes = self.duration_seconds // 60
        seconds = self.duration_seconds % 60
        return f"{minutes:02d}:{seconds:02d}"

    @property
    def is_downloaded(self) -> bool:
        """Vérifie si le fichier existe sur le disque"""
        return self.file_path is not None and self.file_path.exists()

    def get_file_size_mb(self) -> Optional[float]:
        """Retourne la taille du fichier en MB"""
        if self.is_downloaded and self.file_path:
            return self.file_path.stat().st_size / (1024 * 1024)
        return None


@dataclass
class Playlist:
    """Représente une playlist"""
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    description: str = ""
    tracks: List[Track] = field(default_factory=list)
    created_date: datetime = field(default_factory=datetime.now)
    modified_date: datetime = field(default_factory=datetime.now)
    cover_url: Optional[str] = None
    is_public: bool = True

    def __post_init__(self) -> None:
        if not self.name:
            raise ValueError("Playlist name cannot be empty")

    def add_track(self, track: Track) -> None:
        """Ajoute une piste à la playlist"""
        if track not in self.tracks:
            self.tracks.append(track)
            self.modified_date = datetime.now()

    def remove_track(self, track_id: UUID) -> bool:
        """Retire une piste de la playlist"""
        initial_length = len(self.tracks)
        self.tracks = [t for t in self.tracks if t.id != track_id]
        if len(self.tracks) < initial_length:
            self.modified_date = datetime.now()
            return True
        return False

    @property
    def total_duration(self) -> int:
        """Durée totale de la playlist en secondes"""
        return sum(track.duration_seconds for track in self.tracks)

    @property
    def total_duration_formatted(self) -> str:
        """Durée totale formatée (HH:MM:SS)"""
        total = self.total_duration
        hours = total // 3600
        minutes = (total % 3600) // 60
        seconds = total % 60
        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        return f"{minutes:02d}:{seconds:02d}"

    @property
    def track_count(self) -> int:
        """Nombre de pistes dans la playlist"""
        return len(self.tracks)
