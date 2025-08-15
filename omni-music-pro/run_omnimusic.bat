@echo off
REM Script de lancement OmniMusic Pro avec environnement virtuel

cd /d "/home/greg/projets/dev/apps/omni-music-pro"
call "/home/greg/projets/dev/apps/omni-music-pro/venv\Scripts\activate.bat"

echo 🎵 OmniMusic Pro - Environnement activé
echo 📁 Répertoire: /home/greg/projets/dev/apps/omni-music-pro
python --version
echo.

REM Vérifier les dépendances
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

echo.
echo 🎯 Applications disponibles:
echo    1. python simulation_test.py  - Tests de simulation
echo    2. python test_fixed_gui.py   - Interface graphique  
echo    3. python debug_gui.py        - Mode debug
echo.

if "%1"=="" (
    echo Que voulez-vous lancer?
    echo 1) Tests de simulation
    echo 2) Interface graphique
    echo 3) Mode debug
    echo 4) Invite de commandes
    set /p choice="Choix (1-4): "
    
    if "%choice%"=="1" python simulation_test.py
    if "%choice%"=="2" python test_fixed_gui.py
    if "%choice%"=="3" python debug_gui.py
    if "%choice%"=="4" cmd
) else (
    %*
)

pause
