# TODO - OmniTask

📅 **Date** : 2025-01-28
🚀 **Version** : 3.0.0
✅ **Progression** : 60% du MVP

## 🎯 Fonctionnalités Complétées

### ✅ Interface Utilisateur
- [x] Design moderne avec Tailwind CSS et Radix UI
- [x] Logo personnalisé avec animations
- [x] Kanban board drag & drop fonctionnel
- [x] Formulaires de création/édition de tâches
- [x] Notifications toast
- [x] Footer et pages légales
- [x] Responsive design

### ✅ Gestion des Tâches
- [x] CRUD complet (Create, Read, Update, Delete)
- [x] Drag & drop entre colonnes
- [x] Filtrage par statut
- [x] Données de test

### ✅ Authentification & Backend
- [x] Pages login/register
- [x] Intégration Supabase
- [x] Middleware de protection des routes
- [x] Schéma de base de données complet
- [x] API avec mapping correct des champs

## 📋 Tâches Restantes pour MVP

### 🔴 Priorité HAUTE (Bloquant pour production)

#### 1. **Fix Authentification Production** (2-4h)
- [ ] Configurer Supabase self-hosted sur VPS
- [ ] Variables d'environnement production
- [ ] Tester flow complet auth en prod
- [ ] Gérer les erreurs d'auth proprement

#### 2. **Gestion Multi-Projets** (4-6h)
- [ ] Créer page de gestion des projets
- [ ] Modal création/édition de projet
- [ ] Sélecteur de projet dans header
- [ ] Filtrage des tâches par projet
- [ ] API endpoints projets

#### 3. **Tests & Qualité** (6-8h)
- [ ] Tests unitaires composants critiques
- [ ] Tests d'intégration auth
- [ ] Tests E2E flow principal
- [ ] Coverage minimum 70%

### 🟡 Priorité MOYENNE (Important mais non bloquant)

#### 4. **Pages Manquantes** (3-4h)
- [ ] Page tarifs avec plans (Free/Pro/Team)
- [ ] Page features détaillée
- [ ] Page aide/FAQ
- [ ] Page contact

#### 5. **Fonctionnalités IA** (8-12h)
- [ ] Intégration Claude API
- [ ] Suggestions de tâches intelligentes
- [ ] Priorisation automatique
- [ ] Estimation de temps IA
- [ ] Génération de sous-tâches

#### 6. **Dashboard Analytique** (4-6h)
- [ ] Vue d'ensemble des projets
- [ ] Graphiques de progression
- [ ] Métriques de productivité
- [ ] Export de rapports

### 🟢 Priorité BASSE (Nice to have)

#### 7. **Mode Sombre** (2-3h)
- [ ] Toggle dans header
- [ ] Persistance préférence
- [ ] Variables CSS dark mode
- [ ] Transitions smooth

#### 8. **Améliorations UX** (4-6h)
- [ ] Raccourcis clavier
- [ ] Bulk actions (sélection multiple)
- [ ] Templates de tâches
- [ ] Vue calendrier
- [ ] Vue liste

#### 9. **Intégrations** (6-8h)
- [ ] Webhooks Slack/Discord
- [ ] Export Google Calendar
- [ ] API publique
- [ ] Zapier/Make.com

#### 10. **Nettoyage Final** (3-4h)
- [ ] Supprimer fichiers inutiles (test-auth, exemples)
- [ ] Nettoyer imports non utilisés
- [ ] Supprimer console.log de debug
- [ ] Optimiser les bundles (tree-shaking)
- [ ] Vérifier tous les TODO/FIXME dans le code
- [ ] Supprimer dépendances non utilisées
- [ ] Documenter les choix techniques
- [ ] Créer CHANGELOG.md

## 🚀 Déploiement Production

### Prérequis
- [ ] Supabase configuré sur VPS
- [ ] Domaine task.omnirealm.tech pointé
- [ ] SSL/HTTPS configuré
- [ ] Variables d'environnement prod

### Étapes Déploiement
1. [ ] Build production : `pnpm run build`
2. [ ] Tests finaux : `pnpm run test:e2e`
3. [ ] Push sur GitHub
4. [ ] Deploy via Coolify
5. [ ] Smoke tests production

## 📊 Estimation Temps Total

- **MVP Minimal** : 15-20h (Auth + Multi-projets + Tests)
- **MVP Complet** : 35-45h (+ IA + Pages + Dashboard)
- **Version Premium** : 50-60h (+ Dark mode + UX + Intégrations)
- **Version Finale** : 55-65h (+ Nettoyage code + Documentation)

## 🎯 Prochaines Sessions Recommandées

1. **Session 1** : Fix auth production + Supabase VPS (3-4h)
2. **Session 2** : Gestion multi-projets complète (4-6h)
3. **Session 3** : Pages manquantes + Tests (6-8h)
4. **Session 4** : Fonctionnalités IA basiques (4-6h)
5. **Session 5** : Déploiement production final (2-3h)
6. **Session 6** : Nettoyage code + Optimisations finales (3-4h)

## 💡 Notes Techniques

### Configuration Supabase Production
```bash
# Sur le VPS
cd /home/omnirealm/supabase
docker-compose up -d
# Créer namespace "omnitask"
# Appliquer migrations
```

### Variables Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://supabase.omnirealm.tech
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PROD_KEY]
NEXT_PUBLIC_APP_URL=https://task.omnirealm.tech
```

### Commandes Utiles
```bash
# Dev
pnpm run dev

# Build & Test
pnpm run build
pnpm run test

# Deploy
./deploy-to-coolify.sh omni-task production
```

## 🐛 Bugs Connus

1. **Redirection après login** : Fonctionne mais avec délai
2. **Scroll mobile** : Parfois bloqué sur petits écrans
3. **Performance** : Cache Next.js trop gros (335MB)
4. **Code à nettoyer** : 
   - Page `/test-auth` à supprimer après tests
   - Console.log de debug dans login/page.tsx
   - Imports inutilisés dans plusieurs fichiers
   - Données de test en dur dans task-store.ts

## 📝 Décisions Architecture

- **Supabase SSR** : Utilisation de @supabase/ssr au lieu de auth-helpers (déprécié)
- **Monorepo** : Partage des composants via @omnirealm/ui
- **State** : Zustand avec immer pour simplicité
- **Styling** : Tailwind CSS + Radix UI (pas de Shadcn)

---

💡 **Pour reprendre** : Commencer par fix auth production + test sur VPS