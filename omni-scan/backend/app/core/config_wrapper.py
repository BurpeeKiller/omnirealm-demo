"""
Wrapper de configuration pour migration progressive
Utilise la nouvelle env_config tout en maintenant la compatibilité
"""

import warnings
from src.lib.env_config import env_config, public_config, server_config

# Créer un objet settings compatible avec l'ancienne API
class SettingsWrapper:
    """Wrapper pour maintenir la compatibilité avec l'ancienne config"""
    
    def __init__(self, config):
        self._config = config
        self._warned_attrs = set()
    
    def __getattr__(self, name):
        # Mapping des anciens noms vers les nouveaux
        mapping = {
            'ENVIRONMENT': 'environment',
            'DEBUG': 'debug',
            'SECRET_KEY': 'secret_key',
            'BACKEND_URL': 'backend_url',
            'SUPABASE_URL': 'supabase_url',
            'SUPABASE_ANON_KEY': 'supabase_anon_key',
            'SUPABASE_SERVICE_KEY': 'supabase_service_key',
            'OPENAI_API_KEY': 'openai_api_key',
            'OPENAI_MODEL': 'openai_model',
            'CORS_ORIGINS': 'cors_origins',
            'MAX_FILE_SIZE_MB': 'max_file_size_mb',
            'UPLOAD_PATH': 'upload_path',
            'TEMP_PATH': 'temp_path',
            'OCR_LANGUAGES': 'ocr_languages',
            'RATE_LIMIT_PER_MINUTE': 'rate_limit_per_minute',
            'LOG_LEVEL': 'log_level',
            'LOG_FORMAT': 'log_format',
            'jwt_secret_key': 'secret_key',
            'JWT_SECRET_KEY': 'secret_key',
            'app_name': 'project_name',
            'APP_NAME': 'project_name',
            'app_version': 'project_version',
            'APP_VERSION': 'project_version',
        }
        
        # Si c'est un ancien nom, mapper vers le nouveau
        if name in mapping:
            new_name = mapping[name]
            if name not in self._warned_attrs:
                warnings.warn(
                    f"Accès à 'settings.{name}' est déprécié. "
                    f"Utilisez 'settings.{new_name}' ou 'env_config.{new_name}'",
                    DeprecationWarning,
                    stacklevel=2
                )
                self._warned_attrs.add(name)
            name = new_name
        
        # Essayer d'abord sur l'objet config
        if hasattr(self._config, name):
            value = getattr(self._config, name)
            # Si c'est un SecretStr, retourner la valeur
            if hasattr(value, 'get_secret_value'):
                return value.get_secret_value()
            return value
        
        # Sinon essayer sur server_config (pour les valeurs déjà extraites)
        if name in server_config:
            return server_config[name]
        
        # Sinon essayer sur public_config
        if name in public_config:
            return public_config[name]
        
        raise AttributeError(f"'settings' object has no attribute '{name}'")
    
    # Propriétés pour la compatibilité
    @property
    def is_development(self):
        return self._config.is_development
    
    @property
    def is_production(self):
        return self._config.is_production
    
    @property
    def is_testing(self):
        return self._config.is_testing
    
    @property
    def max_file_size_bytes(self):
        return self._config.max_file_size_bytes


# Instance compatible avec l'ancienne API
settings = SettingsWrapper(env_config)

# Export pour migration facile
__all__ = ['settings', 'env_config', 'public_config', 'server_config']