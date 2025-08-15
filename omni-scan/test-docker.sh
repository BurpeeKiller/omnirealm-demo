#!/bin/bash

# Script de test local pour OmniScan Docker
# Usage: ./test-omniscan-docker.sh

set -e

echo "🧪 Test du build Docker OmniScan..."

# Couleurs pour l'output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les étapes
step() {
    echo -e "\n${YELLOW}▶ $1${NC}"
}

# Fonction pour afficher le succès
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# Aller à la racine du monorepo
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/../../.." || error "Impossible de naviguer vers la racine du monorepo"

# Vérifier que nous sommes à la racine du monorepo
if [ ! -f "pnpm-workspace.yaml" ]; then
    error "Ce script doit être exécuté depuis la racine du monorepo"
fi

# Nettoyer les anciens conteneurs
step "Nettoyage des anciens conteneurs..."
docker-compose -f dev/apps/omni-scan/docker-compose.yml down 2>/dev/null || true
success "Nettoyage terminé"

# Build des images
step "Build des images Docker..."
docker-compose -f dev/apps/omni-scan/docker-compose.yml build --no-cache || error "Échec du build"
success "Build terminé avec succès"

# Démarrer les services
step "Démarrage des services..."
docker-compose -f dev/apps/omni-scan/docker-compose.yml up -d || error "Échec du démarrage"
success "Services démarrés"

# Attendre que les services soient prêts
step "Attente du démarrage des services..."
sleep 10

# Vérifier la santé des services
step "Vérification de la santé des services..."

# Backend
if curl -f http://localhost:8001/api/v1/health 2>/dev/null; then
    success "Backend API opérationnel"
else
    error "Backend API non accessible"
fi

# Frontend
if curl -f http://localhost:3001 2>/dev/null | grep -q "OmniScan"; then
    success "Frontend opérationnel"
else
    error "Frontend non accessible"
fi

# Redis
if docker exec omniscan-redis redis-cli ping | grep -q PONG; then
    success "Redis opérationnel"
else
    error "Redis non accessible"
fi

# Afficher les logs
step "Logs des services (dernières 20 lignes)..."
echo -e "\n--- Backend ---"
docker-compose -f dev/apps/omni-scan/docker-compose.yml logs --tail=20 backend

echo -e "\n--- Frontend ---"
docker-compose -f dev/apps/omni-scan/docker-compose.yml logs --tail=20 frontend

echo -e "\n--- Redis ---"
docker-compose -f dev/apps/omni-scan/docker-compose.yml logs --tail=20 redis

# Résumé
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Test Docker OmniScan réussi !${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "\nAccès local :"
echo -e "  Frontend : http://localhost:3001"
echo -e "  Backend  : http://localhost:8001"
echo -e "  API Docs : http://localhost:8001/docs"

echo -e "\nPour arrêter les services :"
echo -e "  ${YELLOW}docker-compose -f dev/apps/omni-scan/docker-compose.yml down${NC}"

echo -e "\nPour voir les logs en temps réel :"
echo -e "  ${YELLOW}docker-compose -f dev/apps/omni-scan/docker-compose.yml logs -f${NC}"