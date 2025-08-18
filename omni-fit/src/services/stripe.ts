import { supabase } from './auth/auth.service';

export interface StripeService {
  createCheckoutSession: (plan: 'monthly' | 'yearly') => Promise<{ url: string }>;
  verifySubscription: () => Promise<{ isPremium: boolean; plan: string }>;
}

class StripeServiceImpl implements StripeService {
  private readonly FUNCTION_URLS = {
    createCheckout: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
    verifySubscription: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-subscription`,
  };

  // Prix Stripe configurés dans .env
  private readonly PRICES = {
    monthly: import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY || 'price_xxx',
    yearly: import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY || 'price_yyy',
  };

  async createCheckoutSession(plan: 'monthly' | 'yearly'): Promise<{ url: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(this.FUNCTION_URLS.createCheckout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId: this.PRICES[plan],
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/dashboard?payment=cancelled`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (!url) {
        throw new Error('No checkout URL returned');
      }

      // Rediriger vers Stripe Checkout
      window.location.href = url;
      
      return { url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async verifySubscription(): Promise<{ isPremium: boolean; plan: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { isPremium: false, plan: 'free' };
      }

      const response = await fetch(this.FUNCTION_URLS.verifySubscription, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to verify subscription');
        return { isPremium: false, plan: 'free' };
      }

      const data = await response.json();
      
      return {
        isPremium: data.isPremium || false,
        plan: data.plan || 'free',
      };
    } catch (error) {
      console.error('Error verifying subscription:', error);
      return { isPremium: false, plan: 'free' };
    }
  }

  // Méthode utilitaire pour gérer le portail client Stripe
  async openCustomerPortal(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Cette fonction nécessite une Edge Function supplémentaire
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeServiceImpl();