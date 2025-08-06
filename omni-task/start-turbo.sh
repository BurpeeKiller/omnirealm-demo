#!/bin/bash

# Script de démarrage optimisé avec Turbopack

# Nettoyer les anciens processus
pkill -f "next dev" 2>/dev/null || true

# Nettoyer le cache
rm -rf .next/cache

# Variables d'environnement pour stabilité et performance
export NODE_OPTIONS="--max-old-space-size=2048"
export NEXT_TELEMETRY_DISABLED=1

# Activer Turbopack pour des builds ultra-rapides
export TURBOPACK=1

echo "🚀 Démarrage d'OmniTask avec Turbopack..."
echo "⚡ Builds jusqu'à 10x plus rapides"
echo "📍 URL: http://localhost:3000"
echo ""

# Démarrer Next.js avec Turbopack
exec pnpm dev --turbo