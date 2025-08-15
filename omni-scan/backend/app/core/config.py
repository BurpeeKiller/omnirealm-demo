"""
Configuration centralisée pour OmniScan v2.0
Migration progressive vers la nouvelle config
"""

import warnings
warnings.warn(
    "app.core.config est déprécié. Utilisez app.core.config_wrapper ou src.lib.env_config",
    DeprecationWarning,
    stacklevel=2
)

# Import du wrapper pour compatibilité
# NOTE: Import non au top du fichier pour éviter des imports circulaires
from app.core.config_wrapper import settings, env_config, public_config, server_config  # noqa: E402

# Ré-export pour compatibilité avec l'ancienne API
__all__ = ['settings', 'env_config', 'public_config', 'server_config']