#!/bin/bash
# Script de déploiement pour Coolify

set -e

echo "🚀 Déploiement de Fitness Reminder sur Coolify..."

# Variables
PROJECT_NAME="fitness-reminder"
COOLIFY_URL="https://coolify.omnirealm.tech"
COOLIFY_APP_ID="fitness-reminder"

# Vérifier les variables d'environnement
if [ -z "$COOLIFY_TOKEN" ]; then
    echo "❌ Erreur: COOLIFY_TOKEN n'est pas défini"
    exit 1
fi

# Build local
echo "📦 Build de l'application..."
pnpm run build

# Créer une archive du projet
echo "📦 Création de l'archive..."
tar -czf deploy.tar.gz \
    dist/ \
    Dockerfile \
    nginx.conf \
    coolify-compose.yml \
    package.json \
    pnpm-lock.yaml

# Déployer via l'API Coolify
echo "🔄 Déploiement sur Coolify..."
response=$(curl -s -X POST "$COOLIFY_URL/api/v1/applications/$COOLIFY_APP_ID/deploy" \
    -H "Authorization: Bearer $COOLIFY_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "branch": "main",
        "force": true
    }')

# Vérifier la réponse
if echo "$response" | grep -q "success"; then
    echo "✅ Déploiement lancé avec succès!"
    echo "📊 Vérifiez le statut sur: $COOLIFY_URL/project/$COOLIFY_APP_ID"
else
    echo "❌ Erreur lors du déploiement:"
    echo "$response"
    exit 1
fi

# Nettoyer
rm -f deploy.tar.gz

echo "🎉 Déploiement terminé!"
echo "🌐 L'application sera disponible sur: https://fitnessreminder.omnirealm.tech"