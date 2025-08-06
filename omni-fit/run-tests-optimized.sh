#!/bin/bash
# Script de test optimisé pour éviter les timeouts

echo "🧪 Lancement des tests optimisés..."

# Configuration de l'environnement
export NODE_ENV=test
export NODE_OPTIONS="--max-old-space-size=2048"  # Limite mémoire à 2GB

# Nettoyer le cache
echo "🧹 Nettoyage du cache..."
rm -rf .vitest-cache
rm -rf node_modules/.vite
rm -rf node_modules/.cache

# Options pour npx vitest
VITEST_OPTIONS=(
  "--config=vitest.config.optimized.ts"
  "--run"                    # Pas de mode watch
  "--no-threads"            # Désactiver les threads
  "--reporter=basic"        # Reporter minimal
  "--bail=3"                # Arrêter après 3 échecs
)

# Exécuter les tests par groupe pour éviter les timeouts
echo ""
echo "📊 Tests Analytics..."
npx vitest "${VITEST_OPTIONS[@]}" src/__tests__/services/analytics.optimized.test.ts

echo ""
echo "🎯 Tests principaux (sans analytics/backup)..."
npx vitest "${VITEST_OPTIONS[@]}" \
  --exclude="**/analytics.test.ts" \
  --exclude="**/backup.test.ts" \
  --exclude="**/*.e2e.test.ts"

# Résumé
echo ""
echo "✅ Tests terminés!"
echo ""
echo "💡 Pour exécuter tous les tests standards :"
echo "   pnpm run test"
echo ""
echo "💡 Pour un test spécifique :"
echo "   npx vitest run path/to/test.ts"