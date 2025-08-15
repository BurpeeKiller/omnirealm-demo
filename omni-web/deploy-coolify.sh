#!/bin/bash
# Script de déploiement pour Coolify

echo "🚀 Déploiement OmniRealm Web sur VPS via Coolify"

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier que pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm n'est pas installé. Installation..."
    npm install -g pnpm
fi

# Nettoyer et installer les dépendances
echo "📦 Installation des dépendances..."
pnpm install

# Lancer les tests
echo "🧪 Exécution des tests..."
pnpm test

# Validation du code
echo "✅ Validation du code..."
pnpm run validate:quick

# Build de production
echo "🏗️ Construction de l'application..."
pnpm run build

# Test Docker local (optionnel)
if command -v docker &> /dev/null; then
    echo "🐳 Test Docker local..."
    docker build -t omnirealm-web-test .
    echo "✅ Image Docker construite avec succès"
fi

echo "✨ Prêt pour le déploiement sur Coolify !"
echo ""
echo "📝 Prochaines étapes :"
echo "1. Commit et push vers le repository Git"
echo "2. Configurer l'application dans Coolify"
echo "3. Variables d'environnement à configurer :"
echo "   - NEXT_PUBLIC_POSTHOG_KEY"
echo "   - NEXT_PUBLIC_POSTHOG_HOST"
echo "   - N8N_NEWSLETTER_WEBHOOK_URL"
echo "   - N8N_CONTACT_WEBHOOK_URL"
echo ""
echo "🌐 URL de production : https://omnirealm.tech"