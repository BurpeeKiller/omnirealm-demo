import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createCheckoutSession, checkSubscription } from '../api-simple';

// Clé publique Stripe (à remplacer en production)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

export const stripeService = {
  // Initialiser Stripe
  getStripe: () => {
    if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
  },

  // Créer une session de checkout
  createCheckoutSession: async () => {
    try {
      const response = await createCheckoutSession();
      
      if (response.url) {
        // Mode production avec Stripe
        window.location.href = response.url;
      } else if (response.message) {
        // Mode demo
        console.warn('Mode demo:', response.message);
        return { error: 'Mode demo - Stripe non configuré' };
      }
      
      return response;
    } catch (error) {
      console.error('Erreur création checkout:', error);
      return { error: 'Erreur lors de la création du paiement' };
    }
  },

  // Vérifier le statut d'abonnement
  checkSubscription: async () => {
    try {
      const response = await checkSubscription();
      return response;
    } catch (error) {
      console.error('Erreur vérification abonnement:', error);
      return {
        is_pro: false,
        scans_used: 0,
        scans_limit: 3,
        scans_remaining: 3,
        reason: 'error'
      };
    }
  },

  // Gérer le retour de paiement
  handlePaymentReturn: async (sessionId?: string) => {
    if (sessionId) {
      // Vérifier le statut du paiement
      const subscription = await stripeService.checkSubscription();
      return subscription.is_pro;
    }
    return false;
  }
};