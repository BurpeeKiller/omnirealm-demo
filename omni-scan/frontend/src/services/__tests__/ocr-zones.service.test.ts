import { ocrZonesService } from '../ocr-zones.service'
import { SelectedZone } from '@/types/ocr'

// Mock fetch
global.fetch = jest.fn()

describe('OCRZonesService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
  
  const mockZones: SelectedZone[] = [
    {
      id: 'zone_1',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      color: '#3B82F6',
      label: 'Zone 1'
    },
    {
      id: 'zone_2',
      x: 300,
      y: 200,
      width: 150,
      height: 100,
      color: '#EF4444',
      label: 'Zone 2'
    }
  ]

  describe('processWithZones', () => {
    it('should process file without zones using simple upload', async () => {
      const mockApiResponse = {
        success: true,
        filename: 'test.jpg',
        extracted_text: 'Extracted text from image',
        ai_analysis: { summary: 'Test summary' },
        processing_time: '2.5'
      }

      // Mock apiService
      const apiService = require('../api-unified').apiService
      apiService.uploadDocumentSimple = jest.fn().mockResolvedValue(mockApiResponse)

      const result = await ocrZonesService.processWithZones(mockFile, {
        zones: [],
        includeFullImage: false
      })

      expect(result).toEqual({
        success: true,
        filename: 'test.jpg',
        zones: [],
        fullImageResult: {
          extractedText: 'Extracted text from image',
          aiAnalysis: { summary: 'Test summary' },
          confidence: 0.95
        },
        totalProcessingTime: 2.5
      })
    })

    it('should process file with zones using zone endpoint', async () => {
      const mockResponse = {
        filename: 'test.jpg',
        zones: [
          {
            text: 'Text from zone 1',
            confidence: 0.9,
            processing_time: 1.2,
            ai_analysis: { type: 'text' }
          },
          {
            text: 'Text from zone 2',
            confidence: 0.8,
            processing_time: 1.1,
            ai_analysis: { type: 'text' }
          }
        ],
        full_image_result: {
          text: 'Full image text',
          ai_analysis: { summary: 'Full summary' }
        },
        total_processing_time: 3.5,
        merged_text: 'Text from zone 1\nText from zone 2'
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await ocrZonesService.processWithZones(mockFile, {
        zones: mockZones,
        includeFullImage: true,
        mergeResults: true,
        language: 'fra',
        detailLevel: 'detailed'
      })

      expect(result.success).toBe(true)
      expect(result.filename).toBe('test.jpg')
      expect(result.zones).toHaveLength(2)
      expect(result.zones[0]).toMatchObject({
        zoneId: 'zone_1',
        zone: mockZones[0],
        extractedText: 'Text from zone 1',
        confidence: 0.9
      })
      expect(result.totalProcessingTime).toBe(3.5)
      expect(result.mergedText).toBe('Text from zone 1\nText from zone 2')

      // Vérifier l'appel fetch
      expect(fetch).toHaveBeenCalledWith('/api/v1/ocr/process-with-zones', {
        method: 'POST',
        body: expect.any(FormData),
        headers: {}
      })
    })

    it('should handle API errors with fallback to simple upload', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

      const mockApiResponse = {
        success: true,
        filename: 'test.jpg',
        extracted_text: 'Fallback text',
        ai_analysis: { summary: 'Fallback summary' },
        processing_time: '1.5'
      }

      const apiService = require('../api-unified').apiService
      apiService.uploadDocumentSimple = jest.fn().mockResolvedValue(mockApiResponse)

      const result = await ocrZonesService.processWithZones(mockFile, {
        zones: mockZones
      })

      expect(result.success).toBe(true)
      expect(result.zones).toHaveLength(2)
      expect(result.zones[0].extractedText).toBe('Erreur : Impossible de traiter cette zone spécifiquement')
      expect(result.fullImageResult?.extractedText).toBe('Fallback text')
    })

    it('should send correct FormData for zone processing', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          filename: 'test.jpg',
          zones: [],
          total_processing_time: 1.0
        })
      })

      await ocrZonesService.processWithZones(mockFile, {
        zones: mockZones,
        includeFullImage: true,
        mergeResults: false,
        language: 'eng',
        detailLevel: 'high'
      })

      const formData = (fetch as jest.Mock).mock.calls[0][1].body as FormData
      
      expect(formData.get('file')).toBe(mockFile)
      expect(formData.get('language')).toBe('eng')
      expect(formData.get('detail_level')).toBe('high')
      expect(formData.get('include_full_image')).toBe('true')
      expect(formData.get('merge_results')).toBe('false')
      
      const regions = JSON.parse(formData.get('regions') as string)
      expect(regions).toEqual([
        { x: 100, y: 100, width: 200, height: 150 },
        { x: 300, y: 200, width: 150, height: 100 }
      ])
    })
  })

  describe('previewZones', () => {
    it('should preview zones successfully', async () => {
      const mockResponse = {
        previews: [
          {
            image_data: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
            estimated_text_length: 50
          },
          {
            image_data: 'data:image/jpeg;base64,/9j/4AAQSkZJRb...',
            estimated_text_length: 30
          }
        ]
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await ocrZonesService.previewZones(mockFile, mockZones)

      expect(result.success).toBe(true)
      expect(result.previews).toHaveLength(2)
      expect(result.previews[0]).toEqual({
        zoneId: 'zone_1',
        imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
        estimatedTextLength: 50
      })
    })

    it('should handle preview errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Preview Error'))

      const result = await ocrZonesService.previewZones(mockFile, mockZones)

      expect(result.success).toBe(false)
      expect(result.previews).toEqual([])
    })
  })

  describe('suggestZones', () => {
    it('should suggest zones successfully', async () => {
      const mockResponse = {
        suggested_regions: [
          {
            x: 50,
            y: 50,
            width: 100,
            height: 80,
            confidence: 0.9
          },
          {
            x: 200,
            y: 150,
            width: 120,
            height: 60,
            confidence: 0.8
          }
        ]
      }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await ocrZonesService.suggestZones(mockFile)

      expect(result.success).toBe(true)
      expect(result.suggestedZones).toHaveLength(2)
      expect(result.suggestedZones[0]).toMatchObject({
        id: 'suggested_0',
        x: 50,
        y: 50,
        width: 100,
        height: 80,
        confidence: 0.9,
        label: 'Zone suggérée 1'
      })
    })

    it('should handle suggestion errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Suggestion Error'))

      const result = await ocrZonesService.suggestZones(mockFile)

      expect(result.success).toBe(false)
      expect(result.suggestedZones).toEqual([])
    })
  })
})