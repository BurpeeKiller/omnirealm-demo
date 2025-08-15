#!/bin/bash
# Script de setup pour l'environnement local OmniScan Backend

echo "🔧 Setup environnement local OmniScan Backend"
echo "============================================="

# 1. Créer un environnement virtuel Python
echo -e "\n📦 Création de l'environnement virtuel..."
python3 -m venv venv

# 2. Activer l'environnement
echo -e "\n🔌 Activation de l'environnement..."
source venv/bin/activate

# 3. Installer les dépendances
echo -e "\n📥 Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt

# 4. Tester les imports
echo -e "\n✅ Test des imports..."
python3 -c "from app.services.ocr import OutputFormat; print('✅ Import OutputFormat OK')"
python3 -c "from app.main import app; print('✅ Import FastAPI app OK')"

echo -e "\n🎉 Setup terminé !"
echo -e "\nPour utiliser l'environnement :"
echo "   cd dev/apps/omni-scan/backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload --port 8000"