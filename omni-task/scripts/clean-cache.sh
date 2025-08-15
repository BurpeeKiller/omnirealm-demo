#!/bin/bash

# Script de nettoyage du cache Next.js avec limite de taille

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Limite de taille du cache (200MB)
CACHE_LIMIT_MB=200

# Répertoire du cache
CACHE_DIR=".next"

echo -e "${YELLOW}🧹 Nettoyage du cache Next.js...${NC}"

# Vérifier si le dossier .next existe
if [ ! -d "$CACHE_DIR" ]; then
    echo -e "${GREEN}✅ Pas de cache à nettoyer${NC}"
    exit 0
fi

# Obtenir la taille actuelle du cache
CACHE_SIZE=$(du -sm "$CACHE_DIR" 2>/dev/null | cut -f1)

if [ -z "$CACHE_SIZE" ]; then
    CACHE_SIZE=0
fi

echo -e "📊 Taille actuelle du cache : ${CACHE_SIZE}MB (limite : ${CACHE_LIMIT_MB}MB)"

# Si le cache dépasse la limite
if [ "$CACHE_SIZE" -gt "$CACHE_LIMIT_MB" ]; then
    echo -e "${YELLOW}⚠️  Cache trop volumineux, nettoyage en cours...${NC}"
    
    # Nettoyer les fichiers les plus anciens du cache
    find "$CACHE_DIR/cache" -type f -mtime +1 -delete 2>/dev/null || true
    
    # Si toujours trop gros, nettoyer plus agressivement
    NEW_SIZE=$(du -sm "$CACHE_DIR" 2>/dev/null | cut -f1)
    if [ "$NEW_SIZE" -gt "$CACHE_LIMIT_MB" ]; then
        echo -e "${YELLOW}🗑️  Nettoyage complet du cache...${NC}"
        rm -rf "$CACHE_DIR/cache"
        mkdir -p "$CACHE_DIR/cache"
    fi
    
    FINAL_SIZE=$(du -sm "$CACHE_DIR" 2>/dev/null | cut -f1)
    echo -e "${GREEN}✅ Cache nettoyé : ${CACHE_SIZE}MB → ${FINAL_SIZE}MB${NC}"
else
    echo -e "${GREEN}✅ Cache dans les limites${NC}"
fi

# Nettoyer aussi les logs de build trop anciens
if [ -d "$CACHE_DIR/trace" ]; then
    find "$CACHE_DIR/trace" -name "*.log" -mtime +7 -delete 2>/dev/null || true
fi

# Afficher les statistiques finales
echo -e "\n${GREEN}📈 Statistiques du cache :${NC}"
echo -e "  - Build outputs : $(du -sh "$CACHE_DIR/server" 2>/dev/null | cut -f1 || echo "0")"
echo -e "  - Cache : $(du -sh "$CACHE_DIR/cache" 2>/dev/null | cut -f1 || echo "0")"
echo -e "  - Static : $(du -sh "$CACHE_DIR/static" 2>/dev/null | cut -f1 || echo "0")"
echo -e "  - Total : $(du -sh "$CACHE_DIR" 2>/dev/null | cut -f1 || echo "0")"