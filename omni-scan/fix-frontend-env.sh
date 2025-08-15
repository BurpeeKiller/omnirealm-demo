#!/bin/bash

# Script pour corriger les variables d'environnement du frontend OmniScan

echo "🔧 Fix des variables d'environnement pour OmniScan Frontend"
echo "=========================================================="

# Variables requises
cat << EOF
Variables à configurer dans Coolify pour le build:

Build Variables (dans l'onglet "Build"):
----------------------------------------
VITE_SUPABASE_URL=https://api.supabase.omnirealm.tech
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1NDU4MTQ0MCwiZXhwIjo0OTEwMjU1MDQwLCJyb2xlIjoiYW5vbiJ9.PgXZF2aQ6FaDHZXAVuP-SXRHIM7_AAdaV9AC9BKrnYA
VITE_API_URL=https://api.scan.omnirealm.tech

⚠️  IMPORTANT: Ces variables doivent être définies dans l'onglet "Build" de Coolify,
pas dans l'onglet "Environment Variables" !

Actions à faire:
1. Aller dans Coolify > scan-front-production > Build
2. Ajouter les 3 variables ci-dessus
3. Re-déployer l'application

Alternative temporaire:
----------------------
Si les variables ne passent pas, modifier le Dockerfile pour les hardcoder:

ENV VITE_SUPABASE_URL=https://api.supabase.omnirealm.tech
ENV VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1NDU4MTQ0MCwiZXhwIjo0OTEwMjU1MDQwLCJyb2xlIjoiYW5vbiJ9.PgXZF2aQ6FaDHZXAVuP-SXRHIM7_AAdaV9AC9BKrnYA
ENV VITE_API_URL=https://api.scan.omnirealm.tech
EOF

echo -e "\n✅ Instructions affichées. Configurer dans Coolify et redéployer."