import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from '../useFileUpload'

// Mock du service avec hoisting correct
vi.mock('@/services/upload.service', () => ({
  uploadService: {
    upload: vi.fn(),
    pollJobStatus: vi.fn()
  }
}))

// Récupérer les mocks après les avoir définis
import { uploadService } from '@/services/upload.service'
const mockUploadService = vi.mocked(uploadService)

describe('useFileUpload', () => {
  const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with clean state', () => {
      const { result } = renderHook(() => useFileUpload())

      expect(result.current.isUploading).toBe(false)
      expect(result.current.progress).toBe(0)
      expect(result.current.jobStatus).toBeNull()
      expect(result.current.result).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.fileName).toBeNull()
      expect(result.current.hasResult).toBe(false)
      expect(result.current.hasError).toBe(false)
    })
  })

  describe('demo mode upload', () => {
    it('should handle demo upload without calling service', async () => {
      const onSuccess = vi.fn()
      const { result } = renderHook(() => useFileUpload({
        mode: 'demo',
        onSuccess
      }))

      let uploadResult: any = null
      await act(async () => {
        uploadResult = await result.current.uploadFile(mockFile)
      })

      expect(mockUploadService.upload).not.toHaveBeenCalled()
      expect(uploadResult).toBeTruthy()
      expect(uploadResult.filename).toBe('test.pdf')
      expect(result.current.result).toBe(uploadResult)
      expect(result.current.isUploading).toBe(false)
      expect(result.current.progress).toBe(100)
      expect(onSuccess).toHaveBeenCalledWith(uploadResult)
    })

    it('should simulate progress during demo upload', async () => {
      const onProgress = vi.fn()
      const { result } = renderHook(() => useFileUpload({
        mode: 'demo',
        onProgress
      }))

      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      expect(onProgress).toHaveBeenCalledTimes(6) // 0-5 steps
      expect(onProgress).toHaveBeenLastCalledWith(100)
    })
  })

  describe('real upload', () => {
    it('should handle successful upload', async () => {
      const mockResult = { filename: 'test.pdf', text: 'extracted text' }
      mockUploadService.upload.mockResolvedValue(mockResult)

      const onSuccess = vi.fn()
      const { result } = renderHook(() => useFileUpload({ onSuccess }))

      let uploadResult: any = null
      await act(async () => {
        uploadResult = await result.current.uploadFile(mockFile)
      })

      expect(mockUploadService.upload).toHaveBeenCalledWith(
        mockFile,
        {},
        expect.any(Function)
      )
      expect(uploadResult).toBe(mockResult)
      expect(result.current.result).toBe(mockResult)
      expect(result.current.isUploading).toBe(false)
      expect(result.current.hasResult).toBe(true)
      expect(onSuccess).toHaveBeenCalledWith(mockResult)
    })

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed')
      mockUploadService.upload.mockRejectedValue(error)

      const onError = vi.fn()
      const { result } = renderHook(() => useFileUpload({ onError }))

      let uploadResult: any = null
      await act(async () => {
        uploadResult = await result.current.uploadFile(mockFile)
      })

      expect(uploadResult).toBeNull()
      expect(result.current.error).toBe('Upload failed')
      expect(result.current.isUploading).toBe(false)
      expect(result.current.hasError).toBe(true)
      expect(onError).toHaveBeenCalledWith('Upload failed')
    })

    it('should handle progress callbacks', async () => {
      const mockResult = { filename: 'test.pdf', text: 'extracted text' }
      mockUploadService.upload.mockImplementation((file, options, onProgress) => {
        // Simulate progress
        onProgress({ loaded: 50, total: 100 })
        onProgress({ loaded: 100, total: 100 })
        return Promise.resolve(mockResult)
      })

      const onProgress = vi.fn()
      const { result } = renderHook(() => useFileUpload({ onProgress }))

      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      expect(onProgress).toHaveBeenCalledWith(50)
      expect(onProgress).toHaveBeenCalledWith(100)
    })
  })

  describe('caching', () => {
    it('should cache and return cached results', async () => {
      const mockResult = { filename: 'test.pdf', text: 'cached content' }
      mockUploadService.upload.mockResolvedValue(mockResult)

      const { result } = renderHook(() => useFileUpload({ enableCache: true }))

      // First upload
      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      expect(mockUploadService.upload).toHaveBeenCalledTimes(1)

      // Second upload should use cache
      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      expect(mockUploadService.upload).toHaveBeenCalledTimes(1) // Still only called once
      expect(result.current.result).toBe(mockResult)
    })

    it('should not cache when disabled', async () => {
      const mockResult = { filename: 'test.pdf', text: 'no cache' }
      mockUploadService.upload.mockResolvedValue(mockResult)

      const { result } = renderHook(() => useFileUpload({ enableCache: false }))

      // First upload
      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      // Second upload should call service again
      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      expect(mockUploadService.upload).toHaveBeenCalledTimes(2)
    })

    it('should clear cache when requested', async () => {
      const mockResult = { filename: 'test.pdf', text: 'cached content' }
      mockUploadService.upload.mockResolvedValue(mockResult)

      const { result } = renderHook(() => useFileUpload({ enableCache: true }))

      // First upload
      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      // Clear cache
      act(() => {
        result.current.clearCache()
      })

      // Second upload should call service again
      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      expect(mockUploadService.upload).toHaveBeenCalledTimes(2)
    })
  })

  describe('reset functionality', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useFileUpload({ mode: 'demo' }))

      // Upload to set state
      await act(async () => {
        await result.current.uploadFile(mockFile)
      })

      expect(result.current.hasResult).toBe(true)
      expect(result.current.fileName).toBe('test.pdf')

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.isUploading).toBe(false)
      expect(result.current.progress).toBe(0)
      expect(result.current.result).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.fileName).toBeNull()
      expect(result.current.hasResult).toBe(false)
    })
  })
})