#!/bin/bash
set -euo pipefail

# Test de connexion Supabase local et production
echo "🧪 Test des connexions Supabase pour OmniTask"
echo "=============================================="

# Variables
LOCAL_URL="http://localhost:54321"
PROD_URL="https://supabase.omnirealm.tech"
PROD_ANON_KEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1NDU4MTQ0MCwiZXhwIjo0OTEwMjU1MDQwLCJyb2xlIjoiYW5vbiJ9.PgXZF2aQ6FaDHZXAVuP-SXRHIM7_AAdaV9AC9BKrnYA"
LOCAL_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

# Test local
echo
echo "🔍 Test Supabase Local..."
if curl -s -f "${LOCAL_URL}/rest/v1/" -H "apikey: ${LOCAL_ANON_KEY}" > /dev/null 2>&1; then
    echo "✅ Supabase local accessible"
    
    # Test tables
    if curl -s "${LOCAL_URL}/rest/v1/tasks?limit=1" -H "apikey: ${LOCAL_ANON_KEY}" | grep -q '\[\]' 2>/dev/null; then
        echo "✅ Table 'tasks' accessible localement"
    else
        echo "❌ Table 'tasks' non accessible localement"
    fi
    
    if curl -s "${LOCAL_URL}/rest/v1/projects?limit=1" -H "apikey: ${LOCAL_ANON_KEY}" | grep -q '\[\]' 2>/dev/null; then
        echo "✅ Table 'projects' accessible localement"
    else
        echo "❌ Table 'projects' non accessible localement"
    fi
else
    echo "❌ Supabase local non accessible (assurez-vous qu'il tourne avec 'supabase start')"
fi

# Test production
echo
echo "🔍 Test Supabase Production..."
if curl -s -f "${PROD_URL}/rest/v1/" --max-time 10 > /dev/null 2>&1; then
    echo "✅ Supabase production accessible"
    
    # Test tables production avec vraies clés
    if curl -s "${PROD_URL}/rest/v1/projects?limit=1" -H "apikey: ${PROD_ANON_KEY}" -H "Authorization: Bearer ${PROD_ANON_KEY}" --max-time 10 | grep -q '\[\]' 2>/dev/null; then
        echo "✅ Table 'projects' accessible en production"
    else
        echo "❌ Table 'projects' non accessible en production"
    fi
    
    if curl -s "${PROD_URL}/rest/v1/tasks?limit=1" -H "apikey: ${PROD_ANON_KEY}" -H "Authorization: Bearer ${PROD_ANON_KEY}" --max-time 10 | grep -q '\[\]' 2>/dev/null; then
        echo "✅ Table 'tasks' accessible en production"
    else
        echo "❌ Table 'tasks' non accessible en production"
    fi
else
    echo "❌ Supabase production non accessible"
    echo "   Vérifiez que Supabase est installé sur le VPS et que le domaine est configuré"
fi

# Test connexion base locale
echo
echo "🔍 Test connexion PostgreSQL locale..."
if supabase status --local | grep -q "DB URL" 2>/dev/null; then
    echo "✅ Base de données locale accessible"
    
    # Afficher les tables
    echo "📋 Tables existantes :"
    supabase db dump --local --data-only --schema public | grep -E "^(CREATE TABLE|INSERT INTO)" | head -10
else
    echo "❌ Base de données locale non accessible"
fi

echo
echo "📝 Prochaines étapes :"
echo "1. Si local OK : Continuer avec le déploiement"
echo "2. Si local KO : Lancer 'supabase start'"
echo "3. Si prod KO : Vérifier l'installation Supabase sur le VPS"
echo "4. Configurer .env.production avec les vraies clés"