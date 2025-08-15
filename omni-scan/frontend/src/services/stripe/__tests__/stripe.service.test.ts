import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { stripeService } from '../stripe.service'

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn()
}))

// Mock API calls
vi.mock('../../api-simple', () => ({
  createCheckoutSession: vi.fn(),
  checkSubscription: vi.fn()
}))

import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession, checkSubscription } from '../../api-simple'

describe('stripeService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock environment variables
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock_key'
    
    // Mock window.location
    delete (window as any).location
    window.location = { href: '' } as Location
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getStripe', () => {
    it('should initialize Stripe with publishable key', () => {
      const mockStripePromise = Promise.resolve({} as any)
      ;(loadStripe as any).mockReturnValue(mockStripePromise)
      
      // Mock env var
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
      
      const result = stripeService.getStripe()
      
      expect(loadStripe).toHaveBeenCalledWith('pk_test_123')
      expect(result).toBe(mockStripePromise)
    })

    it('should return null when no publishable key', () => {
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = ''
      
      const result = stripeService.getStripe()
      
      expect(result).toBeNull()
      expect(loadStripe).not.toHaveBeenCalled()
    })

    it('should reuse existing Stripe promise', () => {
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
      
      stripeService.getStripe()
      stripeService.getStripe()
      
      expect(loadStripe).toHaveBeenCalledTimes(1)
    })
  })

  describe('createCheckoutSession', () => {
    it('should redirect to Stripe checkout URL in production', async () => {
      const mockUrl = 'https://checkout.stripe.com/pay/cs_test_123'
      ;(createCheckoutSession as any).mockResolvedValue({ url: mockUrl })
      
      const result = await stripeService.createCheckoutSession()
      
      expect(createCheckoutSession).toHaveBeenCalled()
      expect(window.location.href).toBe(mockUrl)
      expect(result).toEqual({ url: mockUrl })
    })

    it('should handle demo mode gracefully', async () => {
      const mockResponse = { 
        message: 'Mode demo actif - Stripe non configuré en développement' 
      }
      ;(createCheckoutSession as any).mockResolvedValue(mockResponse)
      
      const result = await stripeService.createCheckoutSession()
      
      expect(console.warn).toHaveBeenCalledWith('Mode demo:', mockResponse.message)
      expect(result).toEqual({ error: 'Mode demo - Stripe non configuré' })
    })

    it('should handle API errors', async () => {
      const mockError = new Error('Network error')
      ;(createCheckoutSession as any).mockRejectedValue(mockError)
      
      const result = await stripeService.createCheckoutSession()
      
      expect(console.error).toHaveBeenCalledWith('Erreur création checkout:', mockError)
      expect(result).toEqual({ error: 'Erreur lors de la création du paiement' })
    })

    it('should not redirect when no URL provided', async () => {
      ;(createCheckoutSession as any).mockResolvedValue({ success: true })
      
      const originalHref = window.location.href
      await stripeService.createCheckoutSession()
      
      expect(window.location.href).toBe(originalHref)
    })
  })

  describe('checkSubscription', () => {
    it('should return subscription data on success', async () => {
      const mockSubscription = {
        is_pro: true,
        scans_used: 15,
        scans_limit: 1000,
        scans_remaining: 985
      }
      ;(checkSubscription as any).mockResolvedValue(mockSubscription)
      
      const result = await stripeService.checkSubscription()
      
      expect(checkSubscription).toHaveBeenCalled()
      expect(result).toEqual(mockSubscription)
    })

    it('should return default values on API error', async () => {
      const mockError = new Error('API Error')
      ;(checkSubscription as any).mockRejectedValue(mockError)
      
      const result = await stripeService.checkSubscription()
      
      expect(console.error).toHaveBeenCalledWith('Erreur vérification abonnement:', mockError)
      expect(result).toEqual({
        is_pro: false,
        scans_used: 0,
        scans_limit: 3,
        scans_remaining: 3,
        reason: 'error'
      })
    })

    it('should handle network timeouts gracefully', async () => {
      ;(checkSubscription as any).mockRejectedValue(new Error('timeout'))
      
      const result = await stripeService.checkSubscription()
      
      expect(result.is_pro).toBe(false)
      expect(result.reason).toBe('error')
      expect(result.scans_limit).toBe(3) // Free tier fallback
    })
  })

  describe('handlePaymentReturn', () => {
    it('should verify subscription when session ID provided', async () => {
      const mockSubscription = { is_pro: true }
      vi.spyOn(stripeService, 'checkSubscription').mockResolvedValue(mockSubscription as any)
      
      const result = await stripeService.handlePaymentReturn('cs_test_123')
      
      expect(stripeService.checkSubscription).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false when no session ID', async () => {
      const result = await stripeService.handlePaymentReturn()
      
      expect(result).toBe(false)
    })

    it('should return false when subscription check fails', async () => {
      const mockSubscription = { is_pro: false }
      vi.spyOn(stripeService, 'checkSubscription').mockResolvedValue(mockSubscription as any)
      
      const result = await stripeService.handlePaymentReturn('cs_test_123')
      
      expect(result).toBe(false)
    })

    it('should handle undefined session ID', async () => {
      const result = await stripeService.handlePaymentReturn(undefined)
      
      expect(result).toBe(false)
    })
  })

  describe('business logic integration', () => {
    it('should handle complete payment flow', async () => {
      // Simulate checkout session creation
      const checkoutUrl = 'https://checkout.stripe.com/pay/cs_test_123'
      ;(createCheckoutSession as any).mockResolvedValue({ url: checkoutUrl })
      
      await stripeService.createCheckoutSession()
      expect(window.location.href).toBe(checkoutUrl)
      
      // Simulate return from payment
      const mockSubscription = { is_pro: true }
      vi.spyOn(stripeService, 'checkSubscription').mockResolvedValue(mockSubscription as any)
      
      const isPro = await stripeService.handlePaymentReturn('cs_test_123')
      expect(isPro).toBe(true)
    })

    it('should maintain quota limits for free users', async () => {
      ;(checkSubscription as any).mockRejectedValue(new Error('Not found'))
      
      const subscription = await stripeService.checkSubscription()
      
      expect(subscription.is_pro).toBe(false)
      expect(subscription.scans_limit).toBe(3)
      expect(subscription.scans_remaining).toBe(3)
    })
  })
})