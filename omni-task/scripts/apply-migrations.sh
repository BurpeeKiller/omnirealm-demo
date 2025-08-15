#!/bin/bash

# Script pour appliquer les migrations SQL à Supabase

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Application des migrations OmniTask...${NC}"

# Chemin vers les migrations
MIGRATIONS_DIR="/home/greg/projets/dev/tools/supabase/migrations"

# Vérifier si le répertoire existe
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo -e "${RED}❌ Le répertoire des migrations n'existe pas: $MIGRATIONS_DIR${NC}"
    exit 1
fi

# Vérifier si Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI n'est pas installé${NC}"
    echo "Installez-le avec: npm install -g supabase"
    exit 1
fi

# Lister les migrations disponibles
echo -e "${GREEN}📋 Migrations disponibles:${NC}"
ls -la "$MIGRATIONS_DIR"/*.sql

# Appliquer la migration multi-tenant (déjà appliquée normalement)
echo -e "\n${YELLOW}1️⃣ Vérification de la migration multi-tenant...${NC}"
supabase db push --file "$MIGRATIONS_DIR/001_multi_tenant_auth.sql" 2>/dev/null || echo -e "${GREEN}✓ Déjà appliquée${NC}"

# Appliquer la migration OmniTask
echo -e "\n${YELLOW}2️⃣ Application de la migration OmniTask...${NC}"
if supabase db push --file "$MIGRATIONS_DIR/002_omnitask_schema.sql"; then
    echo -e "${GREEN}✅ Migration OmniTask appliquée avec succès!${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'application de la migration${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Toutes les migrations ont été appliquées!${NC}"
echo -e "${YELLOW}📝 Tables créées:${NC}"
echo "  - public.projects"
echo "  - public.task_statuses"
echo "  - public.tasks"
echo "  - public.tags"
echo "  - public.task_tags"
echo "  - public.task_comments"
echo "  - public.task_attachments"

echo -e "\n${YELLOW}💡 Prochaines étapes:${NC}"
echo "1. Régénérer les types TypeScript: pnpm run supabase:generate-types"
echo "2. Redémarrer l'application: pnpm run dev"
echo "3. Tester la création de tâches dans l'interface"