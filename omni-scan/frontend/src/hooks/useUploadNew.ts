import { useUploadContext } from '@/providers/UploadProvider'

/**
 * Hook unifié pour l'upload qui utilise le nouveau context
 * Compatible avec l'ancienne API de useUpload mais beaucoup plus simple
 */
export function useUploadNew() {
  const context = useUploadContext()

  return {
    // État de l'upload
    isUploading: context.isUploading,
    uploadProgress: context.uploadProgress,
    jobStatus: context.jobStatus,
    result: context.result,
    error: context.uploadError,
    fileName: context.fileName,

    // État des quotas
    quota: context.quota,
    showPaywall: context.isPaywallVisible,

    // Actions principales
    upload: context.uploadFile,
    reset: context.resetUpload,
    checkQuota: context.checkQuota,
    createCheckoutSession: context.handleUpgrade,
    setShowPaywall: (show: boolean) => show ? context.showPaywall() : context.hidePaywall(),

    // Helpers calculés
    isQuotaExceeded: context.isQuotaExceeded,
    canUpload: context.canUpload(),
    quotaPercentage: context.quotaPercentage
  }
}

// Alias pour la transition
export { useUploadNew as useUpload }