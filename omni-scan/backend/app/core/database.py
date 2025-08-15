"""Gestion de la connexion Supabase"""

from supabase import create_client, Client
from app.utils.logger import logger
from app.core.config import settings
import os


# Instance Supabase globale - ne pas initialiser en mode test
supabase: Client = None

if os.getenv("ENVIRONMENT") != "test":
    try:
        supabase = create_client(
            settings.supabase_url,
            settings.supabase_anon_key
        )
    except Exception as e:
        logger.info(f"Warning: Could not initialize Supabase client: {e}")
        if settings.environment == "production":
            raise


async def init_db():
    """Initialiser la base de données"""
    # Vérifier la connexion
    if supabase:
        try:
            # Test simple de connexion - le client Supabase est synchrone
            supabase.table("documents").select("count").execute()
            logger.info("✅ Connexion Supabase établie")
        except Exception as e:
            logger.info(f"❌ Erreur connexion Supabase: {e}")
            # En dev, continuer même si Supabase n'est pas disponible
            if settings.environment == "production":
                raise
    else:
        logger.info("⚠️ Supabase non initialisé (mode test ou erreur config)")


def get_supabase() -> Client:
    """Obtenir l'instance Supabase"""
    return supabase