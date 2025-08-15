"""
Gestionnaire sécurisé pour les clés API
Évite la pollution des variables d'environnement globales
"""

from typing import Optional
from contextlib import contextmanager
import threading
from app.core.logging import get_logger

logger = get_logger("api_key_manager")


class APIKeyManager:
    """
    Gestionnaire thread-safe pour les clés API.
    Les clés sont stockées uniquement en mémoire et isolées par contexte.
    """
    
    def __init__(self):
        self._local = threading.local()
        self._default_keys = {}
    
    def set_default_key(self, provider: str, key: str) -> None:
        """Définir une clé par défaut pour un provider (au démarrage de l'app)"""
        self._default_keys[provider] = key
    
    def get_key(self, provider: str) -> Optional[str]:
        """
        Récupérer la clé API pour un provider.
        Priorité : clé du contexte actuel > clé par défaut
        """
        # Vérifier d'abord le contexte local
        if hasattr(self._local, 'keys') and provider in self._local.keys:
            return self._local.keys[provider]
        
        # Sinon, utiliser la clé par défaut
        return self._default_keys.get(provider)
    
    @contextmanager
    def temporary_key(self, provider: str, key: str):
        """
        Context manager pour utiliser temporairement une clé API.
        La clé est automatiquement nettoyée à la sortie du contexte.
        """
        # Sauvegarder l'état actuel
        if not hasattr(self._local, 'keys'):
            self._local.keys = {}
        
        old_key = self._local.keys.get(provider)
        
        try:
            # Définir la nouvelle clé
            self._local.keys[provider] = key
            logger.debug(f"Temporary API key set for provider: {provider}")
            yield
        finally:
            # Restaurer l'état précédent
            if old_key is not None:
                self._local.keys[provider] = old_key
            else:
                self._local.keys.pop(provider, None)
            logger.debug(f"Temporary API key cleared for provider: {provider}")
    
    def clear_context(self) -> None:
        """Nettoyer toutes les clés du contexte actuel"""
        if hasattr(self._local, 'keys'):
            self._local.keys.clear()


# Instance globale du gestionnaire
api_key_manager = APIKeyManager()


def get_api_key_manager() -> APIKeyManager:
    """Récupérer l'instance globale du gestionnaire"""
    return api_key_manager