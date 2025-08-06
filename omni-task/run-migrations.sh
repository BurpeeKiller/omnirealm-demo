#!/bin/bash

echo "🚀 Exécution des migrations OmniTask..."

# Chemin vers le fichier de migration
MIGRATION_FILE="/home/greg/projets/dev/apps/omni-task/supabase/migrations/20250127_initial_schema.sql"

# Exécuter la migration
docker exec -i supabase_db_projets psql -U postgres -d postgres -v ON_ERROR_STOP=1 < "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Migrations exécutées avec succès"
    
    # Vérifier les tables créées
    echo "📊 Vérification des tables créées..."
    docker exec supabase_db_projets psql -U postgres -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('profiles', 'tasks', 'projects', 'user_preferences', 'task_history') ORDER BY tablename;"
else
    echo "❌ Erreur lors de l'exécution des migrations"
    exit 1
fi