#!/bin/bash
set -e

echo "=== Test build OmniScan Backend ==="
echo "Test des dépendances Python uniquement..."

cd /home/greg/projets/dev/apps/omni-scan/backend

# Créer un environnement virtuel temporaire
python3 -m venv test_env
source test_env/bin/activate

# Tester l'installation des dépendances
echo "Installation des dépendances..."
pip install --upgrade pip
pip install -r requirements.txt --dry-run

echo ""
echo "=== Résolution des dépendances ==="
pip list

deactivate
rm -rf test_env

echo "Test terminé!"