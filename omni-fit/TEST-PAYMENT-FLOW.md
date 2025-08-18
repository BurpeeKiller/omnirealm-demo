# Test du Flow de Paiement OmniFit

## Prérequis
1. Connexion avec compte Supabase
2. Clés Stripe configurées dans .env

## Flow de Test

### 1. Inscription / Connexion
- [ ] Cliquer sur "Connexion" en haut à droite
- [ ] Créer un compte ou se connecter
- [ ] Vérifier que l'utilisateur est bien connecté

### 2. Accès à Premium
**Option A - Depuis la nav bottom :**
- [ ] Cliquer sur "Premium" dans la nav bottom
- [ ] La modal UpgradePrompt doit s'afficher

**Option B - Depuis les exercices verrouillés :**
- [ ] Cliquer sur un exercice verrouillé (4e, 5e, 6e)
- [ ] La modal UpgradePrompt doit s'afficher

### 3. Sélection du Plan
- [ ] Vérifier l'affichage des 2 plans :
  - Plan Mensuel : 29€/mois
  - Plan Annuel : 290€/an (24€/mois)
- [ ] Bouton "Essayer gratuitement 7 jours" visible en bas

### 4. Process de Paiement
- [ ] Cliquer sur "Choisir Mensuel" ou "Économiser avec Annuel"
- [ ] Redirection vers Stripe Checkout
- [ ] URL format : `checkout.stripe.com/pay/cs_xxx`

### 5. Sur Stripe Checkout
- [ ] Remplir les infos de test :
  - Email : test@example.com
  - Carte : 4242 4242 4242 4242
  - Date : 12/34
  - CVC : 123
  - Code postal : 75001
- [ ] Cliquer sur "Payer"

### 6. Retour sur l'App
- [ ] Redirection vers `/dashboard?payment=success`
- [ ] Statut Premium activé
- [ ] Badge Premium visible dans le header
- [ ] Tous les exercices débloqués
- [ ] Coach AI accessible

### 7. Gestion de l'Abonnement
- [ ] Dans Settings > Premium
- [ ] Bouton "Gérer mon abonnement" 
- [ ] Redirection vers le portail Stripe

## Points de Vérification

### Flow Technique
1. **Authentication** : Session Supabase active
2. **Stripe Integration** : 
   - Edge Function `create-checkout-session` appelée
   - Token d'authentification transmis
   - Prix corrects envoyés
3. **Retour Callback** :
   - Paramètre `?payment=success` détecté
   - Statut mis à jour dans localStorage
   - Analytics trackées

### Erreurs Communes
- "User not authenticated" → Se reconnecter
- "Failed to create checkout" → Vérifier les clés Stripe
- Page blanche → Vérifier la console pour les erreurs

## Mode Test Local
Pour tester sans vrai paiement :
1. Utiliser le bouton "Essayer gratuitement 7 jours"
2. Ou dans la console : `subscriptionService.mockPremiumSubscription()`