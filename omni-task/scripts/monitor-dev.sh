#!/bin/bash

# Script de monitoring pour le développement OmniTask

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 Monitoring OmniTask Development${NC}"
echo -e "================================="

# Fonction pour obtenir l'usage mémoire d'un processus
get_memory_usage() {
    local process_name=$1
    local pid=$(pgrep -f "$process_name" | head -1)
    if [ -n "$pid" ]; then
        local mem=$(ps -p $pid -o rss= 2>/dev/null | awk '{print int($1/1024)}')
        echo "${mem:-0}"
    else
        echo "0"
    fi
}

# Monitoring en boucle
while true; do
    clear
    echo -e "${BLUE}📊 OmniTask Dev Monitor - $(date '+%H:%M:%S')${NC}"
    echo -e "====================================="
    
    # Processus Next.js
    NEXT_MEM=$(get_memory_usage "next-server")
    NEXT_STATUS="❌ Arrêté"
    if [ "$NEXT_MEM" -gt 0 ]; then
        NEXT_STATUS="${GREEN}✅ Actif${NC}"
        if [ "$NEXT_MEM" -gt 800 ]; then
            NEXT_STATUS="${YELLOW}⚠️  Mémoire élevée${NC}"
        fi
    fi
    echo -e "Next.js Server: $NEXT_STATUS (${NEXT_MEM}MB)"
    
    # TypeScript server
    TS_MEM=$(get_memory_usage "typescript")
    echo -e "TypeScript LSP: ${TS_MEM}MB"
    
    # Cache Next.js
    if [ -d ".next" ]; then
        CACHE_SIZE=$(du -sm ".next" 2>/dev/null | cut -f1)
        CACHE_STATUS="${GREEN}OK${NC}"
        if [ "$CACHE_SIZE" -gt 200 ]; then
            CACHE_STATUS="${YELLOW}⚠️  Nettoyage recommandé${NC}"
        fi
        echo -e "Cache .next: ${CACHE_SIZE}MB $CACHE_STATUS"
    fi
    
    # Port 3002
    PORT_CHECK=$(lsof -i :3002 2>/dev/null | grep LISTEN)
    if [ -n "$PORT_CHECK" ]; then
        echo -e "Port 3002: ${GREEN}✅ Ouvert${NC}"
    else
        echo -e "Port 3002: ${RED}❌ Fermé${NC}"
    fi
    
    # Mémoire système totale
    echo -e "\n${YELLOW}Système:${NC}"
    free -h | grep Mem | awk '{print "  RAM: " $3 " / " $2 " (" int($3/$2 * 100) "%)"}'
    
    # Actions suggérées
    echo -e "\n${BLUE}Actions suggérées:${NC}"
    if [ "$CACHE_SIZE" -gt 200 ]; then
        echo -e "  • Lancer ${YELLOW}pnpm run clean:cache${NC}"
    fi
    if [ "$NEXT_MEM" -gt 800 ]; then
        echo -e "  • Redémarrer Next.js : ${YELLOW}Ctrl+C puis pnpm run dev${NC}"
    fi
    if [ "$TS_MEM" -gt 3000 ]; then
        echo -e "  • Redémarrer VSCode pour libérer TypeScript"
    fi
    
    echo -e "\nAppuyez sur Ctrl+C pour quitter"
    sleep 5
done