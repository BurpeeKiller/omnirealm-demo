#!/bin/bash

# Script pour configurer la base de données OmniTask

echo "🚀 Configuration de la base de données OmniTask..."

# Variables
DB_HOST="localhost"
DB_PORT="54322"
DB_NAME="postgres"
DB_USER="postgres"
DB_PASSWORD="your-db-password"

# URL de connexion
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

# Exécuter le SQL
echo "📝 Création des tables..."

# Option 1 : Avec psql si installé
if command -v psql &> /dev/null; then
    psql "$DATABASE_URL" < supabase/migrations/create_tables_public.sql
    echo "✅ Tables créées avec succès!"
else
    echo "⚠️  psql n'est pas installé"
    echo ""
    echo "Options alternatives :"
    echo ""
    echo "1. Installer psql :"
    echo "   sudo apt-get install postgresql-client"
    echo ""
    echo "2. Utiliser Docker :"
    echo "   docker exec -i supabase_db_projets psql -U postgres < supabase/migrations/create_tables_public.sql"
    echo ""
    echo "3. Utiliser un client GUI :"
    echo "   - DBeaver : https://dbeaver.io/"
    echo "   - TablePlus : https://tableplus.com/"
    echo "   - pgAdmin : https://www.pgadmin.org/"
    echo ""
    echo "   Connexion : postgresql://postgres:your-db-password@localhost:54322/postgres"
fi