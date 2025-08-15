import { apiService, AnalysisOptions } from './api-unified'
import { SelectedZone, OCRWithZonesOptions, BoundingBox } from '@/types/ocr'

export interface OCRZoneResult {
  zoneId: string
  zone: SelectedZone
  extractedText: string
  confidence: number
  processingTime: number
  aiAnalysis?: any
}

export interface OCRWithZonesResult {
  success: boolean
  filename: string
  zones: OCRZoneResult[]
  fullImageResult?: {
    extractedText: string
    aiAnalysis: any
    confidence: number
  }
  totalProcessingTime: number
  mergedText?: string
}

class OCRZonesService {
  /**
   * Traiter un fichier avec des zones spécifiques sélectionnées
   */
  async processWithZones(
    file: File,
    options: OCRWithZonesOptions = {}
  ): Promise<OCRWithZonesResult> {
    const {
      zones = [],
      includeFullImage = false,
      mergeResults = true,
      language = 'auto',
      detailLevel = 'medium'
    } = options

    // Si pas de zones, traitement normal
    if (zones.length === 0 && !includeFullImage) {
      const result = await apiService.uploadDocumentSimple(file, {
        language,
        detailLevel,
        includeStructuredData: true
      })
      
      return {
        success: result.success,
        filename: result.filename,
        zones: [],
        fullImageResult: {
          extractedText: result.extracted_text,
          aiAnalysis: result.ai_analysis,
          confidence: 0.95 // Valeur par défaut
        },
        totalProcessingTime: parseFloat(result.processing_time) || 0
      }
    }

    // Préparer les données pour l'API
    const formData = new FormData()
    formData.append('file', file)
    formData.append('language', language)
    formData.append('detail_level', detailLevel)
    formData.append('include_full_image', String(includeFullImage))
    formData.append('merge_results', String(mergeResults))

    // Convertir les zones au format attendu par le backend
    const apiZones: BoundingBox[] = zones.map(zone => ({
      x: zone.x,
      y: zone.y,
      width: zone.width,
      height: zone.height
    }))

    if (apiZones.length > 0) {
      formData.append('regions', JSON.stringify(apiZones))
    }

    try {
      // Utiliser l'endpoint OCR v2 qui supporte les zones
      const response = await fetch('/api/v1/ocr/process-with-zones', {
        method: 'POST',
        body: formData,
        headers: {
          // Ne pas définir Content-Type, le navigateur le fera automatiquement avec boundary
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()
      
      // Mapper les résultats avec les zones originales
      const zoneResults: OCRZoneResult[] = zones.map((zone, index) => {
        const apiResult = result.zones?.[index] || {}
        return {
          zoneId: zone.id,
          zone,
          extractedText: apiResult.text || '',
          confidence: apiResult.confidence || 0,
          processingTime: apiResult.processing_time || 0,
          aiAnalysis: apiResult.ai_analysis
        }
      })

      return {
        success: true,
        filename: result.filename || file.name,
        zones: zoneResults,
        fullImageResult: result.full_image_result,
        totalProcessingTime: result.total_processing_time || 0,
        mergedText: result.merged_text
      }

    } catch (error) {
      console.error('Erreur lors du traitement OCR avec zones:', error)
      
      // Fallback : traiter l'image complète
      console.log('Fallback vers traitement complet...')
      const fallbackResult = await apiService.uploadDocumentSimple(file, {
        language,
        detailLevel,
        includeStructuredData: true
      })

      return {
        success: fallbackResult.success,
        filename: fallbackResult.filename,
        zones: zones.map(zone => ({
          zoneId: zone.id,
          zone,
          extractedText: 'Erreur : Impossible de traiter cette zone spécifiquement',
          confidence: 0,
          processingTime: 0
        })),
        fullImageResult: {
          extractedText: fallbackResult.extracted_text,
          aiAnalysis: fallbackResult.ai_analysis,
          confidence: 0.95
        },
        totalProcessingTime: parseFloat(fallbackResult.processing_time) || 0
      }
    }
  }

  /**
   * Prévisualiser les zones avant traitement
   */
  async previewZones(file: File, zones: SelectedZone[]): Promise<{
    success: boolean
    previews: Array<{
      zoneId: string
      imageData: string // Base64 de l'image croppée
      estimatedTextLength: number
    }>
  }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('regions', JSON.stringify(zones.map(zone => ({
      x: zone.x,
      y: zone.y,
      width: zone.width,
      height: zone.height
    }))))

    try {
      const response = await fetch('/api/v1/ocr/preview-zones', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        previews: zones.map((zone, index) => ({
          zoneId: zone.id,
          imageData: result.previews?.[index]?.image_data || '',
          estimatedTextLength: result.previews?.[index]?.estimated_text_length || 0
        }))
      }

    } catch (error) {
      console.error('Erreur lors de la prévisualisation des zones:', error)
      return {
        success: false,
        previews: []
      }
    }
  }

  /**
   * Obtenir des suggestions de zones basées sur l'analyse de l'image
   */
  async suggestZones(file: File): Promise<{
    success: boolean
    suggestedZones: SelectedZone[]
  }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('detect_regions', 'true')

    try {
      const response = await fetch('/api/v1/ocr/suggest-zones', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()
      
      const suggestedZones: SelectedZone[] = (result.suggested_regions || []).map((region: any, index: number) => ({
        id: `suggested_${index}`,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        confidence: region.confidence || 0,
        color: this.generateColor(index),
        label: `Zone suggérée ${index + 1}`
      }))

      return {
        success: true,
        suggestedZones
      }

    } catch (error) {
      console.error('Erreur lors de la suggestion de zones:', error)
      return {
        success: false,
        suggestedZones: []
      }
    }
  }

  /**
   * Générer une couleur pour une zone
   */
  private generateColor(index: number): string {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
    ]
    return colors[index % colors.length]
  }
}

// Instance singleton
export const ocrZonesService = new OCRZonesService()