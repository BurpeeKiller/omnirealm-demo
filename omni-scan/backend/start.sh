#!/bin/bash
# Script de démarrage pour OmniScan backend
# Désactive temporairement la variable DEBUG problématique

# Sauvegarder la valeur actuelle de DEBUG
OLD_DEBUG=$DEBUG

# Désactiver DEBUG pour ce processus
unset DEBUG

# Activer l'environnement virtuel
. venv/bin/activate

# Démarrer uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Restaurer DEBUG (si le script se termine)
export DEBUG=$OLD_DEBUG