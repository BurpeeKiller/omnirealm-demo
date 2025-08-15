#!/bin/bash

echo "🚀 Déploiement automatique d'OmniTask sur Netlify..."

# Créer le build
echo "📦 Build en cours..."
pnpm run build

# Créer un dossier temporaire pour le déploiement
echo "📁 Préparation des fichiers..."
rm -rf netlify-deploy
mkdir -p netlify-deploy

# Copier les fichiers nécessaires pour Next.js sur Netlify
cp -r .next netlify-deploy/
cp package.json netlify-deploy/
cp -r public netlify-deploy/ 2>/dev/null || true
cp -r node_modules netlify-deploy/ 2>/dev/null || echo "⚠️  node_modules sera installé par Netlify"

# Créer un netlify.toml dans le dossier de déploiement
cat > netlify-deploy/netlify.toml << 'EOF'
[build]
  command = "npm install && npm run build"
  publish = ".next"

[build.environment]
  NEXT_PRIVATE_TARGET = "server"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
EOF

# Créer un zip pour le déploiement manuel
echo "📦 Création de l'archive..."
cd netlify-deploy
zip -r ../omni-task-deploy.zip . -x "node_modules/*"
cd ..

echo "✅ Archive créée : omni-task-deploy.zip"
echo ""
echo "📋 Instructions pour déployer :"
echo "1. Va sur https://app.netlify.com/drop"
echo "2. Glisse et dépose le fichier omni-task-deploy.zip"
echo "3. Une fois déployé, configure le domaine tasks.omnirealm.tech"
echo ""
echo "Ou utilise netlify-cli :"
echo "netlify deploy --dir=netlify-deploy --prod"