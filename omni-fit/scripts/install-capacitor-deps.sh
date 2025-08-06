#!/bin/bash

echo "📱 Installation des dépendances Capacitor pour Fitness Reminder..."

# Capacitor Core
pnpm add @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Plugins essentiels
pnpm add @capacitor/local-notifications @capacitor/app @capacitor/haptics @capacitor/status-bar @capacitor/splash-screen

# Sync Capacitor
npx cap sync

echo "✅ Dépendances Capacitor installées!"
echo "🔧 Pour tester sur Android: pnpm run cap:run:android"
echo "🔧 Pour tester sur iOS: pnpm run cap:run:ios"