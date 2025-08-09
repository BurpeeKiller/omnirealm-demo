# OmniFit - Coach Fitness IA Premium 💪🤖 

> **Last Updated**: 2025-07-25

Coach fitness IA personnel avec programmes adaptés, suivi intelligent et motivation personnalisée.

## 🚀 Fonctionnalités

- **Horloge temps réel** toujours visible
- **Rappels programmables** avec plage horaire personnalisable
- **3 exercices** : Burpees, Pompes, Squats
- **Compteurs individuels** avec animations
- **Notifications** sonores et visuelles
- **Stats complètes** : journalières, hebdomadaires, historique illimité
- **Export CSV** des données
- **PWA** installable sur mobile et desktop

## 🛠️ Stack Technique

- React 18 + TypeScript
- Vite (build ultra-rapide)
- Tailwind CSS + Framer Motion
- Zustand (state management)
- Dexie (IndexedDB wrapper)
- Chart.js (graphiques)
- PWA avec Workbox

## 📦 Installation

```bash
cd dev/apps/12-omnifit
pnpm install
```

## 🔧 Développement

```bash
# Lancer en mode développement
pnpm run dev

# Build pour production
pnpm run build

# Preview du build
pnpm run preview
```

## 📱 Installation PWA #pwa

1. Ouvrir l'app dans Chrome/Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou via le menu → "Installer l'application"

## 🎯 Utilisation

### Configuration des rappels

1. Définir la plage horaire (ex: 9h-18h)
2. Choisir la fréquence (ex: toutes les 30 min)
3. Personnaliser le nombre d'exercices par rappel

### Enregistrer des exercices

- Cliquer sur la carte de l'exercice
- Le compteur s'incrémente automatiquement
- Son de confirmation + vibration

### Consulter les stats

- Onglet "Jour" : progression journalière
- Onglet "Semaine" : vue hebdomadaire
- Onglet "Historique" : stats complètes avec graphiques

## 🗄️ Structure des données

Les données sont stockées localement dans IndexedDB :

- **workouts** : Chaque série d'exercices
- **dailyStats** : Totaux journaliers
- **settings** : Préférences utilisateur

## 🔔 Permissions requises

- **Notifications** : Pour les rappels
- **Son** : Pour les alertes audio
- **Vibration** : Pour le feedback haptique (mobile)

## 📊 Roadmap v2

- [ ] Synchronisation cloud (Supabase)
- [ ] Mode challenge avec amis
- [ ] Intégration Apple Watch / Wear OS
- [ ] Plus d'exercices disponibles
- [ ] Thèmes personnalisables
- [ ] Widgets home screen

## 🐛 Debug #debug

```bash
# Vérifier les logs IndexedDB
localStorage.debug = 'dexie:*'

# Reset de la base de données
indexedDB.deleteDatabase('OmniFitDB')
```

## 📄 License

Propriétaire - OmniRealm © 2025

---

## 🏷️ Tags

#pnpm #pwa #fitness #mobile #debug #typescript #react #supabase #vite #tailwind
