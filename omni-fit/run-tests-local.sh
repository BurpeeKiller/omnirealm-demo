#!/bin/bash
# Script pour lancer les tests localement avec installation des dépendances

echo "🧪 Test local pour Fitness Reminder"
echo "===================================="

# Se placer dans le bon répertoire
cd "$(dirname "$0")"

# Vérifier si node_modules local existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances locales..."
    npm install --no-save
fi

# Lancer les tests avec limite mémoire
echo "🚀 Lancement des tests..."
NODE_OPTIONS="--max-old-space-size=2048" npx vitest --run --reporter=verbose

echo ""
echo "✅ Tests terminés!"