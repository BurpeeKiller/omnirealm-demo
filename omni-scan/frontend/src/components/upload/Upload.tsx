import { useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui'
import { UploadProvider, useUploadContext } from '@/providers/UploadProvider'
import type { UploadProviderProps } from '@/providers/UploadProvider'
import { useApiKeys } from '@/hooks/useApiKeys'
import { DropZone } from './DropZone'
import { QuotaDisplay } from './QuotaDisplay'
import { UploadProgress } from './UploadProgress'
import { ResultsView } from './ResultsView'
import { ApiKeyManager } from './ApiKeyManager'
import { Paywall } from '../payment/Paywall'
import { cn } from '@/lib/utils'
import { useUmami } from '@/components/UmamiProvider'

// Configuration des features
export interface UploadFeatures {
  quota?: boolean
  apiKeys?: boolean
  analysisConfig?: boolean
  navigation?: boolean
  cache?: boolean
  paywall?: boolean
}

// Configuration UI
export interface UploadUI {
  showHeader?: boolean
  showExamples?: boolean
  compactMode?: boolean
  className?: string
}

// Configuration générale
export interface UploadConfig {
  maxFileSize?: number
  acceptedFormats?: Record<string, string[]>
  apiEndpoint?: string
  uploadOptions?: {
    detailLevel?: 'short' | 'medium' | 'detailed' | 'high'
    language?: string
    includeStructuredData?: boolean
    chapterSummaries?: boolean
  }
}

// Props du composant principal
export interface UploadProps {
  mode?: 'simple' | 'authenticated' | 'demo' | 'page'
  features?: UploadFeatures
  ui?: UploadUI
  config?: UploadConfig
  onUploadSuccess?: (result: any) => void
  onQuotaExceeded?: () => void
  onError?: (error: string) => void
}

// Composant interne qui utilise le context
function UploadContent({
  features = {},
  ui = {},
  config = {},
  onError
}: Omit<UploadProps, 'mode' | 'onUploadSuccess' | 'onQuotaExceeded'>) {
  const { trackEngagement } = useUmami()
  const uploadContext = useUploadContext()
  const apiKeysHook = useApiKeys()

  // Valeurs par défaut des features
  const enabledFeatures: UploadFeatures = {
    quota: features.quota ?? true,
    apiKeys: features.apiKeys ?? false,
    analysisConfig: features.analysisConfig ?? false,
    navigation: features.navigation ?? false,
    cache: features.cache ?? true,
    paywall: features.paywall ?? true,
    ...features
  }

  // Valeurs par défaut UI
  const uiConfig: UploadUI = {
    showHeader: ui.showHeader ?? true,
    showExamples: ui.showExamples ?? false,
    compactMode: ui.compactMode ?? false,
    className: ui.className,
    ...ui
  }

  // Valeurs par défaut config
  const uploadConfig: UploadConfig = {
    maxFileSize: config.maxFileSize ?? 50 * 1024 * 1024, // 50MB
    acceptedFormats: config.acceptedFormats ?? {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
    },
    uploadOptions: config.uploadOptions ?? {
      detailLevel: 'medium',
      includeStructuredData: true
    },
    ...config
  }


  // Gestion du drop
  const handleDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return

    // Vérifier la clé API si nécessaire
    if (enabledFeatures.apiKeys && !apiKeysHook.hasValidKey) {
      onError?.('Veuillez configurer une clé API pour continuer')
      return
    }

    // Upload avec les options configurées
    const result = await uploadContext.uploadFile(file, uploadConfig.uploadOptions)
    
    // Track upload success
    if (result && !uploadContext.uploadError) {
      trackEngagement('file_uploaded', 'ocr')
    }
  }, [uploadContext, apiKeysHook.hasValidKey, enabledFeatures.apiKeys, uploadConfig.uploadOptions, onError, trackEngagement])

  // Affichage conditionnel du header
  const renderHeader = () => {
    if (!uiConfig.showHeader) return null

    return (
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">OmniScan OCR</h1>
        <p className="text-gray-600">Extraction de texte intelligente par IA</p>
        
        {enabledFeatures.quota && !uploadContext.isSubscribed && (
          <div className="mt-4">
            <QuotaDisplay
              used={uploadContext.quota.used}
              limit={uploadContext.quota.limit}
              isPro={uploadContext.isSubscribed}
              variant="compact"
            />
          </div>
        )}
      </div>
    )
  }

  // Affichage des exemples
  const renderExamples = () => {
    if (!uiConfig.showExamples || uploadContext.hasResult) return null

    return (
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Exemples de fichiers supportés :</p>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>📄 Documents PDF</span>
          <span>🖼️ Images (JPG, PNG)</span>
          <span>📊 Scans (TIFF, BMP)</span>
        </div>
      </div>
    )
  }

  // Rendu principal
  return (
    <div className={cn(
      "max-w-4xl mx-auto",
      uiConfig.compactMode ? "p-4" : "p-8",
      uiConfig.className
    )}>
      {renderHeader()}
      {renderExamples()}

      {/* Zone d'upload ou résultats */}
      {!uploadContext.hasResult ? (
        <>
          {/* Quota détaillé si activé et non compact */}
          {enabledFeatures.quota && !uiConfig.compactMode && (
            <div className="mb-6">
              <QuotaDisplay
                used={uploadContext.quota.used}
                limit={uploadContext.quota.limit}
                isPro={uploadContext.isSubscribed}
                variant="detailed"
              />
            </div>
          )}

          {/* Configuration des clés API */}
          {enabledFeatures.apiKeys && (
            <div className="mb-6">
              <ApiKeyManager 
                compact={uiConfig.compactMode}
              />
            </div>
          )}

          {/* Zone d'upload */}
          <Card>
            <CardContent className={uiConfig.compactMode ? "p-4" : "p-8"}>
              {uploadContext.jobStatus ? (
                <UploadProgress
                  status={uploadContext.jobStatus}
                  fileName={uploadContext.fileName}
                  showDetails={!uiConfig.compactMode}
                />
              ) : (
                <DropZone
                  onDrop={handleDrop}
                  isLoading={uploadContext.isUploading}
                  accept={uploadConfig.acceptedFormats}
                  maxSize={uploadConfig.maxFileSize}
                  compact={uiConfig.compactMode}
                />
              )}

              {/* Erreur */}
              {uploadContext.uploadError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{uploadContext.uploadError}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Résultats */
        <ResultsView
          result={uploadContext.result}
          onNewScan={uploadContext.resetUpload}
          variant={uiConfig.compactMode ? 'compact' : 'full'}
          showRawText={!uiConfig.compactMode}
          showAIAnalysis={true}
        />
      )}

      {/* Paywall */}
      {enabledFeatures.paywall && (
        <Paywall
          isOpen={uploadContext.isPaywallVisible}
          onClose={uploadContext.hidePaywall}
          scansUsed={uploadContext.quota.used}
          scansLimit={uploadContext.quota.limit}
        />
      )}
    </div>
  )
}

// Composant principal avec Provider
export function Upload({
  mode = 'simple',
  onUploadSuccess,
  onQuotaExceeded,
  onError,
  ...otherProps
}: UploadProps) {
  return (
    <UploadProvider
      mode={mode}
      onUploadSuccess={onUploadSuccess}
      onQuotaExceeded={onQuotaExceeded}
      onUploadError={onError}
    >
      <UploadContent onError={onError} {...otherProps} />
    </UploadProvider>
  )
}