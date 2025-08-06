// Service API pour communiquer avec le backend OmniFit

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Helper pour les requêtes
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: (error as Error).message };
    }
  }

  // Créer une session de checkout Stripe
  async createCheckoutSession(priceId: string, userEmail?: string) {
    return this.request<{ url: string; session_id: string }>(
      '/api/create-checkout-session',
      {
        method: 'POST',
        body: JSON.stringify({
          price_id: priceId,
          user_email: userEmail,
        }),
      }
    );
  }

  // Créer une session du portail client
  async createPortalSession(customerId: string) {
    return this.request<{ url: string }>(
      '/api/create-portal-session',
      {
        method: 'POST',
        body: JSON.stringify({
          customer_id: customerId,
        }),
      }
    );
  }

  // Récupérer le statut d'abonnement
  async getSubscriptionStatus(customerId: string) {
    return this.request<{
      active: boolean;
      plan?: string;
      current_period_end?: number;
      cancel_at_period_end?: boolean;
    }>(`/api/subscription/${customerId}`);
  }

  // Vérifier la santé de l'API
  async healthCheck() {
    return this.request<{ message: string; status: string }>('/');
  }
}

// Export de l'instance unique
export const apiService = new ApiService();