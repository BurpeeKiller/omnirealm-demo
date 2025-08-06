#!/bin/bash

# Script pour démarrer OmniFit avec le backend

echo "🚀 Démarrage OmniFit avec Backend Stripe..."

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Vérifier si les .env existent
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env frontend manquant. Copie depuis .env.example${NC}"
    cp .env.example .env
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Fichier backend/.env manquant. Copie depuis .env.example${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}📝 Configurer vos clés Stripe dans backend/.env avant de continuer${NC}"
    exit 1
fi

# Fonction pour démarrer le backend
start_backend() {
    echo -e "${GREEN}🔧 Démarrage du backend (port 8003)...${NC}"
    cd backend
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -q -r requirements.txt
    python main.py &
    BACKEND_PID=$!
    cd ..
}

# Fonction pour démarrer le frontend
start_frontend() {
    echo -e "${GREEN}🎨 Démarrage du frontend (port 3003)...${NC}"
    pnpm install
    pnpm run dev --port 3003 --host &
    FRONTEND_PID=$!
}

# Démarrer les services
start_backend
sleep 3  # Attendre que le backend démarre
start_frontend

echo ""
echo -e "${GREEN}✅ OmniFit démarré !${NC}"
echo ""
echo "📱 Frontend : http://localhost:3003"
echo "🔧 Backend API : http://localhost:8003"
echo "📚 Documentation API : http://localhost:8003/docs"
echo ""
echo "💳 Pour tester les paiements :"
echo "   1. Configurer vos clés Stripe dans backend/.env"
echo "   2. Utiliser la carte test : 4242 4242 4242 4242"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les services"

# Attendre et nettoyer à la sortie
wait $FRONTEND_PID
wait $BACKEND_PID