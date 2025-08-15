"""
Point d'entrée principal de l'application OmniMusic Pro
"""

import asyncio
import sys

# Configuration de l'event loop pour Windows
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())


def main() -> None:
    """Fonction principale"""
    try:
        # Import tardif pour éviter les problèmes de circular imports
        from omni_music.presentation.modern_gui import (
            ModernOmniMusicApp as OmniMusicApp,
        )

        # Lancer l'application
        app = OmniMusicApp()
        app.run()

    except ImportError as e:
        print(f"Erreur d'import : {e}")
        print("Vérifiez que toutes les dépendances sont installées.")
        sys.exit(1)
    except Exception as e:
        print(f"Erreur fatale : {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
