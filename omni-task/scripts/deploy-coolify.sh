#!/bin/bash

# Script de déploiement pour Coolify
# Ce script prépare l'application pour le déploiement sur Coolify

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Préparation du déploiement OmniTask sur Coolify${NC}\n"

# 1. Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -d "app" ]; then
    echo -e "${RED}❌ Erreur : Ce script doit être exécuté depuis la racine du projet OmniTask${NC}"
    exit 1
fi

# 2. Vérifier la présence du Dockerfile
if [ ! -f "Dockerfile" ]; then
    echo -e "${RED}❌ Erreur : Dockerfile manquant${NC}"
    exit 1
fi

# 3. Exécuter la validation pré-déploiement
echo -e "${YELLOW}📋 Validation pré-déploiement...${NC}"
if ./scripts/pre-deploy-check.sh; then
    echo -e "${GREEN}✅ Validation réussie${NC}\n"
else
    echo -e "${RED}❌ La validation a échoué. Corrigez les erreurs avant de déployer.${NC}"
    exit 1
fi

# 4. Créer le fichier .env.production si nécessaire
if [ ! -f ".env.production" ] && [ -f ".env.production.example" ]; then
    echo -e "${YELLOW}📝 Création du fichier .env.production${NC}"
    echo -e "${YELLOW}⚠️  N'oubliez pas de configurer les variables d'environnement dans Coolify !${NC}\n"
fi

# 5. Optimiser les dépendances
echo -e "${YELLOW}🧹 Nettoyage et optimisation...${NC}"
pnpm run clean:cache
echo -e "${GREEN}✅ Nettoyage terminé${NC}\n"

# 6. Vérifier la configuration Next.js
echo -e "${YELLOW}🔍 Vérification de la configuration Next.js...${NC}"
if grep -q "output: 'standalone'" next.config.mjs; then
    echo -e "${GREEN}✅ Mode standalone activé${NC}"
else
    echo -e "${RED}❌ Mode standalone non configuré dans next.config.mjs${NC}"
    exit 1
fi

# 7. Créer le fichier de métadonnées pour Coolify
echo -e "${YELLOW}📦 Création des métadonnées de déploiement...${NC}"
cat > .coolify.json << EOF
{
  "name": "OmniTask",
  "version": "3.0.0",
  "description": "Gestion de tâches IA-augmentée",
  "port": 3002,
  "healthcheck": {
    "path": "/api/health",
    "interval": 30,
    "timeout": 10,
    "retries": 3
  },
  "environment": {
    "NODE_ENV": "production",
    "PORT": "3002"
  }
}
EOF
echo -e "${GREEN}✅ Métadonnées créées${NC}\n"

# 8. Instructions finales
echo -e "${GREEN}✨ Préparation terminée !${NC}\n"
echo -e "${BLUE}📌 Prochaines étapes :${NC}"
echo -e "1. Commitez et poussez vos changements :"
echo -e "   ${YELLOW}git add -A && git commit -m 'feat: Préparer déploiement Coolify' && git push${NC}"
echo -e ""
echo -e "2. Dans Coolify :"
echo -e "   - Créez une nouvelle application"
echo -e "   - Connectez votre repository GitHub"
echo -e "   - Sélectionnez la branche 'main'"
echo -e "   - Définissez le build pack : Docker"
echo -e "   - Configurez les variables d'environnement :"
echo -e "     ${YELLOW}NEXT_PUBLIC_SUPABASE_URL${NC}"
echo -e "     ${YELLOW}NEXT_PUBLIC_SUPABASE_ANON_KEY${NC}"
echo -e "     ${YELLOW}SUPABASE_SERVICE_ROLE_KEY${NC}"
echo -e "     ${YELLOW}NEXT_PUBLIC_APP_URL${NC}"
echo -e ""
echo -e "3. Lancez le déploiement dans Coolify"
echo -e ""
echo -e "${GREEN}🎉 Bonne chance pour le déploiement !${NC}"