#!/bin/bash

# Script pour générer les icônes PWA à partir du SVG
# Nécessite ImageMagick (convert) ou Inkscape

echo "🎨 Génération des icônes OmniFit..."

# Créer le dossier temporaire
mkdir -p public/icons-temp

# Si ImageMagick est installé
if command -v convert &> /dev/null; then
    echo "Utilisation d'ImageMagick..."
    convert -background transparent public/favicon.svg -resize 192x192 public/icon-192.png
    convert -background transparent public/favicon.svg -resize 512x512 public/icon-512.png
    echo "✅ Icônes générées avec ImageMagick"
    
# Si Inkscape est installé
elif command -v inkscape &> /dev/null; then
    echo "Utilisation d'Inkscape..."
    inkscape public/favicon.svg --export-png=public/icon-192.png --export-width=192 --export-height=192
    inkscape public/favicon.svg --export-png=public/icon-512.png --export-width=512 --export-height=512
    echo "✅ Icônes générées avec Inkscape"
    
# Sinon, créer des placeholders avec HTML/CSS
else
    echo "⚠️  Ni ImageMagick ni Inkscape trouvés."
    echo "Les icônes PNG devront être générées manuellement."
    echo ""
    echo "Pour installer ImageMagick:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  MacOS: brew install imagemagick"
    echo ""
    echo "Pour installer Inkscape:"
    echo "  Ubuntu/Debian: sudo apt-get install inkscape"
    echo "  MacOS: brew install inkscape"
fi

echo "📋 Icônes requises:"
echo "  - icon-192.png (192x192px)"
echo "  - icon-512.png (512x512px)"