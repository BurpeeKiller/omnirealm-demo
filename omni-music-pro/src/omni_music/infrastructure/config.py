"""
Configuration de l'application
"""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv


@dataclass
class AppConfig:
    """Configuration centralisée de l'application"""

    # Répertoires
    app_dir: Path
    downloads_dir: Path
    database_path: Path
    playlists_dir: Path

    # Interface
    theme: str = "dark"
    window_size: tuple[int, int] = (1200, 800)

    # Audio
    default_format: str = "mp3_320"
    max_concurrent_downloads: int = 3

    # APIs
    youtube_cookies_path: Optional[Path] = None
    deezer_api_key: Optional[str] = None

    @classmethod
    def load(cls, config_dir: Optional[Path] = None) -> "AppConfig":
        """Charge la configuration depuis l'environnement et les fichiers"""

        # Charger le fichier .env s'il existe
        if config_dir:
            env_file = config_dir / ".env"
            if env_file.exists():
                load_dotenv(env_file)
        else:
            load_dotenv()

        # Déterminer le répertoire de l'application
        app_dir = config_dir if config_dir else Path.home() / ".omni-music-pro"

        app_dir.mkdir(parents=True, exist_ok=True)

        # Répertoires de données
        downloads_dir = app_dir / "downloads"
        downloads_dir.mkdir(exist_ok=True)

        playlists_dir = app_dir / "playlists"
        playlists_dir.mkdir(exist_ok=True)

        database_path = app_dir / "tracks.db"

        # Chemins optionnels
        cookies_path = None
        cookies_env = os.getenv("YOUTUBE_COOKIES_PATH")
        if cookies_env:
            cookies_path = Path(cookies_env)

        return cls(
            app_dir=app_dir,
            downloads_dir=downloads_dir,
            database_path=database_path,
            playlists_dir=playlists_dir,
            theme=os.getenv("THEME", "dark"),
            window_size=(
                int(os.getenv("WINDOW_WIDTH", "1200")),
                int(os.getenv("WINDOW_HEIGHT", "800"))
            ),
            default_format=os.getenv("DEFAULT_FORMAT", "mp3_320"),
            max_concurrent_downloads=int(os.getenv("MAX_CONCURRENT_DOWNLOADS", "3")),
            youtube_cookies_path=cookies_path,
            deezer_api_key=os.getenv("DEEZER_API_KEY"),
        )

    def save_env(self) -> None:
        """Sauvegarde les paramètres dans un fichier .env"""
        env_file = self.app_dir / ".env"

        with open(env_file, "w", encoding="utf-8") as f:
            f.write("# Configuration OmniMusic Pro\n")
            f.write(f"THEME={self.theme}\n")
            f.write(f"WINDOW_WIDTH={self.window_size[0]}\n")
            f.write(f"WINDOW_HEIGHT={self.window_size[1]}\n")
            f.write(f"DEFAULT_FORMAT={self.default_format}\n")
            f.write(f"MAX_CONCURRENT_DOWNLOADS={self.max_concurrent_downloads}\n")

            if self.youtube_cookies_path:
                f.write(f"YOUTUBE_COOKIES_PATH={self.youtube_cookies_path}\n")

            if self.deezer_api_key:
                f.write(f"DEEZER_API_KEY={self.deezer_api_key}\n")
