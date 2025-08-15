import { useState, useCallback } from 'react'
import { uploadService } from '@/services/upload.service'

export interface UsePaywallOptions {
  onCheckoutSuccess?: () => void
  onCheckoutError?: (error: string) => void
}

export function usePaywall(options: UsePaywallOptions = {}) {
  const { onCheckoutSuccess, onCheckoutError } = options

  const [isVisible, setIsVisible] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  const show = useCallback(() => {
    setIsVisible(true)
  }, [])

  const hide = useCallback(() => {
    setIsVisible(false)
  }, [])

  const createCheckoutSession = useCallback(async () => {
    setIsCreatingSession(true)
    
    try {
      const response = await uploadService.createCheckoutSession()
      
      if (response && response.url) {
        onCheckoutSuccess?.()
        // Rediriger vers Stripe ou ouvrir dans un nouvel onglet
        window.location.href = response.url
      }
      
      return response
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur création session'
      onCheckoutError?.(errorMessage)
      console.error('Erreur création checkout:', error)
      return null
    } finally {
      setIsCreatingSession(false)
    }
  }, [onCheckoutSuccess, onCheckoutError])

  const handleUpgrade = useCallback(async () => {
    await createCheckoutSession()
  }, [createCheckoutSession])

  return {
    // État
    isVisible,
    isCreatingSession,
    
    // Actions
    show,
    hide,
    createCheckoutSession,
    handleUpgrade
  }
}