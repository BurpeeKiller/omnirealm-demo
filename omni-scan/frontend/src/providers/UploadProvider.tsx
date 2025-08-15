import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useQuota, type UseQuotaOptions } from '@/hooks/useQuota'
import { usePaywall, type UsePaywallOptions } from '@/hooks/usePaywall'
import { useFileUpload, type UseFileUploadOptions, type UploadResult } from '@/hooks/useFileUpload'
import type { UploadOptions } from '@/services/upload.service'

export interface UploadContextValue {
  // Quota
  quota: ReturnType<typeof useQuota>['quota']
  isQuotaLoading: boolean
  quotaError: string | null
  checkQuota: () => Promise<any>
  canUpload: (file?: File) => boolean
  isQuotaExceeded: boolean
  quotaPercentage: number
  isSubscribed: boolean

  // Upload
  isUploading: boolean
  uploadProgress: number
  jobStatus: any
  result: UploadResult | null
  uploadError: string | null
  fileName: string | null
  uploadFile: (file: File, options?: UploadOptions) => Promise<UploadResult | null>
  resetUpload: () => void
  hasResult: boolean

  // Paywall
  isPaywallVisible: boolean
  isCreatingSession: boolean
  showPaywall: () => void
  hidePaywall: () => void
  handleUpgrade: () => Promise<void>
}

const UploadContext = createContext<UploadContextValue | null>(null)

export interface UploadProviderProps {
  children: React.ReactNode
  mode?: 'simple' | 'authenticated' | 'demo'
  autoCheckQuota?: boolean
  enableCache?: boolean
  onUploadSuccess?: (result: UploadResult) => void
  onUploadError?: (error: string) => void
  onQuotaExceeded?: () => void
}

export function UploadProvider({
  children,
  mode = 'simple',
  autoCheckQuota = true,
  enableCache = true,
  onUploadSuccess,
  onUploadError,
  onQuotaExceeded
}: UploadProviderProps) {
  // Initialiser les hooks
  const quota = useQuota({
    autoCheck: autoCheckQuota,
    onQuotaExceeded: onQuotaExceeded
  })

  const paywall = usePaywall({
    onCheckoutSuccess: () => {
      // Recharger les quotas après achat
      quota.checkQuota()
      paywall.hide()
    },
    onCheckoutError: (error) => {
      onUploadError?.(error)
    }
  })

  const upload = useFileUpload({
    mode,
    enableCache,
    onSuccess: onUploadSuccess,
    onError: onUploadError,
    onProgress: (progress) => {
      // Progress callback si nécessaire
    }
  })

  // Vérifier les quotas au montage
  useEffect(() => {
    if (autoCheckQuota && mode !== 'demo') {
      quota.checkQuota()
    }
  }, [autoCheckQuota, mode, quota.checkQuota])

  // Wrapper pour l'upload avec vérification quota
  const handleUpload = useCallback(async (
    file: File, 
    options?: UploadOptions
  ): Promise<UploadResult | null> => {
    // Vérifier les quotas d'abord (sauf en mode demo)
    if (mode !== 'demo' && !quota.canUpload(file)) {
      paywall.show()
      return null
    }

    // Procéder à l'upload
    const result = await upload.uploadFile(file, options)
    
    // Consommer le quota si succès (utilisateurs gratuits seulement)
    if (result && !quota.isSubscribed) {
      quota.consumeQuota()
    }

    return result
  }, [mode, quota, paywall, upload])

  // Wrapper pour l'upgrade qui affiche le paywall
  const handleQuotaExceeded = useCallback(() => {
    paywall.show()
    onQuotaExceeded?.()
  }, [paywall, onQuotaExceeded])

  const contextValue: UploadContextValue = {
    // Quota
    quota: quota.quota,
    isQuotaLoading: quota.isLoading,
    quotaError: quota.error,
    checkQuota: quota.checkQuota,
    canUpload: quota.canUpload,
    isQuotaExceeded: quota.isQuotaExceeded,
    quotaPercentage: quota.quotaPercentage,
    isSubscribed: quota.isSubscribed,

    // Upload
    isUploading: upload.isUploading,
    uploadProgress: upload.progress,
    jobStatus: upload.jobStatus,
    result: upload.result,
    uploadError: upload.error,
    fileName: upload.fileName,
    uploadFile: handleUpload,
    resetUpload: upload.reset,
    hasResult: upload.hasResult,

    // Paywall
    isPaywallVisible: paywall.isVisible,
    isCreatingSession: paywall.isCreatingSession,
    showPaywall: paywall.show,
    hidePaywall: paywall.hide,
    handleUpgrade: paywall.handleUpgrade
  }

  return (
    <UploadContext.Provider value={contextValue}>
      {children}
    </UploadContext.Provider>
  )
}

export function useUploadContext() {
  const context = useContext(UploadContext)
  if (!context) {
    throw new Error('useUploadContext must be used within UploadProvider')
  }
  return context
}