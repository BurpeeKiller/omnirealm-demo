# 🏗️ Architecture et Flow OmniFit

## 📊 Vue d'ensemble

OmniFit utilise une architecture en 3 vues principales avec une logique métier claire :

```
Landing Page → Onboarding → Dashboard
     ↓              ↓           ↓
  Marketing    First Setup   Application
```

## 🔄 Flow utilisateur

### 1. **Première visite** (Landing Page)
- Présentation de l'app et ses bénéfices
- Choix entre :
  - Essai gratuit 7 jours (avec toutes les features)
  - Version gratuite (features limitées)
  - Voir les plans Premium

### 2. **Onboarding** (Premier setup)
- S'affiche uniquement à la première utilisation
- 3 étapes simples :
  1. Welcome + Privacy (fusionnés)
  2. Permissions (notifications)
  3. Premier exercice
- Peut être skip à tout moment

### 3. **Dashboard** (Application principale)
- Interface principale avec exercices
- Bandeau de statut (Gratuit/Trial/Premium)
- CTAs Premium contextuels si gratuit
- Navigation bottom avec logout

## 🎯 Logique métier Premium

### États utilisateur
1. **Visiteur** : Voit la landing page
2. **Utilisateur gratuit** : Dashboard avec features limitées
3. **Trial** : 7 jours avec toutes les features
4. **Premium** : Accès complet illimité

### Points de conversion
- Landing page : 2 CTAs principaux
- Dashboard : CTA contextuel si gratuit
- Navigation : Bouton Premium permanent
- Settings : Onglet dédié Premium

## 📁 Structure des composants

```
src/
├── components/
│   ├── Landing/
│   │   └── LandingPage.tsx      # Page marketing
│   ├── Dashboard/
│   │   └── Dashboard.tsx        # App principale
│   ├── Onboarding/
│   │   └── OnboardingFlow.tsx   # Setup initial
│   └── Premium/
│       ├── UpgradePrompt.tsx    # Modal souscription
│       ├── PremiumBadge.tsx     # Badge visuel
│       └── SubscriptionManager.tsx # Gestion abo
├── hooks/
│   ├── useAppState.ts           # Navigation & état
│   └── useSubscription.ts       # Gestion Premium
└── services/
    └── subscription.ts          # Logique métier

```

## 🔐 Données persistantes

### LocalStorage
- `omnifit_has_visited` : Flag première visite
- `omnifit_onboarding_completed` : Onboarding terminé
- `omnifit_subscription` : État abonnement
- Données exercices (Dexie/IndexedDB)

### Navigation intelligente
- Première visite → Landing
- Retour utilisateur → Dashboard (si onboarding fait)
- Retour Stripe → Dashboard avec statut premium

## 🚀 Points d'extension

### Pour ajouter l'authentification
1. Ajouter vue Login/Register
2. Modifier useAppState pour gérer auth
3. Sync subscription avec backend

### Pour le Coach AI
1. Créer service ai-coach.ts
2. Ajouter composants dans Dashboard
3. Restreindre selon isPremium

### Pour les programmes
1. Nouvelle vue Programs
2. Navigation depuis Dashboard
3. Logique Premium pour accès

## 📈 Métriques à tracker

- **Landing** : Taux de clic CTA (gratuit vs trial)
- **Onboarding** : Taux de complétion par étape
- **Dashboard** : Engagement quotidien
- **Premium** : Conversion trial → paid
- **Retention** : J1, J7, J30

---

Cette architecture permet une évolution progressive tout en gardant une UX simple et cohérente.