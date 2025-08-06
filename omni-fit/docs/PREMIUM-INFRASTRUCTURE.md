# 🎯 Infrastructure Premium OmniFit

## 📋 Vue d'ensemble

L'infrastructure Premium d'OmniFit permet de monétiser l'application avec un modèle d'abonnement à 29€/mois, offrant un coach IA personnalisé et des fonctionnalités avancées.

## 🏗️ Architecture

### Services créés

1. **`subscription.ts`** - Gestion des abonnements
   - Interface avec Stripe pour les paiements
   - Gestion des statuts (free, trial, premium)
   - Plans de tarification (mensuel/annuel)
   - Méthodes pour checkout et portail client

2. **`useSubscription.ts`** - Hook React personnalisé
   - État réactif de l'abonnement
   - Méthodes simplifiées pour les composants
   - Intégration avec analytics
   - Gestion de la période d'essai

### Composants UI

1. **`UpgradePrompt.tsx`** - Modal de souscription
   - Design premium avec animations
   - Plans tarifaires avec économie annuelle
   - Bouton d'essai gratuit 7 jours
   - Intégration Stripe Checkout

2. **`PremiumBadge.tsx`** - Badge visuel
   - Affiché dans le header pour les utilisateurs premium
   - Animation et gradient premium
   - Indicateur période d'essai

3. **`SubscriptionManager.tsx`** - Gestion abonnement
   - Affiche le statut actuel
   - Date de renouvellement
   - Bouton vers portail Stripe
   - Alertes (paiement en retard, annulation)

## 💳 Configuration Stripe

### Variables d'environnement requises

```bash
# .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
VITE_STRIPE_PRICE_ID_MONTHLY=price_xxx
VITE_STRIPE_PRICE_ID_YEARLY=price_xxx
```

### Produits Stripe à créer

1. **OmniFit Premium Mensuel**
   - Prix : 29€/mois
   - ID : price_monthly_xxx

2. **OmniFit Premium Annuel**
   - Prix : 290€/an (2 mois offerts)
   - ID : price_yearly_xxx

### Webhooks à configurer

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## 🔄 Flux utilisateur

### 1. Découverte Premium
- Bouton Premium dans la navigation
- Badge dans le header si premium actif
- CTAs dans l'interface pour features premium

### 2. Souscription
1. Clic sur "Premium" → Modal upgrade
2. Choix du plan (mensuel/annuel)
3. Redirection vers Stripe Checkout
4. Paiement sécurisé
5. Retour sur l'app avec statut premium

### 3. Gestion abonnement
- Onglet "Premium" dans Paramètres
- Voir statut et date renouvellement
- Accès au portail Stripe pour :
  - Changer de plan
  - Mettre à jour le paiement
  - Annuler l'abonnement

## 🧪 Mode test

Pour tester sans API backend :

```javascript
// Dans la console du navigateur
subscriptionService.mockPremiumSubscription()
// ou
subscriptionService.startFreeTrial()
```

## 📊 Analytics intégrées

Events automatiques :
- `trial_started` - Début période d'essai
- `checkout_started` - Ouverture Stripe Checkout
- `subscription_completed` - Abonnement réussi
- `portal_opened` - Accès portail client

## 🔒 Sécurité

- Aucune info de paiement stockée localement
- Stripe gère toute la sécurité PCI
- Webhooks sécurisés avec signature
- État d'abonnement dans localStorage (non sensible)

## 🚀 Prochaines étapes

1. **Backend API** (non implémenté)
   - Endpoints pour Stripe webhooks
   - Validation côté serveur
   - Synchronisation état abonnement

2. **Features Premium**
   - Service Coach AI
   - Programmes personnalisés
   - Analytics avancées
   - Thèmes premium

3. **Optimisations**
   - A/B testing prix
   - Onboarding premium
   - Rétention emails

## 📝 Checklist déploiement

- [ ] Créer compte Stripe
- [ ] Configurer produits et prix
- [ ] Ajouter variables d'environnement
- [ ] Déployer backend API
- [ ] Configurer webhooks Stripe
- [ ] Tester parcours complet
- [ ] Activer mode production Stripe

---

*Infrastructure Premium v1.0 - Ready for monetization* 🚀