#!/bin/bash

echo "🚀 Configuration d'OmniScan..."

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    
    # Générer une clé secrète aléatoire
    SECRET_KEY=$(openssl rand -hex 32)
    sed -i "s/your-secret-key-change-in-production/$SECRET_KEY/g" .env
    
    echo "⚠️  IMPORTANT: Configurez vos clés API dans le fichier .env :"
    echo "   - SUPABASE_URL et SUPABASE_ANON_KEY"
    echo "   - OPENAI_API_KEY (optionnel)"
else
    echo "✅ Fichier .env existe déjà"
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
pnpm install

# Setup backend Python
echo "🐍 Configuration du backend Python..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Installer Tesseract si pas présent
if ! command -v tesseract &> /dev/null; then
    echo "📸 Installation de Tesseract OCR..."
    sudo apt-get update
    sudo apt-get install -y tesseract-ocr tesseract-ocr-fra tesseract-ocr-eng
fi

# Créer les dossiers nécessaires
mkdir -p uploads temp

cd ..

echo "✅ Configuration terminée !"
echo ""
echo "📌 Prochaines étapes :"
echo "1. Configurez vos clés API dans .env"
echo "2. Lancez l'application avec: pnpm dev"
echo "3. Accédez à http://localhost:3004"