#!/bin/bash

echo "🚀 Test manuel Fitness Reminder PWA"
echo "======================================="

URL="https://frolicking-stardust-cd010f.netlify.app"
echo "🌐 URL testée: $URL"

# Test 1: Accessibilité de base
echo ""
echo "📱 1. Test d'accessibilité de base"
echo "-----------------------------------"

response=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$response" = "200" ]; then
    echo "✅ Page accessible (HTTP $response)"
else
    echo "❌ Page non accessible (HTTP $response)"
    exit 1
fi

# Test 2: Temps de réponse
echo ""
echo "⏱️ 2. Test du temps de réponse"
echo "--------------------------------"

time_total=$(curl -s -o /dev/null -w "%{time_total}" "$URL")
time_ms=$(echo "$time_total * 1000" | bc -l)
echo "⏱️ Temps de réponse: ${time_ms%.*}ms"

if (( $(echo "$time_total < 3.0" | bc -l) )); then
    echo "✅ Temps de réponse acceptable (<3s)"
else
    echo "⚠️ Temps de réponse lent (>3s)"
fi

# Test 3: Contenu HTML de base
echo ""
echo "🔍 3. Test du contenu HTML"
echo "---------------------------"

html_content=$(curl -s "$URL")

# Vérifications basiques
if echo "$html_content" | grep -q "<!DOCTYPE html>"; then
    echo "✅ Document HTML5 valide"
else
    echo "❌ Pas de DOCTYPE HTML5"
fi

if echo "$html_content" | grep -q "<title>"; then
    title=$(echo "$html_content" | grep -o '<title[^>]*>[^<]*</title>' | sed 's/<[^>]*>//g')
    echo "✅ Titre trouvé: $title"
else
    echo "❌ Pas de titre"
fi

if echo "$html_content" | grep -q "viewport"; then
    echo "✅ Meta viewport présent (responsive)"
else
    echo "❌ Pas de meta viewport"
fi

# Test 4: Manifest PWA
echo ""
echo "📱 4. Test du manifest PWA"
echo "---------------------------"

manifest_response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/manifest.json")
if [ "$manifest_response" = "200" ]; then
    echo "✅ Manifest PWA accessible"
    
    # Télécharger et analyser le manifest
    manifest_content=$(curl -s "$URL/manifest.json")
    echo "📄 Contenu du manifest:"
    echo "$manifest_content" | python3 -m json.tool 2>/dev/null || echo "$manifest_content"
else
    echo "❌ Manifest PWA non accessible (HTTP $manifest_response)"
fi

# Test 5: Service Worker
echo ""
echo "⚙️ 5. Test du Service Worker"
echo "-----------------------------"

if echo "$html_content" | grep -q "serviceWorker"; then
    echo "✅ Service Worker détecté dans le HTML"
else
    echo "⚠️ Pas de référence Service Worker dans le HTML"
fi

sw_response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/sw.js")
if [ "$sw_response" = "200" ]; then
    echo "✅ Service Worker accessible (/sw.js)"
elif [ "$(curl -s -o /dev/null -w "%{http_code}" "$URL/service-worker.js")" = "200" ]; then
    echo "✅ Service Worker accessible (/service-worker.js)"
else
    echo "⚠️ Service Worker non trouvé"
fi

# Test 6: Ressources essentielles
echo ""
echo "📦 6. Test des ressources essentielles"
echo "---------------------------------------"

# Vérifier quelques ressources communes
resources=(
    "/favicon.ico"
    "/robots.txt"
    "/icon-192x192.png"
    "/icon-512x512.png"
)

for resource in "${resources[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$URL$resource")
    if [ "$status" = "200" ]; then
        echo "✅ $resource trouvé"
    else
        echo "⚠️ $resource non trouvé (HTTP $status)"
    fi
done

# Test 7: Analyse du contenu
echo ""
echo "🔍 7. Analyse du contenu de l'application"
echo "------------------------------------------"

# Rechercher des mots-clés liés au fitness
keywords=("fitness" "exercice" "burpees" "pompes" "squats" "workout" "stats" "dashboard")

echo "🔍 Mots-clés fitness détectés:"
for keyword in "${keywords[@]}"; do
    if echo "$html_content" | grep -qi "$keyword"; then
        echo "✅ '$keyword' trouvé"
    else
        echo "⚠️ '$keyword' non trouvé"
    fi
done

# Test 8: Headers de sécurité
echo ""
echo "🔐 8. Test des headers de sécurité"
echo "-----------------------------------"

headers=$(curl -s -I "$URL")

security_headers=(
    "Content-Security-Policy"
    "X-Frame-Options"
    "X-Content-Type-Options"
    "Referrer-Policy"
)

for header in "${security_headers[@]}"; do
    if echo "$headers" | grep -qi "$header"; then
        echo "✅ $header présent"
    else
        echo "⚠️ $header manquant"
    fi
done

echo ""
echo "======================================="
echo "✅ Tests terminés"
echo "======================================="