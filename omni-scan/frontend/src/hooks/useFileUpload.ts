import { useState, useCallback, useRef } from 'react'
import { uploadService, type UploadOptions, type JobStatus } from '@/services/upload.service'
import type { AxiosProgressEvent } from 'axios'

export interface UploadResult {
  filename: string
  extracted_text?: string
  ai_analysis?: any
  metadata?: any
  [key: string]: any
}

export interface UseFileUploadOptions {
  mode?: 'simple' | 'authenticated' | 'demo'
  enableCache?: boolean
  onSuccess?: (result: UploadResult) => void
  onError?: (error: string) => void
  onProgress?: (progress: number) => void
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    mode = 'simple',
    enableCache = true,
    onSuccess,
    onError,
    onProgress
  } = options

  // État de l'upload
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  // Cache des résultats
  const resultsCache = useRef<Map<string, UploadResult>>(new Map())

  const generateCacheKey = useCallback((file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`
  }, [])

  const getCachedResult = useCallback((file: File): UploadResult | null => {
    if (!enableCache) return null
    const key = generateCacheKey(file)
    return resultsCache.current.get(key) || null
  }, [enableCache, generateCacheKey])

  const setCachedResult = useCallback((file: File, result: UploadResult) => {
    if (!enableCache) return
    const key = generateCacheKey(file)
    resultsCache.current.set(key, result)
  }, [enableCache, generateCacheKey])

  const generateDemoResult = useCallback((file: File): UploadResult => ({
    filename: file.name,
    text_length: Math.floor(Math.random() * 5000) + 1000,
    processing_time: '2.3s',
    extracted_text: `Ceci est un exemple de texte extrait du fichier ${file.name}.\n\nEn mode démo, le contenu réel n'est pas traité, mais vous pouvez voir comment l'interface fonctionne.\n\nLe texte extrait apparaîtrait ici avec toute la mise en forme préservée.`,
    ai_analysis: {
      summary: `Document de test "${file.name}" analysé avec succès en mode démonstration.`,
      key_points: [
        'Extraction de texte réussie',
        'Analyse IA disponible',
        'Export possible en multiple formats'
      ]
    },
    metadata: {
      pages: Math.floor(Math.random() * 10) + 1,
      language: 'Français',
      confidence: 0.98
    }
  }), [])

  const simulateDemoUpload = useCallback(async (file: File) => {
    const steps = 5
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const progressValue = (i / steps) * 100
      setProgress(progressValue)
      onProgress?.(progressValue)
      
      setJobStatus({
        id: 'demo-job',
        type: 'ocr',
        status: 'processing',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        progress: {
          current: i,
          total: steps,
          percentage: progressValue,
          message: `Étape ${i} sur ${steps}...`
        }
      } as JobStatus)
    }
  }, [onProgress])

  const uploadFile = useCallback(async (
    file: File,
    uploadOptions?: UploadOptions
  ): Promise<UploadResult | null> => {
    // Vérifier le cache d'abord
    const cachedResult = getCachedResult(file)
    if (cachedResult) {
      setResult(cachedResult)
      setFileName(file.name)
      onSuccess?.(cachedResult)
      return cachedResult
    }

    // Réinitialiser l'état
    setIsUploading(true)
    setProgress(0)
    setJobStatus(null)
    setResult(null)
    setError(null)
    setFileName(file.name)

    try {
      // Mode demo
      if (mode === 'demo') {
        await simulateDemoUpload(file)
        const demoResult = generateDemoResult(file)
        
        setResult(demoResult)
        setIsUploading(false)
        setProgress(100)
        onSuccess?.(demoResult)
        
        return demoResult
      }

      // Upload réel
      const uploadResult = await uploadService.upload(
        file,
        uploadOptions || {},
        (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          setProgress(percentCompleted)
          onProgress?.(percentCompleted)
        }
      )

      // Suivre le job si nécessaire
      if (uploadOptions?.useJobQueue !== false && uploadResult.job_id) {
        await uploadService.pollJobStatus(
          uploadResult.job_id,
          (status: JobStatus) => {
            setJobStatus(status)
          }
        )
      }

      // Succès
      setResult(uploadResult)
      setIsUploading(false)
      setProgress(100)
      
      // Mettre en cache
      setCachedResult(file, uploadResult)
      
      onSuccess?.(uploadResult)
      return uploadResult

    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du traitement'
      
      setError(errorMessage)
      setIsUploading(false)
      setProgress(0)
      
      onError?.(errorMessage)
      return null
    }
  }, [
    getCachedResult,
    setCachedResult,
    mode,
    simulateDemoUpload,
    generateDemoResult,
    onSuccess,
    onError,
    onProgress
  ])

  const reset = useCallback(() => {
    setIsUploading(false)
    setProgress(0)
    setJobStatus(null)
    setResult(null)
    setError(null)
    setFileName(null)
  }, [])

  const clearCache = useCallback(() => {
    resultsCache.current.clear()
  }, [])

  return {
    // État
    isUploading,
    progress,
    jobStatus,
    result,
    error,
    fileName,
    
    // Actions
    uploadFile,
    reset,
    clearCache,
    
    // Helpers
    hasResult: result !== null,
    hasError: error !== null
  }
}