#!/bin/bash
# Script de lancement OmniMusic Pro avec environnement virtuel

cd "/home/greg/projets/dev/apps/omni-music-pro"
source "/home/greg/projets/dev/apps/omni-music-pro/venv/bin/activate"

echo "🎵 OmniMusic Pro - Environnement activé"
echo "📁 Répertoire: /home/greg/projets/dev/apps/omni-music-pro"
echo "🐍 Python: $(python --version)"
echo ""

# Vérifier les dépendances
python -c "
import sys
modules = ['aiosqlite', 'customtkinter', 'yt_dlp', 'mutagen', 'PIL']
missing = []
for mod in modules:
    try:
        __import__(mod)
        print(f'✅ {mod}')
    except ImportError:
        missing.append(mod)
        print(f'❌ {mod}')

if missing:
    print(f'\n⚠️  Modules manquants: {missing}')
    print('💡 Relancez: python setup_venv.py')
else:
    print('\n🎉 Tous les modules sont disponibles!')
"

echo ""
echo "🎯 Applications disponibles:"
echo "   1. python simulation_test.py  - Tests de simulation"  
echo "   2. python test_fixed_gui.py   - Interface graphique"
echo "   3. python debug_gui.py        - Mode debug"
echo ""

# Lancer le menu interactif si pas d'argument
if [ $# -eq 0 ]; then
    echo "Que voulez-vous lancer?"
    echo "1) Tests de simulation"
    echo "2) Interface graphique" 
    echo "3) Mode debug"
    echo "4) Shell interactif"
    read -p "Choix (1-4): " choice
    
    case $choice in
        1) python simulation_test.py ;;
        2) python test_fixed_gui.py ;;
        3) python debug_gui.py ;;
        4) bash ;;
        *) echo "Choix invalide" ;;
    esac
else
    # Exécuter la commande passée en argument
    "$@"
fi
