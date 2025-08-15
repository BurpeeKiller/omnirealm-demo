#!/bin/bash

echo "🔄 Mise à jour des imports dans OmniScan..."

# Remplacer les imports @omnirealm/ui
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  sed -i 's|from "@omnirealm/ui"|from "@/components/ui"|g' "$file"
  sed -i "s|from '@omnirealm/ui'|from '@/components/ui'|g" "$file"
done

echo "✅ Imports mis à jour!"