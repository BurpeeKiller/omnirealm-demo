#!/bin/bash

# Nettoyer les anciens processus
pkill -f "next dev" 2>/dev/null || true

# Nettoyer le cache
rm -rf .next/cache

# Variables d'environnement pour stabilité
export NODE_OPTIONS="--max-old-space-size=2048"
export NEXT_TELEMETRY_DISABLED=1

echo "🚀 Démarrage d'OmniTask..."
echo "📍 URL: http://localhost:3000"
echo ""

# Démarrer Next.js
exec pnpm dev