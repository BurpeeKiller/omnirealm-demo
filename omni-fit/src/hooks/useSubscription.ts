import { useState, useEffect, useCallback } from 'react';
import { subscriptionService, SubscriptionStatus, PRICING_PLANS } from '@/services/subscription';
import { analytics } from '@/services/analytics';
import { logger } from '@/utils/logger';

export interface UseSubscriptionReturn {
  subscriptionStatus: SubscriptionStatus;
  isPremium: boolean;
  isInTrial: boolean;
  trialDaysRemaining: number;
  plans: typeof PRICING_PLANS;
  loading: boolean;
  startTrial: () => void;
  subscribeToPlan: (priceId: string) => Promise<void>;
  manageSubscription: () => Promise<void>;
  refreshStatus: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(
    subscriptionService.getSubscriptionStatus()
  );
  const [loading, setLoading] = useState(false);

  // Rafraîchir le statut d'abonnement
  const refreshStatus = useCallback(() => {
    const status = subscriptionService.getSubscriptionStatus();
    setSubscriptionStatus(status);
  }, []);

  // Écouter les changements de statut (ex: après retour de Stripe)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'omnifit_subscription') {
        refreshStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier si on revient de Stripe Checkout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('subscription') === 'success') {
      // Simuler un abonnement premium actif
      subscriptionService.mockPremiumSubscription();
      refreshStatus();
      
      // Tracker la conversion
      analytics.trackEvent('subscription_completed', {
        plan: 'premium',
        source: 'stripe_checkout'
      });
      
      // Nettoyer l'URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshStatus]);

  // Démarrer la période d'essai
  const startTrial = useCallback(() => {
    subscriptionService.startFreeTrial();
    refreshStatus();
    
    analytics.trackEvent('trial_started', {
      duration: '7_days'
    });
  }, [refreshStatus]);

  // S'abonner à un plan
  const subscribeToPlan = useCallback(async (priceId: string) => {
    setLoading(true);
    
    try {
      analytics.trackEvent('checkout_started', {
        price_id: priceId,
        plan: PRICING_PLANS.find(p => p.stripePriceId === priceId)?.name
      });
      
      await subscriptionService.redirectToCheckout(priceId);
    } catch (error) {
      logger.error('Erreur souscription:', error);
      analytics.trackEvent('checkout_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Gérer l'abonnement (portail Stripe)
  const manageSubscription = useCallback(async () => {
    setLoading(true);
    
    try {
      analytics.trackEvent('portal_opened');
      await subscriptionService.redirectToCustomerPortal();
    } catch (error) {
      logger.error('Erreur ouverture portail:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculer les valeurs dérivées
  const isPremium = subscriptionService.isPremium();
  const isInTrial = subscriptionService.isInTrial();
  const trialDaysRemaining = subscriptionService.getTrialDaysRemaining();

  return {
    subscriptionStatus,
    isPremium,
    isInTrial,
    trialDaysRemaining,
    plans: PRICING_PLANS,
    loading,
    startTrial,
    subscribeToPlan,
    manageSubscription,
    refreshStatus
  };
}