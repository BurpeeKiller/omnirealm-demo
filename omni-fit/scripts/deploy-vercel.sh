#!/bin/bash

# Script de déploiement Vercel pour Fitness Reminder
# Workflow complet: build + test + deploy

set -e

echo "🚀 Déploiement Vercel - Fitness Reminder"
echo "======================================="

# 1. Build production
echo "🏗️ Build production..."
./scripts/build-production.sh

# 2. Configuration Vercel
echo "⚙️ Configuration Vercel..."

# Créer vercel.json s'il n'existe pas
if [ ! -f "vercel.json" ]; then
    cat > vercel.json << EOF
{
  "version": 2,
  "name": "fitness-reminder",
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/sw.js",
      "headers": {
        "Service-Worker-Allowed": "/"
      }
    },
    {
      "src": "/manifest.json",
      "headers": {
        "Content-Type": "application/manifest+json"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF
    echo "✅ vercel.json créé"
fi

# 3. Déploiement
echo "🌐 Déploiement en cours..."

if command -v vercel &> /dev/null; then
    # Déploiement de production
    vercel --prod --yes
    
    echo ""
    echo "✅ Déploiement terminé!"
    echo "========================"
    echo "🌐 URL de production: https://fitness-reminder.vercel.app"
    echo "📱 PWA installable depuis le navigateur"
    echo ""
    echo "🔗 Liens utiles:"
    echo "   - Dashboard Vercel: https://vercel.com/dashboard"
    echo "   - Analytics: https://vercel.com/analytics"
    echo "   - Lighthouse: https://pagespeed.web.dev/"
    echo ""
else
    echo "❌ Vercel CLI non installé"
    echo "💡 Installation: npm i -g vercel"
    exit 1
fi