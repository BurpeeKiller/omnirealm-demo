"""
Exceptions du domaine

Toutes les exceptions métier spécifiques à notre domaine.
"""


class DomainError(Exception):
    """Exception de base pour toutes les erreurs du domaine"""
    pass


class TrackNotFoundError(DomainError):
    """Levée quand une piste n'est pas trouvée"""
    def __init__(self, track_id: str):
        super().__init__(f"Track with id '{track_id}' not found")
        self.track_id = track_id


class PlaylistNotFoundError(DomainError):
    """Levée quand une playlist n'est pas trouvée"""
    def __init__(self, playlist_id: str):
        super().__init__(f"Playlist with id '{playlist_id}' not found")
        self.playlist_id = playlist_id


class InvalidFormatError(DomainError):
    """Levée quand un format audio n'est pas valide"""
    def __init__(self, format_name: str):
        super().__init__(f"Invalid audio format: '{format_name}'")
        self.format_name = format_name


class DownloadError(DomainError):
    """Levée quand un téléchargement échoue"""
    def __init__(self, url: str, reason: str):
        super().__init__(f"Failed to download from '{url}': {reason}")
        self.url = url
        self.reason = reason


class ConversionError(DomainError):
    """Levée quand une conversion audio échoue"""
    def __init__(self, source_format: str, target_format: str, reason: str):
        super().__init__(
            f"Failed to convert from {source_format} to {target_format}: {reason}"
        )
        self.source_format = source_format
        self.target_format = target_format
        self.reason = reason


class MetadataError(DomainError):
    """Levée quand la lecture/écriture de métadonnées échoue"""
    def __init__(self, file_path: str, reason: str):
        super().__init__(f"Metadata error for '{file_path}': {reason}")
        self.file_path = file_path
        self.reason = reason


class QuotaExceededError(DomainError):
    """Levée quand un quota de téléchargement est dépassé"""
    def __init__(self, limit: int, period: str):
        super().__init__(f"Download quota exceeded: {limit} downloads per {period}")
        self.limit = limit
        self.period = period
