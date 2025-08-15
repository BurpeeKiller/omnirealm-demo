import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNetworkStatus } from '../use-network-status'

// Mock des APIs du navigateur
const mockConnection = {
  type: 'wifi',
  effectiveType: '4g',
  downlink: 10,
  rtt: 50,
  saveData: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

beforeEach(() => {
  vi.clearAllMocks()
  
  // Mock navigator
  Object.defineProperty(global, 'navigator', {
    value: {
      onLine: true,
      connection: mockConnection
    },
    writable: true
  })

  // Mock window events
  Object.defineProperty(global, 'window', {
    value: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    },
    writable: true
  })
})

describe('useNetworkStatus', () => {
  it('should initialize with online status', () => {
    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isOnline).toBe(true)
    expect(result.current.isOffline).toBe(false)
    expect(result.current.networkStatus.online).toBe(true)
  })

  it('should detect offline status', () => {
    // Simuler offline
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isOffline).toBe(true)
    expect(result.current.isOnline).toBe(false)
  })

  it('should detect slow connections', () => {
    // Simuler une connexion lente
    const slowConnection = {
      ...mockConnection,
      effectiveType: '2g',
      downlink: 0.5,
      rtt: 500
    }

    Object.defineProperty(global.navigator, 'connection', {
      value: slowConnection,
      writable: true
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.isSlowConnection).toBe(true)
    expect(result.current.canSync).toBe(false)
  })

  it('should allow sync on good connections', () => {
    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.canSync).toBe(true)
  })

  it('should handle reconnect attempts', () => {
    const { result } = renderHook(() => useNetworkStatus())

    act(() => {
      result.current.reconnect()
    })

    // Vérifier que la fonction ne crash pas
    expect(result.current.reconnect).toBeDefined()
  })

  it('should respect data saver mode', () => {
    const dataSaverConnection = {
      ...mockConnection,
      saveData: true
    }

    Object.defineProperty(global.navigator, 'connection', {
      value: dataSaverConnection,
      writable: true
    })

    const { result } = renderHook(() => useNetworkStatus())

    expect(result.current.networkStatus.saveData).toBe(true)
    expect(result.current.canSync).toBe(false)
  })
})