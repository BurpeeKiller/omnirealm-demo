#!/usr/bin/env python3
"""
Script pour initialiser la base de données OmniScan
"""

import sys
from app.utils.logger import logger
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.append(str(Path(__file__).parent.parent))

from supabase import create_client, Client
from app.core.config import settings

def setup_database():
    """Créer les tables nécessaires via l'API Supabase"""
    
    logger.info("🔧 Configuration de la base de données OmniScan...")
    
    # Créer le client Supabase avec la clé service (admin)
    supabase: Client = create_client(
        settings.supabase_url,
        settings.supabase_service_key or settings.supabase_anon_key
    )
    
    # Lire le fichier SQL
    migration_path = Path(__file__).parent.parent.parent / "supabase" / "migrations" / "001_initial_schema.sql"
    
    if not migration_path.exists():
        logger.info(f"❌ Fichier de migration non trouvé : {migration_path}")
        return False
    
    # Note: Supabase ne permet pas l'exécution directe de SQL via l'API REST
    # Pour le développement local, nous devons utiliser une approche différente
    
    logger.info("\n📝 Instructions pour créer les tables :")
    logger.info("1. Ouvrez Supabase Studio : http://localhost:54323")
    logger.info("2. Allez dans SQL Editor")
    logger.info("3. Copiez et exécutez le contenu du fichier :")
    logger.info(f"   {migration_path}")
    logger.info("\nOu exécutez cette commande si vous avez psql :")
    logger.info(f"   psql postgresql://postgres:postgres@localhost:54322/postgres -f {migration_path}")
    
    # Tester la connexion
    try:
        # Essayer de lire une table (va échouer si elle n'existe pas)
        supabase.table("documents").select("count").execute()
        logger.info("\n✅ Tables déjà créées !")
        return True
    except Exception:
        logger.info("\n⚠️  Les tables n'existent pas encore.")
        logger.info("   Veuillez suivre les instructions ci-dessus pour les créer.")
        return False

if __name__ == "__main__":
    setup_database()