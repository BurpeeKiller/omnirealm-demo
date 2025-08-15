#!/bin/bash

echo "🚀 Création et déploiement d'OmniTask sur Netlify..."

# Créer le site sur Netlify avec l'API
echo "📝 Création du site sur Netlify..."
SITE_RESPONSE=$(curl -s -X POST https://api.netlify.com/api/v1/sites \
  -H "Authorization: Bearer $(netlify api getAccessToken --json | jq -r .access_token)" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "omni-task-'$(date +%s)'",
    "custom_domain": "tasks.omnirealm.tech"
  }')

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la création du site"
    exit 1
fi

SITE_ID=$(echo $SITE_RESPONSE | jq -r .id)
SITE_URL=$(echo $SITE_RESPONSE | jq -r .url)

echo "✅ Site créé avec succès!"
echo "   ID: $SITE_ID"
echo "   URL: $SITE_URL"

# Sauvegarder l'ID du site
echo "{\"siteId\":\"$SITE_ID\"}" > .netlify/state.json

# Build
echo "📦 Build de production..."
pnpm run build

# Déployer
echo "🌐 Déploiement en cours..."
netlify deploy --prod

echo ""
echo "✅ Déploiement terminé !"
echo "🔗 URL Netlify : $SITE_URL"
echo "🌐 Pour configurer tasks.omnirealm.tech :"
echo "   1. Allez dans Netlify Dashboard"
echo "   2. Domain settings > Add custom domain"
echo "   3. Configurez le DNS dans Cloudflare"