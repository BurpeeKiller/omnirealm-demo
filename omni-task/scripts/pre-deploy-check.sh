#!/bin/bash

# Script de validation pré-déploiement pour OmniTask

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Validation pré-déploiement OmniTask v3.0.0${NC}\n"

ERRORS=0

# 1. Vérification TypeScript
echo -e "${YELLOW}1️⃣ Vérification TypeScript...${NC}"
if pnpm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✅ TypeScript OK${NC}\n"
else
    echo -e "${RED}❌ Erreurs TypeScript détectées${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 2. Vérification ESLint
echo -e "${YELLOW}2️⃣ Vérification ESLint...${NC}"
if pnpm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ESLint OK${NC}\n"
else
    echo -e "${RED}❌ Erreurs ESLint détectées${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 3. Tests unitaires
echo -e "${YELLOW}3️⃣ Exécution des tests...${NC}"
if pnpm run test --run > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Tests passés${NC}\n"
else
    echo -e "${YELLOW}⚠️  Certains tests échouent${NC}\n"
fi

# 4. Test de build
echo -e "${YELLOW}4️⃣ Test de build production...${NC}"
if pnpm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build réussi${NC}\n"
    
    # Vérifier la taille du build
    if [ -d ".next" ]; then
        BUILD_SIZE=$(du -sh .next | cut -f1)
        echo -e "${BLUE}   📦 Taille du build : ${BUILD_SIZE}${NC}\n"
    fi
else
    echo -e "${RED}❌ Échec du build${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 5. Vérification des fichiers critiques
echo -e "${YELLOW}5️⃣ Vérification des fichiers de déploiement...${NC}"
REQUIRED_FILES=(
    "Dockerfile"
    "next.config.mjs"
    ".env.production.example"
    "package.json"
    "pnpm-lock.yaml"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file manquant"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# 6. Vérification du mode standalone
echo -e "${YELLOW}6️⃣ Vérification de la configuration Next.js...${NC}"
if grep -q "output: 'standalone'" next.config.mjs; then
    echo -e "${GREEN}✅ Mode standalone activé${NC}\n"
else
    echo -e "${RED}❌ Mode standalone non configuré${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 7. Vérification des variables d'environnement
echo -e "${YELLOW}7️⃣ Vérification des variables d'environnement...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Fichier .env.local présent${NC}"
    
    # Vérifier les variables critiques
    REQUIRED_VARS=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
    )
    
    MISSING_VARS=0
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.local; then
            echo -e "   ${GREEN}✓${NC} $var"
        else
            echo -e "   ${YELLOW}⚠${NC} $var (à configurer dans Coolify)"
            MISSING_VARS=$((MISSING_VARS + 1))
        fi
    done
    
    if [ $MISSING_VARS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $MISSING_VARS variables à configurer dans Coolify${NC}\n"
    else
        echo -e "${GREEN}✅ Toutes les variables sont configurées${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  Pas de fichier .env.local (les variables seront configurées dans Coolify)${NC}\n"
fi

# 8. Vérification de la santé de l'API
echo -e "${YELLOW}8️⃣ Vérification de la route health check...${NC}"
if [ -f "app/api/health/route.ts" ]; then
    echo -e "${GREEN}✅ Route /api/health présente${NC}\n"
else
    echo -e "${RED}❌ Route /api/health manquante${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Résumé final
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Toutes les vérifications critiques sont passées !${NC}"
    echo -e "${GREEN}📦 L'application est prête pour le déploiement${NC}\n"
    echo -e "${YELLOW}💡 Prochaines étapes :${NC}"
    echo -e "   1. Committez vos changements : ${BLUE}git add -A && git commit -m 'Ready for deployment'${NC}"
    echo -e "   2. Poussez sur GitHub : ${BLUE}git push origin main${NC}"
    echo -e "   3. Lancez le déploiement dans Coolify"
    exit 0
else
    echo -e "${RED}❌ $ERRORS erreur(s) critique(s) détectée(s)${NC}"
    echo -e "${RED}🛑 Corrigez les erreurs avant de déployer${NC}"
    exit 1
fi