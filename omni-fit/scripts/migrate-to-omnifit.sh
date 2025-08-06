#!/bin/bash

# Script de migration Fitness Reminder → OmniFit
# Automatise le renommage complet du projet

echo "🚀 Migration Fitness Reminder → OmniFit"
echo "======================================"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

echo -e "${YELLOW}📝 Mise à jour des références dans les fichiers...${NC}"

# 2. Remplacer toutes les occurrences dans les fichiers
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) \
    -not -path "./node_modules/*" \
    -not -path "./dist/*" \
    -not -path "./.git/*" \
    -exec sed -i.bak 's/fitness-reminder/omnifit/g' {} \;

find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) \
    -not -path "./node_modules/*" \
    -not -path "./dist/*" \
    -not -path "./.git/*" \
    -exec sed -i.bak 's/Fitness Reminder/OmniFit/g' {} \;

find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) \
    -not -path "./node_modules/*" \
    -not -path "./dist/*" \
    -not -path "./.git/*" \
    -exec sed -i.bak 's/FitReminder/OmniFit/g' {} \;

# 3. Nettoyer les fichiers de sauvegarde
find . -name "*.bak" -type f -delete

echo -e "${GREEN}✅ Références mises à jour${NC}"

# 4. Mettre à jour les URLs de production
echo -e "${YELLOW}🌐 Configuration des URLs de production...${NC}"

# Mettre à jour les domaines
sed -i 's/fitness\.omnirealm\.tech/omnifit.omnirealm.tech/g' DEPLOYMENT.md 2>/dev/null || true
sed -i 's/fitness\.omnirealm\.tech/omnifit.omnirealm.tech/g' vercel.json 2>/dev/null || true
sed -i 's/fitness\.omnirealm\.tech/omnifit.omnirealm.tech/g' netlify.toml 2>/dev/null || true

echo -e "${GREEN}✅ URLs de production configurées${NC}"

# 5. Résumé des modifications
echo ""
echo -e "${GREEN}🎉 Migration terminée avec succès !${NC}"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Générer les nouveaux icônes : ./scripts/generate-icons.sh"
echo "2. Installer les dépendances : pnpm install"
echo "3. Lancer en dev : pnpm run dev"
echo "4. Build production : pnpm run build"
echo ""
echo "🌐 Nouvelles URLs :"
echo "- Développement : http://localhost:5173"
echo "- Production : https://omnifit.omnirealm.tech"
echo ""
echo "💡 N'oubliez pas de :"
echo "- Mettre à jour le DNS pour omnifit.omnirealm.tech"
echo "- Reconfigurer les webhooks Netlify/Vercel"
echo "- Mettre à jour les variables d'environnement Stripe"