#!/bin/bash

# Script optimal utilisant Turborepo + Turbopack

echo "🚀 Démarrage optimal d'OmniTask"
echo "📦 Turborepo : Isolation et cache intelligent"
echo "⚡ Turbopack : Compilation ultra-rapide"
echo ""

# Se placer à la racine du monorepo
cd /home/greg/projets

# Variables d'environnement optimales
export NODE_OPTIONS="--max-old-space-size=2048"
export NEXT_TELEMETRY_DISABLED=1

# Lancer avec Turborepo + Turbopack
exec pnpm turbo dev --filter=@omnirealm/omni-task -- --turbo