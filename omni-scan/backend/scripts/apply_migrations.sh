#!/bin/bash

# Script pour appliquer les migrations Supabase

echo "🔧 Application des migrations Supabase..."

# Variables
SUPABASE_DB_URL="postgresql://postgres:postgres@localhost:54322/postgres"
MIGRATION_FILE="../supabase/migrations/001_initial_schema.sql"

# Vérifier que psql est installé
if ! command -v psql &> /dev/null; then
    echo "❌ psql n'est pas installé. Installez postgresql-client."
    exit 1
fi

# Appliquer la migration
echo "📝 Application de 001_initial_schema.sql..."
psql "$SUPABASE_DB_URL" -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Migrations appliquées avec succès !"
else
    echo "❌ Erreur lors de l'application des migrations"
    exit 1
fi

# Vérifier les tables créées
echo ""
echo "📊 Tables créées :"
psql "$SUPABASE_DB_URL" -c "\dt public.*" | grep -E "(documents|user_profiles)"