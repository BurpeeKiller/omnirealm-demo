#!/bin/bash

# Script de validation du schéma de base de données OmniTask
# Usage: ./scripts/validate-database.sh

echo "🔍 Validation du schéma de base de données OmniTask"
echo "=================================================="

# Configuration SSH
SSH_CMD="ssh -p 2222 omni-admin@100.87.146.1"
PSQL_CMD="docker exec supabase-db-cosgs4ss08wgwow4skgw0s80 psql -U postgres -d postgres"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour exécuter une requête SQL
run_sql() {
    $SSH_CMD "$PSQL_CMD -t -c \"$1\""
}

# 1. Vérifier les tables principales
echo -e "\n📋 Vérification des tables principales..."
TABLES=$(run_sql "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('tasks', 'projects') ORDER BY tablename;")
if [[ $TABLES == *"projects"* ]] && [[ $TABLES == *"tasks"* ]]; then
    echo -e "${GREEN}✅ Tables 'tasks' et 'projects' présentes${NC}"
else
    echo -e "${RED}❌ Tables manquantes${NC}"
    exit 1
fi

# 2. Vérifier la structure de la table tasks
echo -e "\n📊 Structure de la table 'tasks':"
REQUIRED_COLUMNS="id user_id title status priority position tags"
MISSING_COLUMNS=""

for col in $REQUIRED_COLUMNS; do
    COUNT=$(run_sql "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = '$col';")
    if [[ $COUNT -eq 0 ]]; then
        MISSING_COLUMNS="$MISSING_COLUMNS $col"
        echo -e "${RED}❌ Colonne manquante: $col${NC}"
    else
        TYPE=$(run_sql "SELECT data_type FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = '$col';")
        echo -e "${GREEN}✅ $col (${TYPE// /})${NC}"
    fi
done

if [[ -z "$MISSING_COLUMNS" ]]; then
    echo -e "${GREEN}✅ Toutes les colonnes requises sont présentes${NC}"
else
    echo -e "${RED}❌ Colonnes manquantes:$MISSING_COLUMNS${NC}"
fi

# 3. Vérifier la structure de la table projects
echo -e "\n📁 Structure de la table 'projects':"
REQUIRED_COLUMNS="id user_id name color icon is_archived"
MISSING_COLUMNS=""

for col in $REQUIRED_COLUMNS; do
    COUNT=$(run_sql "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'projects' AND column_name = '$col';")
    if [[ $COUNT -eq 0 ]]; then
        MISSING_COLUMNS="$MISSING_COLUMNS $col"
        echo -e "${RED}❌ Colonne manquante: $col${NC}"
    else
        TYPE=$(run_sql "SELECT data_type FROM information_schema.columns WHERE table_name = 'projects' AND column_name = '$col';")
        echo -e "${GREEN}✅ $col (${TYPE// /})${NC}"
    fi
done

# 4. Vérifier RLS
echo -e "\n🔒 Vérification Row Level Security (RLS):"
RLS_TASKS=$(run_sql "SELECT rowsecurity FROM pg_tables WHERE tablename = 'tasks';")
RLS_PROJECTS=$(run_sql "SELECT rowsecurity FROM pg_tables WHERE tablename = 'projects';")

if [[ $RLS_TASKS == *"t"* ]]; then
    echo -e "${GREEN}✅ RLS activé sur 'tasks'${NC}"
else
    echo -e "${RED}❌ RLS désactivé sur 'tasks'${NC}"
fi

if [[ $RLS_PROJECTS == *"t"* ]]; then
    echo -e "${GREEN}✅ RLS activé sur 'projects'${NC}"
else
    echo -e "${RED}❌ RLS désactivé sur 'projects'${NC}"
fi

# 5. Vérifier les policies
echo -e "\n📜 Vérification des policies RLS:"
POLICIES=$(run_sql "SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('tasks', 'projects') ORDER BY tablename, policyname;")
echo "$POLICIES"

# 6. Vérifier les contraintes
echo -e "\n⚠️  Vérification des contraintes:"
CONSTRAINTS=$(run_sql "SELECT conname, contype FROM pg_constraint WHERE conrelid IN (SELECT oid FROM pg_class WHERE relname IN ('tasks', 'projects')) AND contype IN ('c', 'f');")
echo "$CONSTRAINTS"

# 7. Vérifier les valeurs par défaut importantes
echo -e "\n🔧 Valeurs par défaut:"
echo -n "tasks.status: "
run_sql "SELECT column_default FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'status';"
echo -n "tasks.priority: "
run_sql "SELECT column_default FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'priority';"
echo -n "tasks.position: "
run_sql "SELECT column_default FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'position';"

echo -e "\n${GREEN}✅ Validation terminée !${NC}"
echo "=================================================="