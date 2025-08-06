#!/bin/bash

echo "🔍 Diagnostic de performance Fitness Reminder"
echo "============================================"

# Vérifier les processus node
echo -e "\n📊 Processus Node en cours :"
ps aux | grep node | grep -v grep | wc -l
echo "processus trouvés"

# Vérifier la mémoire
echo -e "\n💾 Utilisation mémoire :"
free -h | grep Mem

# Vérifier l'espace disque
echo -e "\n💿 Espace disque :"
df -h | grep -E "/$|/mnt/h"

# Vérifier le cache npm/pnpm
echo -e "\n📦 Taille des caches :"
echo -n "node_modules: "
du -sh ../../node_modules 2>/dev/null || echo "N/A"
echo -n "Cache .vite: "
du -sh node_modules/.vite 2>/dev/null || echo "N/A"

# Vérifier les ports utilisés
echo -e "\n🔌 Ports utilisés :"
netstat -tlnp 2>/dev/null | grep :5173 || echo "Port 5173 libre"

# Suggestion de nettoyage
echo -e "\n🧹 Pour nettoyer et relancer :"
echo "1. Tuer tous les processus : pkill -f node"
echo "2. Nettoyer le cache : rm -rf node_modules/.vite"
echo "3. Relancer : pnpm run dev --host"

# Alternative Windows
echo -e "\n💡 Alternative plus rapide (depuis PowerShell/Git Bash) :"
echo "cd H:/OmniRealm/omni-systeme/dev/apps/12-fitness-reminder"
echo "pnpm run dev --host"