import { loadStripe, Stripe } from '@stripe/stripe-js';
import { apiService } from './api';
import { logger } from '@/utils/logger';
import { publicConfig } from '../lib/config';

// Types pour la gestion des abonnements
export interface SubscriptionStatus {
  type: 'free' | 'trial' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: Date;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

// Plans de tarification
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'premium_monthly',
    name: 'OmniFit Premium',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    stripePriceId: publicConfig.stripePriceIdMonthly,
    features: [
      '🤖 Coach IA personnalisé illimité',
      '📊 Programmes d\'entraînement sur mesure',
      '📈 Analytics avancées et insights',
      '🎯 Objectifs personnalisés avec suivi',
      '🏆 Challenges et badges exclusifs',
      '💬 Support prioritaire',
      '☁️ Synchronisation cloud sécurisée',
      '🎨 Thèmes et personnalisation avancée'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'OmniFit Premium Annuel',
    price: 290, // 2 mois gratuits
    currency: 'EUR',
    interval: 'year',
    stripePriceId: publicConfig.stripePriceIdYearly,
    features: [
      '🎁 2 mois offerts (économisez 58€)',
      '🤖 Coach IA personnalisé illimité',
      '📊 Programmes d\'entraînement sur mesure',
      '📈 Analytics avancées et insights',
      '🎯 Objectifs personnalisés avec suivi',
      '🏆 Challenges et badges exclusifs',
      '💬 Support prioritaire',
      '☁️ Synchronisation cloud sécurisée',
      '🎨 Thèmes et personnalisation avancée'
    ]
  }
];

// Service de gestion des abonnements
class SubscriptionService {
  private stripe: Stripe | null = null;
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    const publishableKey = publicConfig.stripePublishableKey;
    this.stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);
  }

  // Initialiser Stripe
  async initializeStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await this.stripePromise;
    }
    return this.stripe;
  }

  // Récupérer le statut d'abonnement depuis le localStorage
  getSubscriptionStatus(): SubscriptionStatus {
    const stored = localStorage.getItem('omnifit_subscription');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Convertir les dates string en objets Date
        if (data.currentPeriodEnd) {
          data.currentPeriodEnd = new Date(data.currentPeriodEnd);
        }
        if (data.trialEnd) {
          data.trialEnd = new Date(data.trialEnd);
        }
        return data;
      } catch (e) {
        logger.error('Erreur parsing subscription:', e);
      }
    }
    
    // Statut par défaut : gratuit
    return {
      type: 'free',
      status: 'active'
    };
  }

  // Sauvegarder le statut d'abonnement
  setSubscriptionStatus(status: SubscriptionStatus): void {
    localStorage.setItem('omnifit_subscription', JSON.stringify(status));
  }

  // Vérifier si l'utilisateur est premium
  isPremium(): boolean {
    const status = this.getSubscriptionStatus();
    return status.type === 'premium' && status.status === 'active';
  }

  // Vérifier si l'utilisateur est en période d'essai
  isInTrial(): boolean {
    const status = this.getSubscriptionStatus();
    
    // Si essai expiré, reset automatiquement
    if (status.type === 'trial' && status.trialEnd) {
      const now = new Date();
      if (now > status.trialEnd) {
        this.resetSubscription();
        return false;
      }
    }
    
    return status.type === 'trial' && status.status === 'trialing';
  }

  // Obtenir les jours restants de la période d'essai
  getTrialDaysRemaining(): number {
    const status = this.getSubscriptionStatus();
    if (status.type === 'trial' && status.trialEnd) {
      const now = new Date();
      const diff = status.trialEnd.getTime() - now.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return 0;
  }

  // Créer une session de checkout Stripe
  async createCheckoutSession(priceId: string): Promise<string | null> {
    try {
      const userEmail = localStorage.getItem('omnifit_user_email') || undefined;
      const result = await apiService.createCheckoutSession(priceId, userEmail);
      
      if (result.error) {
        logger.error('Erreur API:', result.error);
        return null;
      }
      
      return result.data?.session_id || null;
    } catch (error) {
      logger.error('Erreur création session checkout:', error);
      return null;
    }
  }

  // Rediriger vers Stripe Checkout via notre Edge Function
  async redirectToCheckout(priceId: string): Promise<void> {
    try {
      // Utiliser notre service Stripe avec Edge Functions
      const { stripeService } = await import('./stripe');
      
      // Déterminer le plan basé sur le priceId
      const plan = PRICING_PLANS.find(p => p.stripePriceId === priceId);
      if (!plan) {
        logger.error('Plan invalide pour priceId:', priceId);
        return;
      }
      
      // Créer la session et rediriger - géré automatiquement par le service
      await stripeService.createCheckoutSession(
        plan.interval === 'month' ? 'monthly' : 'yearly'
      );
    } catch (error) {
      logger.error('Erreur redirection checkout:', error);
      // Afficher une notification d'erreur à l'utilisateur
      const event = new CustomEvent('omnifit:error', {
        detail: { message: 'Impossible de lancer le paiement. Veuillez réessayer.' }
      });
      window.dispatchEvent(event);
    }
  }

  // Gérer le portail client Stripe (pour gérer l'abonnement)
  async redirectToCustomerPortal(): Promise<void> {
    try {
      // Utiliser notre service Stripe
      const { stripeService } = await import('./stripe');
      
      // Ouvrir le portail client - géré automatiquement par le service
      await stripeService.openCustomerPortal();
    } catch (error) {
      logger.error('Erreur ouverture portail client:', error);
      // Afficher une notification d'erreur
      const event = new CustomEvent('omnifit:error', {
        detail: { message: 'Impossible d\'accéder au portail. Veuillez réessayer.' }
      });
      window.dispatchEvent(event);
    }
  }

  // Activer la période d'essai gratuite (7 jours)
  startFreeTrial(): void {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    
    this.setSubscriptionStatus({
      type: 'trial',
      status: 'trialing',
      trialEnd
    });
  }

  // Simuler un abonnement premium (pour les tests)
  mockPremiumSubscription(): void {
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    
    this.setSubscriptionStatus({
      type: 'premium',
      status: 'active',
      currentPeriodEnd,
      cancelAtPeriodEnd: false
    });
  }

  // Réinitialiser l'abonnement (retour au gratuit)
  resetSubscription(): void {
    this.setSubscriptionStatus({
      type: 'free',
      status: 'active'
    });
  }
}

// Export de l'instance unique
export const subscriptionService = new SubscriptionService();