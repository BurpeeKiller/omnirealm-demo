#!/bin/bash

echo "🚀 Déploiement d'OmniTask sur Netlify..."

# Build de production
echo "📦 Build de production Next.js..."
pnpm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

# Créer un fichier _redirects pour Next.js
echo "📝 Configuration des redirections..."
mkdir -p .next/static
cat > .next/static/_redirects << 'EOF'
/* /index.html 200
EOF

# Déployer sur Netlify
echo "🌐 Déploiement sur Netlify..."
netlify deploy --prod --dir=.next

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo ""
    echo "🔗 Votre app est maintenant accessible"
    echo "📊 Pour voir le statut : netlify status"
    echo ""
    echo "⚠️  Note : Pour configurer le domaine tasks.omnirealm.tech :"
    echo "1. Allez dans Netlify Dashboard > Domain settings"
    echo "2. Ajoutez tasks.omnirealm.tech comme custom domain"
    echo "3. Configurez le DNS dans Cloudflare"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi