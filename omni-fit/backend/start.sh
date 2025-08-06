#!/bin/bash

# Script de démarrage OmniFit Backend

echo "🚀 Démarrage OmniFit Backend..."

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 n'est pas installé"
    exit 1
fi

# Créer venv si nécessaire
if [ ! -d "venv" ]; then
    echo "📦 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer venv
source venv/bin/activate

# Installer dépendances
echo "📦 Installation des dépendances..."
pip install -r requirements.txt

# Vérifier .env
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant ! Copie depuis .env.example"
    cp .env.example .env
    echo "📝 Merci de configurer vos clés Stripe dans .env"
    exit 1
fi

# Lancer le serveur
echo "✅ Serveur démarré sur http://localhost:8003"
echo "📚 Documentation API : http://localhost:8003/docs"
python main.py