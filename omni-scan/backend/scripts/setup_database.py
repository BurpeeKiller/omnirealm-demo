#!/usr/bin/env python3
"""
Script pour initialiser la base de données OmniScan
"""

import os
import sys
from pathlib import Path

# Ajouter le répertoire parent au path
sys.path.append(str(Path(__file__).parent.parent))

from supabase import create_client, Client
from app.core.config import settings

def setup_database():
    """Créer les tables nécessaires via l'API Supabase"""
    
    print("🔧 Configuration de la base de données OmniScan...")
    
    # Créer le client Supabase avec la clé service (admin)
    supabase: Client = create_client(
        settings.supabase_url,
        settings.supabase_service_key or settings.supabase_anon_key
    )
    
    # Lire le fichier SQL
    migration_path = Path(__file__).parent.parent.parent / "supabase" / "migrations" / "001_initial_schema.sql"
    
    if not migration_path.exists():
        print(f"❌ Fichier de migration non trouvé : {migration_path}")
        return False
    
    with open(migration_path, 'r') as f:
        sql_content = f.read()
    
    # Note: Supabase ne permet pas l'exécution directe de SQL via l'API REST
    # Pour le développement local, nous devons utiliser une approche différente
    
    print("\n📝 Instructions pour créer les tables :")
    print("1. Ouvrez Supabase Studio : http://localhost:54323")
    print("2. Allez dans SQL Editor")
    print("3. Copiez et exécutez le contenu du fichier :")
    print(f"   {migration_path}")
    print("\nOu exécutez cette commande si vous avez psql :")
    print(f"   psql postgresql://postgres:postgres@localhost:54322/postgres -f {migration_path}")
    
    # Tester la connexion
    try:
        # Essayer de lire une table (va échouer si elle n'existe pas)
        response = supabase.table("documents").select("count").execute()
        print("\n✅ Tables déjà créées !")
        return True
    except Exception as e:
        print(f"\n⚠️  Les tables n'existent pas encore : {str(e)}")
        print("   Veuillez suivre les instructions ci-dessus pour les créer.")
        return False

if __name__ == "__main__":
    setup_database()