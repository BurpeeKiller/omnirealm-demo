#!/bin/bash
# Script de nettoyage mémoire pour OmniTask
# Résout le problème de consommation excessive (335MB cache + 3GB TypeScript)

echo "🧹 Nettoyage mémoire OmniTask..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Arrêter les processus dev
echo "⏹️  Arrêt des processus dev..."
pnpm run stop 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "tsserver" 2>/dev/null || true
pkill -f "turbopack" 2>/dev/null || true

# 2. Afficher l'espace avant nettoyage
echo ""
echo "📊 Espace utilisé AVANT nettoyage:"
du -sh .next 2>/dev/null || echo "  .next: non trouvé"
du -sh node_modules/.cache 2>/dev/null || echo "  node_modules/.cache: non trouvé"
du -sh .turbo 2>/dev/null || echo "  .turbo: non trouvé"

# 3. Nettoyer les caches
echo ""
echo "🗑️  Suppression des caches..."
rm -rf .next/cache
rm -rf .next/static
rm -rf .turbo
rm -rf node_modules/.cache
rm -rf .next/server/app-paths-manifest.json
rm -rf .next/server/middleware-manifest.json

# 4. Nettoyer les logs
echo "📄 Nettoyage des logs..."
find . -name "*.log" -type f -delete 2>/dev/null
find . -name ".DS_Store" -type f -delete 2>/dev/null

# 5. Afficher l'espace après nettoyage
echo ""
echo "📊 Espace utilisé APRÈS nettoyage:"
du -sh .next 2>/dev/null || echo "  .next: nettoyé"
du -sh . | tail -1

# 6. Afficher la mémoire système
echo ""
echo "💾 Mémoire système:"
free -h | grep -E "^Mem|^Swap" | awk '{printf "  %-6s Total: %6s | Utilisé: %6s | Libre: %6s\n", $1, $2, $3, $4}'

# 7. Conseils
echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "💡 Conseils pour éviter le problème:"
echo "  1. Ajouter au .gitignore: .next/cache/"
echo "  2. Redémarrer avec: pnpm run dev"
echo "  3. Utiliser Turbopack: pnpm run dev --turbo"
echo "  4. Limiter TypeScript: export NODE_OPTIONS='--max-old-space-size=1024'"
echo ""
echo "🚀 Pour redémarrer proprement: pnpm run dev"