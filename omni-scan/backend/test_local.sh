#!/bin/bash
# Script de test local pour OmniScan Backend

echo "🔍 Test local OmniScan Backend"
echo "================================"

# 1. Test des imports Python
echo -e "\n📦 Test des imports Python..."
cd /home/greg/projets/dev/apps/omni-scan/backend
python3 -c "from app.services.ocr import OutputFormat; print('✅ Import OutputFormat OK')" 2>&1

# 2. Test avec uvicorn (sans démarrer le serveur complet)
echo -e "\n🧪 Test de l'application FastAPI..."
python3 -c "from app.main import app; print('✅ Import app OK')" 2>&1

# 3. Option pour lancer le serveur
echo -e "\n🚀 Pour lancer le serveur localement:"
echo "   cd dev/apps/omni-scan/backend"
echo "   uvicorn app.main:app --reload --port 8000"
echo ""
echo "🐳 Pour tester avec Docker (comme en prod):"
echo "   docker build -f Dockerfile.omniscan-backend -t omni-scan-backend ."
echo "   docker run -p 8000:8000 omni-scan-backend"