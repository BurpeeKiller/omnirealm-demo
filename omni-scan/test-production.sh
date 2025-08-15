#!/bin/bash

# Script de test pour vérifier OmniScan en production

echo "🧪 Test OmniScan Production"
echo "=========================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Test Frontend
echo -e "\n1️⃣ Test Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://scan.omnirealm.tech)
if [ "$FRONTEND_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ Frontend accessible (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Frontend inaccessible (HTTP $FRONTEND_STATUS)${NC}"
fi

# 2. Test Backend depuis le VPS
echo -e "\n2️⃣ Test Backend API..."
BACKEND_HEALTH=$(ssh -p 22 omni-admin@100.87.146.1 "docker exec ww0g0c4s844wg840ws0cock8-134942890386 curl -s http://localhost:8001/api/v1/health 2>/dev/null" || echo "ERROR")

if [[ "$BACKEND_HEALTH" == *"healthy"* ]]; then
    echo -e "${GREEN}✅ Backend API fonctionnel${NC}"
    echo "   Response: $BACKEND_HEALTH"
else
    echo -e "${RED}❌ Backend API ne répond pas${NC}"
fi

# 3. Test conteneurs Docker
echo -e "\n3️⃣ État des conteneurs..."
echo "Frontend:"
ssh -p 22 omni-admin@100.87.146.1 "docker ps | grep omniscan-frontend || echo 'Pas de conteneur frontend trouvé'"
echo -e "\nBackend:"
ssh -p 22 omni-admin@100.87.146.1 "docker ps | grep ww0g0c4s844wg840ws0cock8"

# 4. Test Supabase
echo -e "\n4️⃣ Test connexion Supabase..."
SUPABASE_TEST=$(ssh -p 22 omni-admin@100.87.146.1 "docker exec supabase-db-cosgs4ss08wgwow4skgw0s80 psql -U postgres -d postgres -c 'SELECT COUNT(*) FROM public.documents;' -t 2>/dev/null" || echo "ERROR")

if [[ "$SUPABASE_TEST" != "ERROR" ]]; then
    echo -e "${GREEN}✅ Base de données accessible${NC}"
    echo "   Nombre de documents: $SUPABASE_TEST"
else
    echo -e "${RED}❌ Erreur connexion base de données${NC}"
fi

# 5. Résumé
echo -e "\n📊 Résumé:"
echo "- Frontend: https://scan.omnirealm.tech"
echo "- Backend API: https://api.scan.omnirealm.tech (SSL à vérifier)"
echo "- Base de données: Supabase PostgreSQL"

echo -e "\n✨ Test terminé !"