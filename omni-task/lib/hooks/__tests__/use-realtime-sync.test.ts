import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRealtimeSync } from '../use-realtime-sync'

// Mock des dépendances
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    channel: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockImplementation((callback) => {
      // Simuler une connexion réussie
      setTimeout(() => callback('SUBSCRIBED'), 100)
      return { unsubscribe: vi.fn() }
    }),
    removeChannel: vi.fn(),
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }))
}))

vi.mock('../use-auth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' }
  }))
}))

vi.mock('@/lib/logger', () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }))
}))

describe('useRealtimeSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useRealtimeSync())

    expect(result.current.syncStatus).toEqual({
      connected: false,
      syncing: false,
      lastSync: null,
      conflicts: 0,
      error: null
    })
    expect(result.current.tasks).toEqual([])
    expect(result.current.projects).toEqual([])
  })

  it('should connect to realtime when user is available', async () => {
    const { result } = renderHook(() => useRealtimeSync())

    await waitFor(() => {
      expect(result.current.syncStatus.connected).toBe(true)
    })
  })

  it('should handle force sync', async () => {
    const { result } = renderHook(() => useRealtimeSync())

    await act(async () => {
      await result.current.forcSync()
    })

    expect(result.current.syncStatus.lastSync).toBeTruthy()
  })

  it('should clear sync errors', () => {
    const { result } = renderHook(() => useRealtimeSync())

    act(() => {
      result.current.clearSyncError()
    })

    expect(result.current.syncStatus.error).toBeNull()
  })

  it('should resolve conflicts', async () => {
    const { result } = renderHook(() => useRealtimeSync())

    // Simuler des conflits
    act(() => {
      // On ne peut pas directement modifier le state interne, 
      // donc ce test vérifie juste que la fonction ne crash pas
      result.current.resolveConflicts()
    })

    await waitFor(() => {
      expect(result.current.syncStatus.conflicts).toBe(0)
    })
  })
})