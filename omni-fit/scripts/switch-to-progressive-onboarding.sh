#!/bin/bash

# Script pour activer le nouveau système d'onboarding progressif

echo "🚀 Activation du système d'onboarding progressif..."

# Sauvegarder App.tsx actuel
cp src/App.tsx src/App.old.tsx
echo "✅ Backup de App.tsx créé"

# Remplacer App.tsx par AppClean.tsx
cp src/AppClean.tsx src/App.tsx
echo "✅ Nouveau système d'onboarding activé"

# Nettoyer les imports dans App.tsx
echo "🔧 Nettoyage des imports..."

# Supprimer les imports liés à l'ancien système
sed -i '/OnboardingFlow/d' src/App.tsx
sed -i '/OnboardingModal/d' src/App.tsx
sed -i '/OnboardingDebug/d' src/App.tsx
sed -i '/useOnboarding/d' src/App.tsx

echo "✅ Imports nettoyés"

# Vérifier que les nouveaux composants sont présents
if [ -f "src/components/Onboarding/ProgressiveOnboarding.tsx" ] && [ -f "src/components/Onboarding/OnboardingTrigger.tsx" ] && [ -f "src/components/Onboarding/ContextualTips.tsx" ]; then
    echo "✅ Tous les nouveaux composants sont présents"
else
    echo "❌ Certains composants manquent"
    exit 1
fi

# Vérifier que le hook est présent
if [ -f "src/hooks/useProgressiveOnboarding.ts" ]; then
    echo "✅ Hook progressif présent"
else
    echo "❌ Hook manquant"
    exit 1
fi

# Vérifier que les utilitaires sont présents
if [ -f "src/utils/contextualTips.ts" ]; then
    echo "✅ Utilitaires présents"
else
    echo "❌ Utilitaires manquants"
    exit 1
fi

echo ""
echo "🎉 Migration terminée avec succès !"
echo ""
echo "📋 Que faire maintenant :"
echo "1. Tester l'application : pnpm run dev"
echo "2. Vérifier que le bouton d'aide apparaît en bas à gauche"
echo "3. Cliquer sur le bouton pour tester l'onboarding"
echo "4. Tester les tips contextuels en utilisant des exercices"
echo ""
echo "💡 Tips :"
echo "- Le bouton montre 'Sparkles' pour les nouveaux utilisateurs"
echo "- Les tips apparaissent automatiquement après certaines actions"
echo "- Tout est non-bloquant et peut être fermé à tout moment"
echo ""
echo "🔄 Pour revenir à l'ancien système :"
echo "cp src/App.old.tsx src/App.tsx"