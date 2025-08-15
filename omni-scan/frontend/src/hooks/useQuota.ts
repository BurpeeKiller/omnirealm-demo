import { useState, useCallback } from 'react'
import { uploadService, type QuotaInfo } from '@/services/upload.service'

export interface UseQuotaOptions {
  autoCheck?: boolean
  onQuotaExceeded?: () => void
}

export function useQuota(options: UseQuotaOptions = {}) {
  const { autoCheck = true, onQuotaExceeded } = options

  const [quota, setQuota] = useState<QuotaInfo>({
    used: 0,
    limit: 3,
    isSubscribed: false,
    remaining: 3
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkQuota = useCallback(async () => {
    if (isLoading) return quota

    setIsLoading(true)
    setError(null)
    
    try {
      const quotaInfo = await uploadService.checkQuota()
      setQuota(quotaInfo)
      return quotaInfo
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur vérification quota'
      setError(errorMessage)
      console.error('Erreur vérification quota:', err)
      return quota
    } finally {
      setIsLoading(false)
    }
  }, [quota, isLoading])

  const canUpload = useCallback((file?: File): boolean => {
    // Toujours autoriser les utilisateurs premium
    if (quota.isSubscribed) return true
    
    // Vérifier le quota pour les utilisateurs gratuits
    const wouldExceed = quota.used >= quota.limit
    
    if (wouldExceed && onQuotaExceeded) {
      onQuotaExceeded()
      return false
    }

    return !wouldExceed
  }, [quota, onQuotaExceeded])

  const consumeQuota = useCallback(() => {
    if (!quota.isSubscribed) {
      setQuota(prev => ({
        ...prev,
        used: prev.used + 1,
        remaining: Math.max(0, prev.remaining - 1)
      }))
    }
  }, [quota.isSubscribed])

  return {
    // État
    quota,
    isLoading,
    error,
    
    // Actions
    checkQuota,
    canUpload,
    consumeQuota,
    
    // Helpers
    isQuotaExceeded: !quota.isSubscribed && quota.used >= quota.limit,
    quotaPercentage: Math.round((quota.used / quota.limit) * 100),
    isSubscribed: quota.isSubscribed
  }
}