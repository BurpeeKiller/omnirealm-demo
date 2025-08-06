#!/bin/bash
# Script pour démarrer OmniTask avec les variables globales du système multi-dev

# Charger les variables globales
source /home/greg/projets/shared/scripts/ports/.env.ports

# Afficher les variables pour debug
echo "🔧 OmniTask - Variables d'environnement globales chargées:"
echo "   OMNITASK_PORT: $OMNITASK_PORT"
echo "   OMNITASK_SUPABASE_URL: ${OMNITASK_SUPABASE_URL:0:30}..."
echo "   OMNITASK_FRONTEND_URL: $OMNITASK_FRONTEND_URL"

# Exporter les variables pour Next.js si elles n'existent pas déjà
export NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-$OMNITASK_SUPABASE_URL}
export NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-$OMNITASK_SUPABASE_ANON_KEY}
export NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-$OMNITASK_FRONTEND_URL}

# Démarrer Next.js
pnpm dev