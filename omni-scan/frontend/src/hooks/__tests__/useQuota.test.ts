import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuota } from '../useQuota'

// Mock du service avec hoisting correct
vi.mock('@/services/upload.service', () => ({
  uploadService: {
    checkQuota: vi.fn()
  }
}))

// Récupérer les mocks après les avoir définis
import { uploadService } from '@/services/upload.service'
const mockUploadService = vi.mocked(uploadService)

describe('useQuota', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default quota values', () => {
      const { result } = renderHook(() => useQuota())

      expect(result.current.quota).toEqual({
        used: 0,
        limit: 3,
        isSubscribed: false,
        remaining: 3
      })
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should calculate helpers correctly', () => {
      const { result } = renderHook(() => useQuota())

      expect(result.current.isQuotaExceeded).toBe(false)
      expect(result.current.quotaPercentage).toBe(0)
      expect(result.current.isSubscribed).toBe(false)
    })
  })

  describe('checkQuota', () => {
    it('should update quota on successful check', async () => {
      const mockQuota = { used: 2, limit: 3, isSubscribed: false, remaining: 1 }
      mockUploadService.checkQuota.mockResolvedValue(mockQuota)

      const { result } = renderHook(() => useQuota({ autoCheck: false }))

      await act(async () => {
        await result.current.checkQuota()
      })

      expect(result.current.quota).toEqual(mockQuota)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error')
      mockUploadService.checkQuota.mockRejectedValue(error)

      const { result } = renderHook(() => useQuota({ autoCheck: false }))
      const initialQuota = result.current.quota

      await act(async () => {
        await result.current.checkQuota()
      })

      expect(result.current.quota).toEqual(initialQuota)
      expect(result.current.error).toBe('Network error')
      expect(result.current.isLoading).toBe(false)
    })

    it('should set loading state during check', async () => {
      mockUploadService.checkQuota.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ used: 1, limit: 3, isSubscribed: false, remaining: 2 }), 100))
      )

      const { result } = renderHook(() => useQuota({ autoCheck: false }))

      act(() => {
        result.current.checkQuota()
      })

      expect(result.current.isLoading).toBe(true)

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150))
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('canUpload', () => {
    it('should allow upload for subscribed users', () => {
      const { result } = renderHook(() => useQuota())

      act(() => {
        result.current.checkQuota = vi.fn().mockResolvedValue({ used: 100, limit: 3, isSubscribed: true, remaining: 0 })
      })

      expect(result.current.canUpload()).toBe(true)
    })

    it('should allow upload when under quota limit', async () => {
      const mockQuota = { used: 1, limit: 3, isSubscribed: false, remaining: 2 }
      mockUploadService.checkQuota.mockResolvedValue(mockQuota)

      const { result } = renderHook(() => useQuota())

      await act(async () => {
        await result.current.checkQuota()
      })

      expect(result.current.canUpload()).toBe(true)
    })

    it('should prevent upload when quota exceeded', async () => {
      const mockQuota = { used: 3, limit: 3, isSubscribed: false, remaining: 0 }
      mockUploadService.checkQuota.mockResolvedValue(mockQuota)

      const onQuotaExceeded = vi.fn()
      const { result } = renderHook(() => useQuota({ onQuotaExceeded }))

      await act(async () => {
        await result.current.checkQuota()
      })

      const canUpload = result.current.canUpload()

      expect(canUpload).toBe(false)
      expect(onQuotaExceeded).toHaveBeenCalled()
    })
  })

  describe('consumeQuota', () => {
    it('should consume quota for free users', async () => {
      const mockQuota = { used: 1, limit: 3, isSubscribed: false, remaining: 2 }
      mockUploadService.checkQuota.mockResolvedValue(mockQuota)

      const { result } = renderHook(() => useQuota())

      await act(async () => {
        await result.current.checkQuota()
      })

      act(() => {
        result.current.consumeQuota()
      })

      expect(result.current.quota.used).toBe(2)
      expect(result.current.quota.remaining).toBe(1)
    })

    it('should not consume quota for subscribed users', async () => {
      const mockQuota = { used: 10, limit: 100, isSubscribed: true, remaining: 90 }
      mockUploadService.checkQuota.mockResolvedValue(mockQuota)

      const { result } = renderHook(() => useQuota())

      await act(async () => {
        await result.current.checkQuota()
      })

      act(() => {
        result.current.consumeQuota()
      })

      expect(result.current.quota.used).toBe(10) // Unchanged
      expect(result.current.quota.remaining).toBe(90) // Unchanged
    })
  })

  describe('helpers', () => {
    it('should calculate quota percentage correctly', async () => {
      const mockQuota = { used: 2, limit: 5, isSubscribed: false, remaining: 3 }
      mockUploadService.checkQuota.mockResolvedValue(mockQuota)

      const { result } = renderHook(() => useQuota())

      await act(async () => {
        await result.current.checkQuota()
      })

      expect(result.current.quotaPercentage).toBe(40) // 2/5 * 100
    })

    it('should identify quota exceeded state', async () => {
      const mockQuota = { used: 3, limit: 3, isSubscribed: false, remaining: 0 }
      mockUploadService.checkQuota.mockResolvedValue(mockQuota)

      const { result } = renderHook(() => useQuota())

      await act(async () => {
        await result.current.checkQuota()
      })

      expect(result.current.isQuotaExceeded).toBe(true)
    })
  })
})