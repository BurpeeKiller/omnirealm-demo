#!/bin/bash

# Script de déploiement des Edge Functions OmniFit

echo "🚀 Déploiement des Edge Functions OmniFit..."

# Vérifier que Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé"
    exit 1
fi

# Se positionner dans le dossier du projet
cd /home/greg/projets/dev/apps/omni-fit

# Déployer chaque fonction
functions=("verify-subscription" "create-checkout-session" "handle-webhook")

for func in "${functions[@]}"; do
    echo "📦 Déploiement de $func..."
    
    supabase functions deploy $func \
        --project-ref cosgs4ss08wgwow4skgw0s80 \
        --no-verify-jwt
    
    if [ $? -eq 0 ]; then
        echo "✅ $func déployée avec succès"
    else
        echo "❌ Erreur lors du déploiement de $func"
    fi
done

echo -e "\n📝 Configuration des secrets Stripe:"
echo "Exécutez ces commandes avec vos vraies clés Stripe:"
echo ""
echo "supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx"
echo "supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx"
echo "supabase secrets set STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx"
echo "supabase secrets set STRIPE_PRICE_PREMIUM_YEARLY=price_yyy"

echo -e "\n✅ Déploiement terminé!"