# 🚀 OmniTask - Gestion de tâches IA-augmentée

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/omnirealm/omni-task)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green.svg)](https://supabase.com/)

## 🎯 Vue d'ensemble

OmniTask est une application de gestion de tâches moderne avec interface Kanban, créée avec Next.js 14.2.30 et optimisée pour la performance. **État actuel : 60% du MVP complété**.

## ⚡ Performance optimisée

**Problème résolu** : Lenteur extrême du monorepo (1.1GB RAM, 15s démarrage)
**Solution** : Turbopack + isolation = **600MB RAM, 2.3s démarrage** 🚀

## ✨ Fonctionnalités

### Complétées ✅
- **Tableau Kanban** avec drag & drop fluide (@hello-pangea/dnd)
- **Modal création/édition** de tâches complète
- **Authentification** login/register/logout avec Supabase
- **Priorités et deadlines** avec indicateurs visuels
- **Tags et catégories** pour organisation avancée
- **Design moderne** avec logo animé et UI harmonieuse
- **Notifications toast** pour feedback utilisateur

### En cours 🚧
- **Gestion multi-projets** avec sélecteur dynamique
- **Persistance Supabase** pour production
- **Tests unitaires** et d'intégration

### À venir 📝
- **Mode sombre** adaptatif avec persistance
- **IA Assistant** pour priorisation (Claude API)
- **Analytics dashboard** avec graphiques
- **Pages tarifs/features** pour monétisation
- **Intégrations** Slack, Calendar, Zapier

## 🛠️ Stack technique

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: @omnirealm/ui (Radix UI), Tailwind CSS
- **État**: Zustand + Immer
- **Base de données**: Supabase (PostgreSQL)
- **Drag & Drop**: @hello-pangea/dnd
- **Validation**: Zod

## 🚀 Démarrage rapide

### Installation

```bash
# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# 🎯 RECOMMANDÉ : Démarrage ultra-rapide avec Turbopack
./start-turbo.sh
# ou
pnpm run dev:turbo

# Alternative : démarrage standard
pnpm dev
```

### Performance selon la méthode

| Méthode | Temps démarrage | RAM | Hot reload |
|---------|----------------|-----|------------|
| Standard | 10-15s | 1.1GB | 2-5s |
| Turbopack | **2.3s** ✨ | **600MB** | **<500ms** |

## 🔧 Configuration

### 1. Variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321  # ou votre URL production
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Base de données

```bash
# Avec Supabase CLI
supabase start
supabase db push

# Appliquer les migrations
supabase migration up

# Optionnel : données de test
psql -h localhost -p 54322 -U postgres -d postgres < supabase/seed.sql
```

## 📁 Structure

```
omni-task/
├── app/              # Routes Next.js 14
├── components/       # Composants React
│   └── kanban/      # Composants Kanban
├── lib/             # Logique métier
│   ├── api/         # Clients API
│   ├── store/       # Stores Zustand
│   └── types/       # Types TypeScript
└── public/          # Assets statiques
```

## 🧪 Tests

```bash
pnpm test              # Tests unitaires
pnpm test:coverage     # Couverture
pnpm run type-check    # Vérification types
```

## 📊 Score RICE+

- **Reach**: 1000 utilisateurs/mois
- **Impact**: High (3/3)
- **Confidence**: 90%
- **Effort**: 2 semaines
- **Score**: 88/100

## 🎯 Roadmap

### Phase 1 : MVP (60% complété) ✅
- [x] Structure de base avec monorepo
- [x] Kanban fonctionnel avec drag & drop
- [x] Modal création/édition de tâches
- [x] Authentification login/register
- [x] Intégration Supabase
- [x] Design UI/UX moderne
- [x] Optimisation performance (Turbopack)

### Phase 2 : Production Ready 🚧
- [ ] Fix auth production sur VPS
- [ ] Gestion multi-projets complète
- [ ] Tests (unité, intégration, E2E)
- [ ] Pages tarifs/features/aide
- [ ] Déploiement Coolify

### Phase 3 : Premium Features 📝
- [ ] Intégration IA Claude pour suggestions
- [ ] Analytics dashboard avancé
- [ ] Mode sombre avec animations
- [ ] Webhooks et intégrations
- [ ] API publique
- [ ] Version mobile PWA

## 💰 Modèle économique

- **Free**: 3 projets, 100 tâches
- **Pro**: 99€/mois - Illimité + IA + Analytics
- **Team**: 299€/mois - Collaboration + API

## 🏗️ Architecture

### Stack technique détaillée

- **Framework** : Next.js 14.2.30 avec App Router
- **Compilateur** : Turbopack (Rust) pour performances optimales
- **Styling** : Tailwind CSS + @omnirealm/ui (Radix UI centralisé)
- **State** : Zustand 5.0 avec middleware immer
- **Backend** : Supabase (PostgreSQL, Auth, Realtime)
- **Validation** : Zod pour schémas stricts
- **DnD** : @hello-pangea/dnd pour accessibilité
- **Auth** : @supabase/ssr pour SSR

### Optimisations monorepo

1. **Dépendances centralisées** : React, Next.js, TypeScript au niveau racine
2. **Composants partagés** : @omnirealm/ui pour tous les projets
3. **Configuration unifiée** : ESLint, TypeScript, Prettier partagés
4. **Cache optimisé** : Turbopack + .next/cache ignoré

## 🔧 Problèmes connus & Solutions

### 1. Mémoire excessive
- **Problème** : Cache Next.js peut atteindre 335MB
- **Solution** : `rm -rf .next/cache` ou `pnpm run clean`

### 2. TypeScript Server gourmand
- **Problème** : Jusqu'à 3GB de RAM
- **Solution** : `pkill -f tsserver` ou redémarrer VSCode

### 3. Port 3000 occupé
- **Solution** : L'app bascule automatiquement sur 3001

## 🚀 Déploiement Production

```bash
# Build optimisé
pnpm run build

# Variables production (Coolify)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.omnirealm.tech
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PROD_KEY]
NEXT_PUBLIC_APP_URL=https://task.omnirealm.tech

# Deploy
./deploy-to-coolify.sh omni-task production
```

## 📄 Documentation

- [TODO.md](./TODO.md) - Liste complète des tâches restantes
- [PERFORMANCE-GUIDE.md](./PERFORMANCE-GUIDE.md) - Guide d'optimisation
- [Architecture Supabase](./supabase/README.md) - Schéma de base de données

---

*Partie du système OmniRealm - Objectif 50K€ ARR*

---

**Dernière mise à jour** : 28 janvier 2025 | **Statut** : 60% MVP | **Prochaine session** : Fix auth production