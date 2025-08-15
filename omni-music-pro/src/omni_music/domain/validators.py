"""
Validation robuste des données d'entrée
Sécurisation et validation des inputs utilisateur
"""

from enum import Enum
from pathlib import Path
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

# ValidationError est importée de pydantic directement
from omni_music.domain.models import AudioFormat


class SupportedSources(str, Enum):
    """Sources supportées pour validation"""
    YOUTUBE = "youtube"
    YOUTU_BE = "youtu.be"


class DownloadRequest(BaseModel):
    """Validation pour les requêtes de téléchargement"""
    url: str = Field(..., description="URL de la piste à télécharger")
    format: AudioFormat = Field(default=AudioFormat.MP3_320, description="Format audio souhaité")
    output_dir: str = Field(..., description="Répertoire de destination")

    @field_validator('url')
    @classmethod
    def validate_supported_url(cls, v: str) -> str:
        """Valide que l'URL est supportée"""
        if not v or not isinstance(v, str):
            raise ValueError("URL is required and must be a string")

        # Vérifier le format URL
        if not (v.startswith('http://') or v.startswith('https://')):
            raise ValueError("URL must start with http:// or https://")

        # Vérifier les sources supportées
        supported_patterns = [
            'youtube.com/watch',
            'youtube.com/playlist',
            'youtu.be/',
            'youtube.com/shorts/'
        ]

        if not any(pattern in v for pattern in supported_patterns):
            raise ValueError(
                f"Unsupported URL format. Supported: YouTube videos, playlists, shorts. Got: {v}"
            )

        return v

    @field_validator('output_dir', mode='after')
    @classmethod
    def validate_output_directory(cls, v: str) -> str:
        """Valide le répertoire de destination"""
        if not v:
            raise ValueError("Output directory is required")

        path = Path(v)

        # Vérifier que le chemin est valide
        try:
            path.resolve()
        except (OSError, ValueError) as e:
            raise ValueError(f"Invalid directory path: {e}") from e

        # Créer le répertoire si nécessaire
        try:
            path.mkdir(parents=True, exist_ok=True)
        except PermissionError:
            raise ValueError(f"No permission to create directory: {path}") from None
        except OSError as e:
            raise ValueError(f"Cannot create directory: {e}") from e

        return str(path)


class SearchRequest(BaseModel):
    """Validation pour les requêtes de recherche"""
    query: str = Field(..., min_length=1, max_length=200, description="Terme de recherche")
    limit: int = Field(default=10, ge=1, le=50, description="Nombre maximum de résultats")

    @field_validator('query', mode='after')
    @classmethod
    def validate_search_query(cls, v: str) -> str:
        """Valide et nettoie la requête de recherche"""
        if not v or not v.strip():
            raise ValueError("Search query cannot be empty")

        # Nettoyer la requête
        cleaned = v.strip()

        # Vérifier la longueur après nettoyage
        if len(cleaned) < 1:
            raise ValueError("Search query too short")

        max_query_length = 200
        if len(cleaned) > max_query_length:
            raise ValueError(f"Search query too long (max {max_query_length} characters)")

        # Vérifier les caractères dangereux
        dangerous_chars = ['<', '>', '"', "'", '&', ';', '|']
        if any(char in cleaned for char in dangerous_chars):
            raise ValueError("Search query contains invalid characters")

        return cleaned


class PlaylistRequest(BaseModel):
    """Validation pour les requêtes de playlist"""
    name: str = Field(..., min_length=1, max_length=100, description="Nom de la playlist")
    description: Optional[str] = Field(default="", max_length=500, description="Description de la playlist")
    track_ids: Optional[List[str]] = Field(default_factory=list, description="IDs des pistes à inclure")

    @field_validator('name', mode='after')
    @classmethod
    def validate_playlist_name(cls, v: str) -> str:
        """Valide le nom de la playlist"""
        if not v or not v.strip():
            raise ValueError("Playlist name is required")

        cleaned = v.strip()

        # Caractères interdits pour noms de fichiers
        forbidden_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
        if any(char in cleaned for char in forbidden_chars):
            raise ValueError(f"Playlist name contains forbidden characters: {forbidden_chars}")

        return cleaned

    @field_validator('description')
    @classmethod
    def validate_description(cls, v: Optional[str]) -> str:
        """Valide la description"""
        if v is None:
            return ""

        return v.strip()

    @field_validator('track_ids', mode='after')
    @classmethod
    def validate_track_ids(cls, v: Optional[List[str]]) -> List[str]:
        """Valide la liste des IDs de pistes"""
        if not v:
            return []

        # Vérifier que tous les IDs sont des UUIDs valides
        import uuid
        validated_ids = []

        for track_id in v:
            if not isinstance(track_id, str):
                raise ValueError(f"Track ID must be string, got: {type(track_id)}")

            try:
                # Valider le format UUID
                uuid.UUID(track_id)
                validated_ids.append(track_id)
            except ValueError:
                raise ValueError(f"Invalid track ID format: {track_id}") from None

        return validated_ids


class Config(BaseModel):
    """Validation pour la configuration de l'application"""
    app_dir: str = Field(..., description="Répertoire principal de l'application")
    downloads_dir: str = Field(..., description="Répertoire de téléchargements")
    database_path: str = Field(..., description="Chemin vers la base de données")
    playlists_dir: str = Field(..., description="Répertoire des playlists")

    @field_validator('app_dir', 'downloads_dir', 'playlists_dir', mode='after')
    @classmethod
    def validate_directories(cls, v: str) -> str:
        """Valide les répertoires"""
        if not v:
            raise ValueError("Directory path is required")

        path = Path(v)

        try:
            path.mkdir(parents=True, exist_ok=True)
        except (PermissionError, OSError) as e:
            raise ValueError(f"Cannot create directory {path}: {e}") from e

        return str(path.resolve())

    @field_validator('database_path', mode='after')
    @classmethod
    def validate_database_path(cls, v: str) -> str:
        """Valide le chemin de la base de données"""
        if not v:
            raise ValueError("Database path is required")

        path = Path(v)

        # Vérifier que le répertoire parent existe ou peut être créé
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
        except (PermissionError, OSError) as e:
            raise ValueError(f"Cannot create database directory: {e}") from e

        return str(path.resolve())


def validate_download_request(url: str, format: AudioFormat, output_dir: str) -> DownloadRequest:
    """Helper pour valider une requête de téléchargement"""
    try:
        return DownloadRequest(
            url=url,
            format=format,
            output_dir=output_dir
        )
    except Exception as e:
        raise ValueError(f"Invalid download request: {e}") from e


def validate_search_request(query: str, limit: int = 10) -> SearchRequest:
    """Helper pour valider une requête de recherche"""
    try:
        return SearchRequest(query=query, limit=limit)
    except Exception as e:
        raise ValueError(f"Invalid search request: {e}") from e


def validate_playlist_request(name: str, description: str = "", track_ids: Optional[List[str]] = None) -> PlaylistRequest:
    """Helper pour valider une requête de playlist"""
    try:
        return PlaylistRequest(
            name=name,
            description=description,
            track_ids=track_ids or []
        )
    except Exception as e:
        raise ValueError(f"Invalid playlist request: {e}") from e


# Validation rapide pour URLs courantes
def quick_url_check(url: str) -> bool:
    """Validation rapide d'URL sans lever d'exception"""
    if not url or not isinstance(url, str):
        return False

    if not (url.startswith('http://') or url.startswith('https://')):
        return False

    youtube_patterns = ['youtube.com', 'youtu.be']
    return any(pattern in url for pattern in youtube_patterns)
