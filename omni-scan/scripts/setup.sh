#!/bin/bash

echo "🚀 Configuration d'OmniScan..."

# Créer les dossiers nécessaires
mkdir -p uploads temp

# Copier le fichier .env si nécessaire
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Fichier .env créé. Veuillez le configurer avec vos clés."
fi

# Installer les dépendances Node
echo "📦 Installation des dépendances frontend..."
pnpm install

# Créer l'environnement Python
echo "🐍 Configuration du backend Python..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "✅ Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurer le fichier .env avec vos clés Supabase et OpenAI"
echo "2. Lancer l'application avec: pnpm dev"