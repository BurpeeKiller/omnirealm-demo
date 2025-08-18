#!/bin/bash

# Déploiement des Edge Functions sur Supabase VPS
# Ce script copie et configure les Edge Functions directement sur le VPS

VPS_USER="omni-admin"
VPS_HOST="100.87.146.1"
VPS_PATH="/home/omni-admin/edge-functions"

echo "🚀 Déploiement des Edge Functions OmniFit sur le VPS..."

# Créer le répertoire sur le VPS
echo "📁 Création du répertoire des Edge Functions..."
ssh $VPS_USER@$VPS_HOST "mkdir -p $VPS_PATH/{create-checkout-session,stripe-webhook,verify-subscription,create-portal-session}"

# Copier les Edge Functions
echo "📤 Copie des Edge Functions..."
scp -r /home/greg/projets/dev/apps/omni-fit/supabase/functions/* $VPS_USER@$VPS_HOST:$VPS_PATH/

# Créer un script d'installation sur le VPS
echo "📝 Création du script d'installation..."
cat > /tmp/install-edge-functions.sh << 'EOF'
#!/bin/bash

SUPABASE_PROJECT_ID="cosgs4ss08wgwow4skgw0s80"
EDGE_FUNCTIONS_CONTAINER="supabase-edge-functions-${SUPABASE_PROJECT_ID}"
FUNCTIONS_PATH="/home/omni-admin/edge-functions"

echo "🔧 Installation des Edge Functions dans le conteneur..."

# Copier les fonctions dans le conteneur
for func in create-checkout-session stripe-webhook verify-subscription create-portal-session; do
  if [ -d "$FUNCTIONS_PATH/$func" ]; then
    echo "📦 Installation de $func..."
    docker cp $FUNCTIONS_PATH/$func/index.ts $EDGE_FUNCTIONS_CONTAINER:/home/deno/functions/$func/
  fi
done

# Configurer les routes dans Kong
echo "🌐 Configuration des routes Kong..."
KONG_CONTAINER="supabase-kong-${SUPABASE_PROJECT_ID}"

# Ajouter les routes pour chaque fonction
docker exec $KONG_CONTAINER kong config db_import /dev/stdin <<KONG_CONFIG
_format_version: "3.0"
services:
  - name: edge-functions-create-checkout-session
    url: http://supabase-edge-functions-${SUPABASE_PROJECT_ID}:9000/create-checkout-session
    routes:
      - name: edge-functions-create-checkout-session-route
        paths:
          - /functions/v1/create-checkout-session
        strip_path: true
  - name: edge-functions-stripe-webhook
    url: http://supabase-edge-functions-${SUPABASE_PROJECT_ID}:9000/stripe-webhook
    routes:
      - name: edge-functions-stripe-webhook-route
        paths:
          - /functions/v1/stripe-webhook
        strip_path: true
  - name: edge-functions-verify-subscription
    url: http://supabase-edge-functions-${SUPABASE_PROJECT_ID}:9000/verify-subscription
    routes:
      - name: edge-functions-verify-subscription-route
        paths:
          - /functions/v1/verify-subscription
        strip_path: true
  - name: edge-functions-create-portal-session
    url: http://supabase-edge-functions-${SUPABASE_PROJECT_ID}:9000/create-portal-session
    routes:
      - name: edge-functions-create-portal-session-route
        paths:
          - /functions/v1/create-portal-session
        strip_path: true
KONG_CONFIG

echo "🔄 Redémarrage des services..."
docker restart $EDGE_FUNCTIONS_CONTAINER
docker restart $KONG_CONTAINER

echo "✅ Installation terminée!"
EOF

# Copier et exécuter le script sur le VPS
scp /tmp/install-edge-functions.sh $VPS_USER@$VPS_HOST:/tmp/
ssh $VPS_USER@$VPS_HOST "chmod +x /tmp/install-edge-functions.sh && /tmp/install-edge-functions.sh"

# Nettoyer
rm /tmp/install-edge-functions.sh

echo "✅ Déploiement terminé!"
echo ""
echo "🧪 Pour tester:"
echo "curl https://api.supabase.omnirealm.tech/functions/v1/verify-subscription \\"
echo "  -H 'Authorization: Bearer YOUR_USER_TOKEN'"