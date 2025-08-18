#!/bin/bash

# Script pour exécuter la migration OmniFit via SSH

echo "🚀 Exécution de la migration OmniFit..."

# Copier le fichier SQL sur le serveur
scp /home/greg/projets/dev/apps/omni-fit/supabase/migrations/002_omnifit_schema_tables.sql omni-admin@100.87.146.1:/tmp/

# Exécuter la migration
ssh omni-admin@100.87.146.1 "docker exec -i supabase-db-cosgs4ss08wgwow4skgw0s80 psql -U postgres < /tmp/002_omnifit_schema_tables.sql"

# Vérifier les tables créées
echo -e "\n📋 Tables dans le schéma omnifit:"
ssh omni-admin@100.87.146.1 "docker exec supabase-db-cosgs4ss08wgwow4skgw0s80 psql -U postgres -c \"SELECT table_name FROM information_schema.tables WHERE table_schema = 'omnifit' ORDER BY table_name;\""

# Nettoyer
ssh omni-admin@100.87.146.1 "rm /tmp/002_omnifit_schema_tables.sql"

echo -e "\n✅ Migration terminée!"