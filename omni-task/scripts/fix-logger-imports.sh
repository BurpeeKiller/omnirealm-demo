#!/bin/bash

# Script pour corriger les imports de logger

echo "🔄 Correction des imports de logger..."

# Remplacer les imports de logger par createLogger
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -not -path "./.next/*" | while read file; do
  # Si le fichier importe logger, le remplacer par un import de createLogger et créer une instance
  if grep -q "import { logger } from '@/lib/logger'" "$file"; then
    # Remplacer l'import
    sed -i "s/import { logger } from '@\/lib\/logger'/import { createLogger } from '@\/lib\/logger'/" "$file"
    
    # Ajouter la création du logger après l'import
    sed -i "/import { createLogger } from '@\/lib\/logger'/a\\
const logger = createLogger('${file##*/}');" "$file"
  fi
done

echo "✅ Correction des imports terminée!"