import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    localStorage.clear()
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false
    })
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useAuthStore())
      
      expect(result.current.token).toBeNull()
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('setAuth', () => {
    it('should set authentication data correctly', () => {
      const { result } = renderHook(() => useAuthStore())
      const mockToken = 'test-token-123'
      const mockUser = {
        email: 'test@example.com',
        scans_used: 5,
        scans_limit: 100,
        is_pro: true
      }

      act(() => {
        result.current.setAuth(mockToken, mockUser)
      })

      expect(result.current.token).toBe(mockToken)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should persist auth data to localStorage', () => {
      const { result } = renderHook(() => useAuthStore())
      const mockToken = 'persistent-token'
      const mockUser = {
        email: 'persist@example.com',
        scans_used: 0,
        scans_limit: 10,
        is_pro: false
      }

      act(() => {
        result.current.setAuth(mockToken, mockUser)
      })

      // Check localStorage
      const storedData = localStorage.getItem('omniscan-auth')
      expect(storedData).toBeTruthy()
      
      const parsed = JSON.parse(storedData!)
      expect(parsed.state.token).toBe(mockToken)
      expect(parsed.state.user).toEqual(mockUser)
      expect(parsed.state.isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('should clear all auth data', () => {
      const { result } = renderHook(() => useAuthStore())
      
      // First set auth
      act(() => {
        result.current.setAuth('token', {
          email: 'test@example.com',
          scans_used: 5,
          scans_limit: 100,
          is_pro: true
        })
      })

      // Then logout
      act(() => {
        result.current.logout()
      })

      expect(result.current.token).toBeNull()
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should clear persisted data from localStorage', () => {
      const { result } = renderHook(() => useAuthStore())
      
      // Set auth first
      act(() => {
        result.current.setAuth('token', {
          email: 'test@example.com',
          scans_used: 5,
          scans_limit: 100,
          is_pro: true
        })
      })

      // Logout
      act(() => {
        result.current.logout()
      })

      const storedData = localStorage.getItem('omniscan-auth')
      if (storedData) {
        const parsed = JSON.parse(storedData)
        expect(parsed.state.token).toBeNull()
        expect(parsed.state.user).toBeNull()
        expect(parsed.state.isAuthenticated).toBe(false)
      }
    })
  })

  describe('updateUsage', () => {
    it('should update user scans_used count', () => {
      const { result } = renderHook(() => useAuthStore())
      const initialUser = {
        email: 'test@example.com',
        scans_used: 5,
        scans_limit: 100,
        is_pro: true
      }

      act(() => {
        result.current.setAuth('token', initialUser)
      })

      act(() => {
        result.current.updateUsage(10)
      })

      expect(result.current.user?.scans_used).toBe(10)
      expect(result.current.user?.email).toBe(initialUser.email)
      expect(result.current.user?.scans_limit).toBe(initialUser.scans_limit)
      expect(result.current.user?.is_pro).toBe(initialUser.is_pro)
    })

    it('should handle updateUsage when user is null', () => {
      const { result } = renderHook(() => useAuthStore())

      // Ensure no user is set
      expect(result.current.user).toBeNull()

      act(() => {
        result.current.updateUsage(10)
      })

      // Should remain null and not throw error
      expect(result.current.user).toBeNull()
    })

    it('should persist usage updates', () => {
      const { result } = renderHook(() => useAuthStore())
      
      act(() => {
        result.current.setAuth('token', {
          email: 'test@example.com',
          scans_used: 5,
          scans_limit: 100,
          is_pro: true
        })
      })

      act(() => {
        result.current.updateUsage(15)
      })

      const storedData = localStorage.getItem('omniscan-auth')
      expect(storedData).toBeTruthy()
      
      const parsed = JSON.parse(storedData!)
      expect(parsed.state.user.scans_used).toBe(15)
    })
  })

  describe('quota management', () => {
    it('should correctly identify when user is at quota limit', () => {
      const { result } = renderHook(() => useAuthStore())
      
      act(() => {
        result.current.setAuth('token', {
          email: 'test@example.com',
          scans_used: 10,
          scans_limit: 10,
          is_pro: false
        })
      })

      const isAtLimit = result.current.user!.scans_used >= result.current.user!.scans_limit
      expect(isAtLimit).toBe(true)
    })

    it('should handle pro users with higher limits', () => {
      const { result } = renderHook(() => useAuthStore())
      
      act(() => {
        result.current.setAuth('token', {
          email: 'pro@example.com',
          scans_used: 50,
          scans_limit: 1000,
          is_pro: true
        })
      })

      const hasQuotaRemaining = result.current.user!.scans_used < result.current.user!.scans_limit
      expect(hasQuotaRemaining).toBe(true)
      expect(result.current.user!.is_pro).toBe(true)
    })
  })
})