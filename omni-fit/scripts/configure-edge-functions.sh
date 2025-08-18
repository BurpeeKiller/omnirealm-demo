#!/bin/bash

# Configuration des Edge Functions Supabase pour OmniFit
# À exécuter sur le VPS via SSH

echo "🚀 Configuration des Edge Functions OmniFit..."

# Variables projet
SUPABASE_PROJECT_ID="cosgs4ss08wgwow4skgw0s80"
EDGE_FUNCTIONS_CONTAINER="supabase-edge-functions-${SUPABASE_PROJECT_ID}"
KONG_CONTAINER="supabase-kong-${SUPABASE_PROJECT_ID}"

# Vérifier que les variables Stripe sont définies
if [ -z "$STRIPE_SECRET_KEY" ] || [ -z "$STRIPE_WEBHOOK_SECRET" ] || [ -z "$STRIPE_PRICE_PREMIUM_MONTHLY" ] || [ -z "$STRIPE_PRICE_PREMIUM_YEARLY" ]; then
    echo "❌ Erreur: Les variables Stripe doivent être définies dans l'environnement"
    echo ""
    echo "Utilisation:"
    echo "  export STRIPE_SECRET_KEY='sk_test_...'"
    echo "  export STRIPE_WEBHOOK_SECRET='whsec_...'"
    echo "  export STRIPE_PRICE_PREMIUM_MONTHLY='price_...'"
    echo "  export STRIPE_PRICE_PREMIUM_YEARLY='price_...'"
    echo "  ./configure-edge-functions.sh"
    echo ""
    echo "Ou: source .env && ./configure-edge-functions.sh"
    exit 1
fi

echo "✅ Variables Stripe détectées dans l'environnement"

echo "📝 Configuration des secrets Stripe dans les Edge Functions..."

# Configurer les variables d'environnement dans le conteneur Edge Functions
docker exec -it $EDGE_FUNCTIONS_CONTAINER sh -c "
  echo 'STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY' >> /etc/environment
  echo 'STRIPE_PRICE_PREMIUM_MONTHLY=$STRIPE_PRICE_PREMIUM_MONTHLY' >> /etc/environment
  echo 'STRIPE_PRICE_PREMIUM_YEARLY=$STRIPE_PRICE_PREMIUM_YEARLY' >> /etc/environment
  echo 'STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET' >> /etc/environment
"

echo "✅ Variables d'environnement configurées"

# Créer les fonctions Edge directement dans le conteneur
echo "📦 Création des Edge Functions..."

# Créer le répertoire des fonctions s'il n'existe pas
docker exec -it $EDGE_FUNCTIONS_CONTAINER mkdir -p /home/deno/functions/create-checkout-session
docker exec -it $EDGE_FUNCTIONS_CONTAINER mkdir -p /home/deno/functions/stripe-webhook
docker exec -it $EDGE_FUNCTIONS_CONTAINER mkdir -p /home/deno/functions/verify-subscription
docker exec -it $EDGE_FUNCTIONS_CONTAINER mkdir -p /home/deno/functions/create-portal-session

echo "🔄 Redémarrage du conteneur Edge Functions..."
docker restart $EDGE_FUNCTIONS_CONTAINER

echo "✅ Configuration terminée!"
echo ""
echo "📌 Prochaines étapes:"
echo "1. Copier les fichiers des Edge Functions sur le VPS"
echo "2. Les déployer dans le conteneur"
echo "3. Configurer Kong pour router les requêtes"
echo "4. Tester le flow complet"