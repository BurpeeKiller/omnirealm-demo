#!/bin/bash

echo "🧹 Nettoyage des fichiers de test Fitness Reminder"
echo "=================================================="

# Supprimer les fichiers de test
rm -f fitness-ci-test.js
rm -f fitness-page-content.html
rm -f fitness-test-results.json
rm -f manifest.json
rm -f test-fitness-reminder.js
rm -f test-fitness-manual.sh

# Supprimer le dossier de résultats (s'il existe)
rm -rf fitness-reminder-test-results/

echo "✅ Nettoyage terminé"
echo ""
echo "📋 Rapport conservé : fitness-reminder-test-report.md"
echo "   (rapport détaillé à garder pour référence)"