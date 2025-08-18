# Événements Webhook Stripe - OmniFit

## Événements configurés :

1. **checkout.session.completed** → Paiement initial réussi
2. **customer.subscription.created** → Nouvelle souscription créée
3. **customer.subscription.updated** → Changement de plan
4. **customer.subscription.deleted** → Annulation
5. **customer.subscription.paused** → Mise en pause
6. **customer.subscription.resumed** → Reprise après pause
7. **customer.subscription.pending_update_applied** → Changement appliqué
8. **customer.subscription.pending_update_expired** → Changement expiré
9. **customer.subscription.trial_will_end** → 3 jours avant fin d'essai

## Logique dans le code :

```typescript
// supabase/functions/handle-webhook/index.ts
switch(event.type) {
  case 'checkout.session.completed':
    // Activer l'abonnement premium
    break;
  case 'customer.subscription.deleted':
    // Désactiver l'abonnement
    break;
  // etc...
}
```