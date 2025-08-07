#!/bin/bash
# Script pour créer un repo de démonstration avec seulement les 3 projets

echo "🚀 Création du repo de démonstration..."

# Variables
DEMO_REPO="omnirealm-demo"
TEMP_DIR="/tmp/$DEMO_REPO"
GITHUB_USER="omnirealm-dev"  # Remplace par ton username

# Nettoyer si existe déjà
rm -rf $TEMP_DIR

# Créer structure
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# Initialiser git
git init
git branch -M main

# Créer README principal
cat > README.md << 'EOF'
# OmniRealm Demo - Portfolio de Projets

Ce repository contient 3 projets SaaS développés dans le cadre du système OmniRealm.

## 📱 Projets inclus

### 1. OmniScan - OCR & Analyse IA
Application de numérisation et d'analyse intelligente de documents.
- **Stack** : FastAPI (Python) + React + TypeScript
- **Dossier** : `/omni-scan`

### 2. OmniTask - Gestion de Tâches
Application de gestion de projets avec Kanban et priorisation IA.
- **Stack** : Next.js 14 + TypeScript + Supabase
- **Dossier** : `/omni-task`

### 3. OmniFit - Coach Fitness PWA
Application PWA de coaching fitness avec rappels programmables.
- **Stack** : React + TypeScript + PWA
- **Dossier** : `/omni-fit`

## 🚀 Installation

Chaque projet a son propre README avec les instructions détaillées.

## 📄 Architecture

Ces projets font partie d'un monorepo plus large utilisant pnpm workspaces.
Pour cette démo, les dépendances partagées ont été intégrées directement.
EOF

# Copier les projets
echo "📦 Copie des projets..."
cp -r ~/projets/dev/apps/omni-scan .
cp -r ~/projets/dev/apps/omni-task .
cp -r ~/projets/dev/apps/omni-fit .

# Copier les packages nécessaires
echo "📦 Copie des dépendances partagées..."
mkdir -p packages
cp -r ~/projets/dev/packages/ui packages/
cp -r ~/projets/dev/packages/utils packages/
cp -r ~/projets/dev/packages/supabase-kit packages/

# Copier les configs essentielles
cp ~/projets/tsconfig.base.json .
cp ~/projets/.eslintrc.js .
cp ~/projets/.prettierrc .

# Créer un package.json racine simplifié
cat > package.json << 'EOF'
{
  "name": "omnirealm-demo",
  "version": "1.0.0",
  "private": true,
  "description": "Demo repository for OmniRealm projects",
  "scripts": {
    "install:all": "npm install && cd omni-scan/frontend && npm install && cd ../backend && pip install -r requirements.txt && cd ../../omni-task && npm install && cd ../omni-fit && npm install",
    "dev:scan": "cd omni-scan && npm run dev",
    "dev:task": "cd omni-task && npm run dev",
    "dev:fit": "cd omni-fit && npm run dev"
  },
  "workspaces": [
    "packages/*",
    "omni-scan/frontend",
    "omni-task",
    "omni-fit"
  ],
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
EOF

# Nettoyer les fichiers sensibles
echo "🧹 Nettoyage des fichiers sensibles..."
find . -name ".env" -type f -delete
find . -name ".env.local" -type f -delete
find . -name "*.log" -type f -delete
find . -name ".DS_Store" -type f -delete

# Supprimer les dossiers sensibles
rm -rf omni-scan/backend/__pycache__
rm -rf omni-scan/backend/venv
rm -rf */node_modules
rm -rf */.next
rm -rf */dist

# Créer .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
build/
dist/
.next/
out/

# Misc
.DS_Store
*.pem
.env
.env.local
.env.production

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# Python
__pycache__/
*.py[cod]
*$py.class
venv/
.Python

# Logs
*.log
EOF

# Ajouter et commiter
git add .
git commit -m "Initial commit: OmniRealm demo projects"

echo "✅ Repo local créé dans $TEMP_DIR"
echo ""
echo "📤 Prochaines étapes :"
echo "1. Créer le repo sur GitHub :"
echo "   gh repo create $DEMO_REPO --public --description 'Portfolio de projets SaaS'"
echo ""
echo "2. Pousser le code :"
echo "   cd $TEMP_DIR"
echo "   git remote add origin git@github.com:$GITHUB_USER/$DEMO_REPO.git"
echo "   git push -u origin main"
echo ""
echo "3. Partager l'URL avec ton prof :"
echo "   https://github.com/$GITHUB_USER/$DEMO_REPO"