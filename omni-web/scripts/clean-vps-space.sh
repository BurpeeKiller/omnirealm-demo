#!/bin/bash

# Script pour nettoyer l'espace disque sur le VPS
# ATTENTION: À exécuter avec précaution sur le serveur

echo "🧹 Nettoyage de l'espace disque VPS..."

# 1. Nettoyer les images Docker non utilisées
echo "📦 Nettoyage des images Docker..."
docker image prune -a -f
docker container prune -f
docker volume prune -f
docker network prune -f

# 2. Nettoyer le cache de build Docker
echo "🔧 Nettoyage du cache de build Docker..."
docker builder prune -a -f

# 3. Afficher l'espace libéré
echo "💾 Espace disque après nettoyage:"
df -h

# 4. Afficher les plus gros répertoires
echo "📊 Top 10 des plus gros répertoires:"
du -h / 2>/dev/null | sort -rh | head -20

# 5. Nettoyer les logs si nécessaire (optionnel)
# echo "📄 Nettoyage des vieux logs..."
# find /var/log -type f -name "*.log" -mtime +30 -delete
# journalctl --vacuum-time=7d

echo "✅ Nettoyage terminé!"