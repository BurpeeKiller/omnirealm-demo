"""
Implémentations concrètes des repositories
"""

import contextlib
import json
import sqlite3
from pathlib import Path
from typing import Any, List, Optional
from uuid import UUID

import aiosqlite

from omni_music.domain import Playlist, PlaylistRepository, Track, TrackRepository


class SQLiteTrackRepository(TrackRepository):
    """Implémentation SQLite pour la persistance des pistes"""

    def __init__(self, db_path: Path):
        self.db_path = db_path
        self._ensure_tables()

    def _ensure_tables(self) -> None:
        """Crée les tables si elles n'existent pas"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS tracks (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    artist_name TEXT,
                    album_title TEXT,
                    duration_seconds INTEGER,
                    file_path TEXT,
                    format TEXT,
                    source_url TEXT,
                    download_date TIMESTAMP,
                    metadata TEXT
                )
            """)
            conn.commit()

    async def save(self, track: Track) -> None:
        """Sauvegarde une piste"""
        async with aiosqlite.connect(self.db_path) as conn:
            await conn.execute("""
                INSERT OR REPLACE INTO tracks
                (id, title, artist_name, album_title, duration_seconds,
                 file_path, format, source_url, download_date, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                str(track.id),
                track.title,
                track.artist.name if track.artist else None,
                track.album.title if track.album else None,
                track.duration_seconds,
                str(track.file_path) if track.file_path else None,
                track.format.value if track.format else None,
                track.source_url,
                track.download_date,
                json.dumps(track.metadata)
            ))
            await conn.commit()

    async def get_by_id(self, track_id: UUID) -> Optional[Track]:
        """Récupère une piste par son ID"""
        async with aiosqlite.connect(self.db_path) as conn:
            cursor = await conn.execute(
                "SELECT * FROM tracks WHERE id = ?",
                (str(track_id),)
            )
            row = await cursor.fetchone()
            if row:
                return self._row_to_track(row)
        return None

    async def get_by_title(self, title: str) -> List[Track]:
        """Recherche des pistes par titre"""
        async with aiosqlite.connect(self.db_path) as conn:
            cursor = await conn.execute(
                "SELECT * FROM tracks WHERE title LIKE ? ORDER BY title",
                (f"%{title}%",)
            )
            rows = await cursor.fetchall()
            return [self._row_to_track(row) for row in rows]

    async def get_by_artist(self, artist_name: str) -> List[Track]:
        """Recherche des pistes par artiste"""
        async with aiosqlite.connect(self.db_path) as conn:
            cursor = await conn.execute(
                "SELECT * FROM tracks WHERE artist_name LIKE ? ORDER BY title",
                (f"%{artist_name}%",)
            )
            rows = await cursor.fetchall()
            return [self._row_to_track(row) for row in rows]

    async def get_all(self) -> List[Track]:
        """Récupère toutes les pistes"""
        async with aiosqlite.connect(self.db_path) as conn:
            cursor = await conn.execute(
                "SELECT * FROM tracks ORDER BY download_date DESC"
            )
            rows = await cursor.fetchall()
            return [self._row_to_track(row) for row in rows]

    async def delete(self, track_id: UUID) -> bool:
        """Supprime une piste"""
        async with aiosqlite.connect(self.db_path) as conn:
            cursor = await conn.execute(
                "DELETE FROM tracks WHERE id = ?",
                (str(track_id),)
            )
            await conn.commit()
            return cursor.rowcount > 0

    async def exists(self, track_id: UUID) -> bool:
        """Vérifie si une piste existe"""
        async with aiosqlite.connect(self.db_path) as conn:
            cursor = await conn.execute(
                "SELECT 1 FROM tracks WHERE id = ? LIMIT 1",
                (str(track_id),)
            )
            row = await cursor.fetchone()
            return row is not None

    def _row_to_track(self, row: Any) -> Track:
        """Convertit une ligne de base en Track"""
        from datetime import datetime

        from omni_music.domain import Album, Artist, AudioFormat

        # Reconstruction des objets
        artist = Artist(name=row[2]) if row[2] else None
        album = Album(title=row[3], artist=artist) if row[3] else None

        # Conversion du format
        format_value = None
        if row[6]:
            with contextlib.suppress(ValueError):
                format_value = AudioFormat(row[6])

        # Métadonnées
        metadata = json.loads(row[9]) if row[9] else {}

        return Track(
            id=UUID(row[0]),
            title=row[1],
            artist=artist,
            album=album,
            duration_seconds=row[4] or 0,
            file_path=Path(row[5]) if row[5] else None,
            format=format_value,
            source_url=row[7],
            download_date=datetime.fromisoformat(row[8]) if row[8] else datetime.now(),
            metadata=metadata
        )


class JSONPlaylistRepository(PlaylistRepository):
    """Implémentation JSON pour la persistance des playlists"""

    def __init__(self, storage_dir: Path):
        self.storage_dir = storage_dir
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def _get_playlist_file(self, playlist_id: UUID) -> Path:
        """Retourne le chemin du fichier pour une playlist"""
        return self.storage_dir / f"{playlist_id}.json"

    def _playlist_to_dict(self, playlist: Playlist) -> dict:
        """Convertit une playlist en dictionnaire"""
        return {
            "id": str(playlist.id),
            "name": playlist.name,
            "description": playlist.description,
            "created_date": playlist.created_date.isoformat(),
            "modified_date": playlist.modified_date.isoformat(),
            "cover_url": playlist.cover_url,
            "is_public": playlist.is_public,
            "track_ids": [str(track.id) for track in playlist.tracks]
        }

    def _dict_to_playlist(self, data: dict, tracks: Optional[List[Track]] = None) -> Playlist:
        """Convertit un dictionnaire en playlist"""
        from datetime import datetime

        playlist = Playlist(
            id=UUID(data["id"]),
            name=data["name"],
            description=data["description"],
            created_date=datetime.fromisoformat(data["created_date"]),
            modified_date=datetime.fromisoformat(data["modified_date"]),
            cover_url=data.get("cover_url"),
            is_public=data.get("is_public", True)
        )

        if tracks:
            playlist.tracks = tracks

        return playlist

    async def save(self, playlist: Playlist) -> None:
        """Sauvegarde une playlist"""
        file_path = self._get_playlist_file(playlist.id)
        data = self._playlist_to_dict(playlist)

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    async def get_by_id(self, playlist_id: UUID) -> Optional[Playlist]:
        """Récupère une playlist par son ID"""
        file_path = self._get_playlist_file(playlist_id)

        if not file_path.exists():
            return None

        try:
            with open(file_path, encoding='utf-8') as f:
                data = json.load(f)

            # TODO: Charger les pistes depuis le TrackRepository
            # Pour l'instant, on retourne la playlist sans les pistes
            return self._dict_to_playlist(data)

        except (json.JSONDecodeError, KeyError, ValueError):
            return None

    async def get_by_name(self, name: str) -> List[Playlist]:
        """Recherche des playlists par nom"""
        playlists = []

        for file_path in self.storage_dir.glob("*.json"):
            try:
                with open(file_path, encoding='utf-8') as f:
                    data = json.load(f)

                if name.lower() in data["name"].lower():
                    playlist = self._dict_to_playlist(data)
                    playlists.append(playlist)

            except (json.JSONDecodeError, KeyError, ValueError):
                continue

        return sorted(playlists, key=lambda p: p.name)

    async def get_all(self) -> List[Playlist]:
        """Récupère toutes les playlists"""
        playlists = []

        for file_path in self.storage_dir.glob("*.json"):
            try:
                with open(file_path, encoding='utf-8') as f:
                    data = json.load(f)

                playlist = self._dict_to_playlist(data)
                playlists.append(playlist)

            except (json.JSONDecodeError, KeyError, ValueError):
                continue

        return sorted(playlists, key=lambda p: p.modified_date, reverse=True)

    async def delete(self, playlist_id: UUID) -> bool:
        """Supprime une playlist"""
        file_path = self._get_playlist_file(playlist_id)

        if file_path.exists():
            file_path.unlink()
            return True

        return False

    async def exists(self, playlist_id: UUID) -> bool:
        """Vérifie si une playlist existe"""
        file_path = self._get_playlist_file(playlist_id)
        return file_path.exists()
