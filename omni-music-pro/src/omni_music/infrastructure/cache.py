"""
Système de cache pour optimiser les performances
"""

import hashlib
import json
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Optional

from omni_music.domain import Track


@dataclass
class CacheEntry:
    """Entrée de cache avec TTL"""
    data: Any
    created_at: float
    ttl: int  # Time to live en secondes

    def is_expired(self) -> bool:
        """Vérifie si l'entrée est expirée"""
        return time.time() - self.created_at > self.ttl

    def to_dict(self) -> dict:
        """Conversion en dictionnaire pour JSON"""
        return {
            'data': self.data,
            'created_at': self.created_at,
            'ttl': self.ttl
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'CacheEntry':
        """Création depuis dictionnaire"""
        return cls(
            data=data['data'],
            created_at=data['created_at'],
            ttl=data['ttl']
        )


class TrackInfoCache:
    """Cache pour les informations de pistes"""

    def __init__(self, cache_dir: Path, default_ttl: int = 3600):
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.cache_file = self.cache_dir / "track_info_cache.json"
        self.default_ttl = default_ttl
        self._cache: Dict[str, CacheEntry] = {}
        self._load_cache()

    def _generate_key(self, url: str) -> str:
        """Génère une clé unique pour l'URL"""
        return hashlib.md5(url.encode()).hexdigest()

    def _load_cache(self) -> None:
        """Charge le cache depuis le disque"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, encoding='utf-8') as f:
                    data = json.load(f)
                    for key, entry_data in data.items():
                        entry = CacheEntry.from_dict(entry_data)
                        if not entry.is_expired():
                            self._cache[key] = entry
            except Exception:
                # En cas d'erreur, on ignore le cache
                pass

    def _save_cache(self) -> None:
        """Sauvegarde le cache sur disque"""
        try:
            # Nettoyer les entrées expirées
            self._cleanup_expired()

            # Sauvegarder
            data = {key: entry.to_dict() for key, entry in self._cache.items()}
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception:
            # En cas d'erreur, on continue sans cache
            pass

    def _cleanup_expired(self) -> None:
        """Nettoie les entrées expirées"""
        expired_keys = [
            key for key, entry in self._cache.items()
            if entry.is_expired()
        ]
        for key in expired_keys:
            del self._cache[key]

    def get(self, url: str) -> Optional[Track]:
        """Récupère une piste depuis le cache"""
        key = self._generate_key(url)
        entry = self._cache.get(key)

        if entry and not entry.is_expired():
            # Convertir les données en Track
            try:
                from omni_music.domain.models import Artist, Track
                track_data = entry.data

                # Reconstruire l'objet Track
                artist = None
                if track_data.get('artist'):
                    artist = Artist(
                        name=track_data['artist'].get('name', '')
                    )

                track = Track(
                    title=track_data.get('title', ''),
                    artist=artist,
                    duration_seconds=track_data.get('duration_seconds', 0),
                    source_url=track_data.get('source_url', ''),
                    metadata=track_data.get('metadata', {})
                )
                return track
            except Exception:
                # En cas d'erreur de désérialisation, supprimer l'entrée
                del self._cache[key]
                return None

        return None

    def set(self, url: str, track: Track, ttl: Optional[int] = None) -> None:
        """Met en cache une piste"""
        key = self._generate_key(url)

        # Convertir Track en dictionnaire
        track_data = {
            'title': track.title,
            'artist': {
                'name': track.artist.name if track.artist else ''
            } if track.artist else None,
            'duration_seconds': track.duration_seconds,
            'source_url': track.source_url,
            'metadata': track.metadata or {}
        }

        entry = CacheEntry(
            data=track_data,
            created_at=time.time(),
            ttl=ttl or self.default_ttl
        )

        self._cache[key] = entry
        self._save_cache()

    def invalidate(self, url: str) -> None:
        """Invalide une entrée du cache"""
        key = self._generate_key(url)
        if key in self._cache:
            del self._cache[key]
            self._save_cache()

    def clear(self) -> None:
        """Vide complètement le cache"""
        self._cache.clear()
        if self.cache_file.exists():
            self.cache_file.unlink()


class DownloadSpeedTracker:
    """Suivi des vitesses de téléchargement pour optimisation"""

    def __init__(self, cache_dir: Path):
        self.stats_file = cache_dir / "download_stats.json"
        self.stats: Dict[str, Dict] = {}
        self._load_stats()

    def _load_stats(self) -> None:
        """Charge les statistiques"""
        if self.stats_file.exists():
            try:
                with open(self.stats_file) as f:
                    self.stats = json.load(f)
            except Exception:
                pass

    def _save_stats(self) -> None:
        """Sauvegarde les statistiques"""
        try:
            with open(self.stats_file, 'w') as f:
                json.dump(self.stats, f, indent=2)
        except Exception:
            pass

    def record_download(self, url: str, duration: float, file_size: int, format_name: str) -> None:
        """Enregistre les stats d'un téléchargement"""
        domain = self._extract_domain(url)

        if domain not in self.stats:
            self.stats[domain] = {
                'downloads': [],
                'avg_speed': 0,
                'best_format': format_name,
                'total_downloads': 0
            }

        speed_kbps = (file_size / 1024) / duration if duration > 0 else 0

        # Garder seulement les 10 derniers téléchargements
        downloads = self.stats[domain]['downloads']
        downloads.append({
            'speed_kbps': speed_kbps,
            'duration': duration,
            'size': file_size,
            'format': format_name,
            'timestamp': time.time()
        })

        max_download_history = 10
        if len(downloads) > max_download_history:
            downloads.pop(0)

        # Calculer la moyenne
        self.stats[domain]['avg_speed'] = sum(d['speed_kbps'] for d in downloads) / len(downloads)
        self.stats[domain]['total_downloads'] += 1

        self._save_stats()

    def get_optimal_format(self, url: str) -> Optional[str]:
        """Retourne le format optimal basé sur l'historique"""
        domain = self._extract_domain(url)

        if domain in self.stats and self.stats[domain]['downloads']:
            # Analyser les formats les plus rapides
            format_speeds: dict[str, list[float]] = {}
            for download in self.stats[domain]['downloads']:
                format_name = download['format']
                if format_name not in format_speeds:
                    format_speeds[format_name] = []
                format_speeds[format_name].append(download['speed_kbps'])

            # Retourner le format avec la meilleure moyenne
            best_format = max(
                format_speeds.items(),
                key=lambda x: sum(x[1]) / len(x[1])
            )
            return best_format[0]

        return None

    def _extract_domain(self, url: str) -> str:
        """Extrait le domaine d'une URL"""
        try:
            from urllib.parse import urlparse
            return urlparse(url).netloc
        except Exception:
            return "unknown"
