import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { subscriptionService, PRICING_PLANS } from '../subscription'

// Mock Stripe
const mockStripe = {
  redirectToCheckout: vi.fn()
}

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(mockStripe))
}))

// Mock API service
const mockApiService = {
  createCheckoutSession: vi.fn(),
  createPortalSession: vi.fn()
}

vi.mock('../api', () => ({
  apiService: mockApiService
}))

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}))

describe('SubscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock environment variables
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('subscription status management', () => {
    it('should return default free status when no data stored', () => {
      const status = subscriptionService.getSubscriptionStatus()
      
      expect(status).toEqual({
        type: 'free',
        status: 'active'
      })
    })

    it('should return stored subscription status', () => {
      const mockStatus = {
        type: 'premium',
        status: 'active',
        currentPeriodEnd: new Date('2024-12-31'),
        cancelAtPeriodEnd: false
      }
      
      localStorage.setItem('omnifit_subscription', JSON.stringify(mockStatus))
      
      const status = subscriptionService.getSubscriptionStatus()
      
      expect(status.type).toBe('premium')
      expect(status.status).toBe('active')
      expect(status.currentPeriodEnd).toBeInstanceOf(Date)
      expect(status.cancelAtPeriodEnd).toBe(false)
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('omnifit_subscription', 'invalid-json')
      
      const status = subscriptionService.getSubscriptionStatus()
      
      expect(status).toEqual({
        type: 'free',
        status: 'active'
      })
    })

    it('should save subscription status to localStorage', () => {
      const mockStatus = {
        type: 'premium' as const,
        status: 'active' as const,
        currentPeriodEnd: new Date('2024-12-31')
      }
      
      subscriptionService.setSubscriptionStatus(mockStatus)
      
      const stored = localStorage.getItem('omnifit_subscription')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.type).toBe('premium')
      expect(parsed.status).toBe('active')
    })
  })

  describe('subscription checks', () => {
    it('should identify premium user correctly', () => {
      const premiumStatus = {
        type: 'premium' as const,
        status: 'active' as const,
        currentPeriodEnd: new Date('2024-12-31')
      }
      
      subscriptionService.setSubscriptionStatus(premiumStatus)
      
      expect(subscriptionService.isPremium()).toBe(true)
    })

    it('should identify free user correctly', () => {
      const freeStatus = {
        type: 'free' as const,
        status: 'active' as const
      }
      
      subscriptionService.setSubscriptionStatus(freeStatus)
      
      expect(subscriptionService.isPremium()).toBe(false)
    })

    it('should identify trial user correctly', () => {
      const trialStatus = {
        type: 'trial' as const,
        status: 'trialing' as const,
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
      
      subscriptionService.setSubscriptionStatus(trialStatus)
      
      expect(subscriptionService.isInTrial()).toBe(true)
    })

    it('should calculate trial days remaining correctly', () => {
      const trialEnd = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      const trialStatus = {
        type: 'trial' as const,
        status: 'trialing' as const,
        trialEnd
      }
      
      subscriptionService.setSubscriptionStatus(trialStatus)
      
      const daysRemaining = subscriptionService.getTrialDaysRemaining()
      expect(daysRemaining).toBeGreaterThanOrEqual(4)
      expect(daysRemaining).toBeLessThanOrEqual(5)
    })

    it('should return 0 days remaining for expired trial', () => {
      const trialEnd = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      const trialStatus = {
        type: 'trial' as const,
        status: 'trialing' as const,
        trialEnd
      }
      
      subscriptionService.setSubscriptionStatus(trialStatus)
      
      const daysRemaining = subscriptionService.getTrialDaysRemaining()
      expect(daysRemaining).toBe(0)
    })
  })

  describe('checkout session creation', () => {
    it('should create checkout session successfully', async () => {
      const mockSessionId = 'cs_test_123'
      mockApiService.createCheckoutSession.mockResolvedValue({
        data: { session_id: mockSessionId },
        error: null
      })
      
      const sessionId = await subscriptionService.createCheckoutSession('price_monthly')
      
      expect(mockApiService.createCheckoutSession).toHaveBeenCalledWith(
        'price_monthly',
        undefined
      )
      expect(sessionId).toBe(mockSessionId)
    })

    it('should include user email when available', async () => {
      localStorage.setItem('omnifit_user_email', 'test@example.com')
      
      const mockSessionId = 'cs_test_123'
      mockApiService.createCheckoutSession.mockResolvedValue({
        data: { session_id: mockSessionId },
        error: null
      })
      
      await subscriptionService.createCheckoutSession('price_monthly')
      
      expect(mockApiService.createCheckoutSession).toHaveBeenCalledWith(
        'price_monthly',
        'test@example.com'
      )
    })

    it('should handle API error in checkout session creation', async () => {
      mockApiService.createCheckoutSession.mockResolvedValue({
        data: null,
        error: { message: 'Payment service unavailable' }
      })
      
      const sessionId = await subscriptionService.createCheckoutSession('price_monthly')
      
      expect(sessionId).toBeNull()
    })

    it('should handle network error in checkout session creation', async () => {
      mockApiService.createCheckoutSession.mockRejectedValue(new Error('Network error'))
      
      const sessionId = await subscriptionService.createCheckoutSession('price_monthly')
      
      expect(sessionId).toBeNull()
    })
  })

  describe('Stripe checkout redirection', () => {
    it('should redirect to Stripe checkout successfully', async () => {
      const mockSessionId = 'cs_test_123'
      mockApiService.createCheckoutSession.mockResolvedValue({
        data: { session_id: mockSessionId },
        error: null
      })
      mockStripe.redirectToCheckout.mockResolvedValue({ error: null })
      
      await subscriptionService.redirectToCheckout('price_monthly')
      
      expect(mockStripe.redirectToCheckout).toHaveBeenCalledWith({
        sessionId: mockSessionId
      })
    })

    it('should handle Stripe initialization failure', async () => {
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = ''
      
      // Should not throw error
      await expect(subscriptionService.redirectToCheckout('price_monthly')).resolves.toBeUndefined()
    })

    it('should handle checkout session creation failure', async () => {
      mockApiService.createCheckoutSession.mockResolvedValue({
        data: null,
        error: { message: 'Failed to create session' }
      })
      
      await subscriptionService.redirectToCheckout('price_monthly')
      
      expect(mockStripe.redirectToCheckout).not.toHaveBeenCalled()
    })

    it('should handle Stripe redirect error', async () => {
      const mockSessionId = 'cs_test_123'
      mockApiService.createCheckoutSession.mockResolvedValue({
        data: { session_id: mockSessionId },
        error: null
      })
      mockStripe.redirectToCheckout.mockResolvedValue({
        error: { message: 'Redirect failed' }
      })
      
      // Should not throw error
      await expect(subscriptionService.redirectToCheckout('price_monthly')).resolves.toBeUndefined()
    })
  })

  describe('customer portal', () => {
    it('should redirect to customer portal successfully', async () => {
      const mockCustomerId = 'cus_test_123'
      const mockPortalUrl = 'https://billing.stripe.com/session/abc123'
      
      localStorage.setItem('omnifit_stripe_customer_id', mockCustomerId)
      mockApiService.createPortalSession.mockResolvedValue({
        data: { url: mockPortalUrl },
        error: null
      })
      
      // Mock window.location
      delete (window as any).location
      window.location = { href: '' } as Location
      
      await subscriptionService.redirectToCustomerPortal()
      
      expect(mockApiService.createPortalSession).toHaveBeenCalledWith(mockCustomerId)
      expect(window.location.href).toBe(mockPortalUrl)
    })

    it('should handle missing customer ID', async () => {
      // No customer ID in localStorage
      
      await subscriptionService.redirectToCustomerPortal()
      
      expect(mockApiService.createPortalSession).not.toHaveBeenCalled()
    })

    it('should handle portal session creation error', async () => {
      const mockCustomerId = 'cus_test_123'
      localStorage.setItem('omnifit_stripe_customer_id', mockCustomerId)
      
      mockApiService.createPortalSession.mockResolvedValue({
        data: null,
        error: { message: 'Portal unavailable' }
      })
      
      await subscriptionService.redirectToCustomerPortal()
      
      // Should not crash
      expect(mockApiService.createPortalSession).toHaveBeenCalled()
    })
  })

  describe('trial management', () => {
    it('should start free trial correctly', () => {
      subscriptionService.startFreeTrial()
      
      const status = subscriptionService.getSubscriptionStatus()
      
      expect(status.type).toBe('trial')
      expect(status.status).toBe('trialing')
      expect(status.trialEnd).toBeInstanceOf(Date)
      
      // Should be approximately 7 days from now
      const daysUntilExpiry = Math.ceil(
        (status.trialEnd!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      expect(daysUntilExpiry).toBe(7)
    })
  })

  describe('mock premium subscription', () => {
    it('should mock premium subscription for testing', () => {
      subscriptionService.mockPremiumSubscription()
      
      const status = subscriptionService.getSubscriptionStatus()
      
      expect(status.type).toBe('premium')
      expect(status.status).toBe('active')
      expect(status.currentPeriodEnd).toBeInstanceOf(Date)
      expect(status.cancelAtPeriodEnd).toBe(false)
      
      // Should be approximately 1 month from now
      const daysUntilExpiry = Math.ceil(
        (status.currentPeriodEnd!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      expect(daysUntilExpiry).toBeGreaterThan(25)
      expect(daysUntilExpiry).toBeLessThan(35)
    })
  })

  describe('subscription reset', () => {
    it('should reset subscription to free', () => {
      // Start with premium
      subscriptionService.mockPremiumSubscription()
      expect(subscriptionService.isPremium()).toBe(true)
      
      // Reset
      subscriptionService.resetSubscription()
      
      const status = subscriptionService.getSubscriptionStatus()
      expect(status.type).toBe('free')
      expect(status.status).toBe('active')
      expect(subscriptionService.isPremium()).toBe(false)
    })
  })

  describe('pricing plans', () => {
    it('should have correct pricing plans structure', () => {
      expect(PRICING_PLANS).toHaveLength(2)
      
      const monthlyPlan = PRICING_PLANS.find(p => p.interval === 'month')
      const yearlyPlan = PRICING_PLANS.find(p => p.interval === 'year')
      
      expect(monthlyPlan).toBeTruthy()
      expect(monthlyPlan?.price).toBe(29)
      expect(monthlyPlan?.currency).toBe('EUR')
      
      expect(yearlyPlan).toBeTruthy()
      expect(yearlyPlan?.price).toBe(290) // 2 months free
      expect(yearlyPlan?.currency).toBe('EUR')
      
      // Both should have features
      expect(monthlyPlan?.features.length).toBeGreaterThan(0)
      expect(yearlyPlan?.features.length).toBeGreaterThan(0)
    })
  })

  describe('error scenarios', () => {
    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('omnifit_subscription', '{"invalid": json}')
      
      const status = subscriptionService.getSubscriptionStatus()
      expect(status.type).toBe('free')
    })

    it('should handle missing localStorage gracefully', () => {
      // Simulate localStorage not available
      const originalLocalStorage = window.localStorage
      delete (window as any).localStorage
      
      const status = subscriptionService.getSubscriptionStatus()
      expect(status.type).toBe('free')
      
      // Restore localStorage
      window.localStorage = originalLocalStorage
    })
  })
})