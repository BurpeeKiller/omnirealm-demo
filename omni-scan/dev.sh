#!/bin/bash

echo "🚀 Démarrage d'OmniScan en mode développement..."

# Vérifier si .env existe
#if [ ! -f .env ]; then
#    echo "❌ Erreur: Fichier .env manquant. Exécutez d'abord: ./scripts/setup.sh"
#    exit 1
#fi

# Démarrer les services
echo "📡 Démarrage du backend sur http://localhost:8001..."
echo "🎨 Démarrage du frontend sur http://localhost:3004..."
echo ""

# Lancer avec pnpm
pnpm dev