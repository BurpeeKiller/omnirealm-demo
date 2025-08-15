// Lazy loading wrapper for subscription service
export const loadSubscriptionService = () => import('./subscription').then(module => module.subscriptionService);

// Type-safe wrapper functions
export const subscriptionServiceLazy = {
  async isPremium(): Promise<boolean> {
    const service = await loadSubscriptionService();
    return service.isPremium();
  },
  
  async redirectToCheckout(priceId: string): Promise<void> {
    const service = await loadSubscriptionService();
    return service.redirectToCheckout(priceId);
  },
  
  async redirectToCustomerPortal(): Promise<void> {
    const service = await loadSubscriptionService();
    return service.redirectToCustomerPortal();
  },
  
  async startFreeTrial(): Promise<void> {
    const service = await loadSubscriptionService();
    return service.startFreeTrial();
  },
  
  async getSubscriptionStatus() {
    const service = await loadSubscriptionService();
    return service.getSubscriptionStatus();
  },
  
  async getTrialDaysRemaining(): Promise<number> {
    const service = await loadSubscriptionService();
    return service.getTrialDaysRemaining();
  }
};