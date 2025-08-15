# OmniFit - Coach Fitness IA Premium 💪🤖

[![Status](https://img.shields.io/badge/status-production-green.svg)](https://fit.omnirealm.tech)
[![Score](https://img.shields.io/badge/audit%20score-82%25-brightgreen.svg)](./AUDIT-STATUS-2025-08-09.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Coach fitness IA personnel avec programmes adaptés, suivi intelligent et motivation personnalisée.

🌐 **Production** : https://fit.omnirealm.tech

## ✨ Fonctionnalités Principales

### 🏃‍♂️ Entraînement Intelligent
- **3 exercices fondamentaux** : Burpees, Pompes, Squats
- **Coach IA intégré** : Conseils personnalisés selon vos performances
- **Rappels programmables** : Notifications intelligentes avec plage horaire
- **Mode hors-ligne** : Fonctionne sans connexion internet

### 📊 Suivi & Analytics
- **Statistiques détaillées** : Journalières, hebdomadaires, mensuelles
- **Graphiques interactifs** : Visualisation de votre progression
- **Export des données** : Format CSV pour analyse externe
- **Historique illimité** : Toutes vos séances sauvegardées

### 🎯 Expérience Premium
- **PWA installable** : Application native sur mobile/desktop
- **Mode sombre** : Interface adaptée jour/nuit
- **Animations fluides** : Feedback visuel immersif
- **Sons personnalisables** : Notifications audio motivantes

## 🚀 Quick Start

```bash
# Installation
cd dev/apps/omni-fit
pnpm install

# Développement
pnpm run dev          # http://localhost:3003

# Production
pnpm run build        # Build optimisé
pnpm run preview      # Test du build

# Tests
pnpm run test         # Tests unitaires
pnpm run test:coverage # Couverture
```

## 🛠️ Stack Technique

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | React 18, TypeScript 5.8, Vite 6 |
| **UI/UX** | Tailwind CSS, Framer Motion, Radix UI |
| **State** | Zustand 4.5 (persist middleware) |
| **Data** | IndexedDB (Dexie 3.2), LocalStorage |
| **Charts** | Chart.js 4.4, React-ChartJS-2 |
| **PWA** | Workbox 7, Service Workers |
| **Paiement** | Stripe (checkout intégré) |

## 📁 Structure du Projet

```
src/
├── components/       # Composants React
│   ├── Dashboard/   # Tableau de bord principal
│   ├── Settings/    # Configuration utilisateur
│   ├── Stats/       # Statistiques et graphiques
│   └── Landing/     # Page d'accueil
├── stores/          # State management (Zustand)
├── services/        # Services métier
├── hooks/           # Hooks React personnalisés
├── utils/           # Utilitaires
└── types/           # Types TypeScript
```

## 🔧 Configuration

### Variables d'Environnement

```env
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_LEMONSQUEEZY_STORE_ID=your_store_id
```

### Ports

- **Développement** : 3003
- **Production** : 3003 (nginx)

## 📱 PWA Installation

### Mobile
1. Ouvrir https://fit.omnirealm.tech dans Chrome/Safari
2. Menu → "Ajouter à l'écran d'accueil"
3. Confirmer l'installation

### Desktop
1. Ouvrir dans Chrome/Edge
2. Icône d'installation dans la barre d'adresse
3. Suivre les instructions

## 🧪 Tests

```bash
# Tests unitaires
pnpm run test

# Couverture (objectif : 80%)
pnpm run test:coverage

# Tests E2E (Playwright)
pnpm run test:e2e
```

**Note** : Tests actuellement bloqués par incompatibilité esbuild/TextEncoder (Vitest 3.2.4)

## 🚀 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées.

## 📈 Performances

- **Bundle size** : 23KB (gzip) - Optimisé avec code splitting
- **Lighthouse** : 95+ sur toutes les métriques
- **Offline** : 100% fonctionnel sans connexion
- **Loading** : < 1s sur 3G

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'feat: Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 License

MIT © 2025 OmniRealm

---

**Liens utiles** :
- [Documentation Architecture](./ARCHITECTURE.md)
- [Guide de Déploiement](./DEPLOYMENT.md)
- [Rapport d'Audit](./AUDIT-STATUS-2025-08-09.md)
- [Roadmap](./ROADMAP.md)