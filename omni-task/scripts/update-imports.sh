#!/bin/bash

# Script pour mettre à jour les imports @omnirealm vers les imports locaux

echo "🔄 Mise à jour des imports dans OmniTask..."

# Remplacer les imports @omnirealm/ui
echo "📦 Remplacement des imports @omnirealm/ui..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  # Button, Card, Input, Label, Textarea, Badge
  sed -i 's|from "@omnirealm/ui"|from "@/components/ui"|g' "$file"
  sed -i 's|from '\''@omnirealm/ui'\''|from '\''@/components/ui'\''|g' "$file"
done

# Remplacer les imports @omnirealm/logger
echo "📝 Remplacement des imports @omnirealm/logger..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  sed -i 's|from "@omnirealm/logger"|from "@/lib/logger"|g' "$file"
  sed -i 's|from '\''@omnirealm/logger'\''|from '\''@/lib/logger'\''|g' "$file"
done

# Supprimer les imports non utilisés
echo "🧹 Suppression des imports non utilisés..."
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  # Supprimer les imports de config, utils, supabase-kit
  sed -i '/^import.*from.*@omnirealm\/config/d' "$file"
  sed -i '/^import.*from.*@omnirealm\/utils/d' "$file"
  sed -i '/^import.*from.*@omnirealm\/supabase-kit/d' "$file"
done

echo "✅ Mise à jour des imports terminée!"