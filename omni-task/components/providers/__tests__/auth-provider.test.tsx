import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { AuthProvider } from '../auth-provider'
import { useRouter } from 'next/navigation'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    onAuthStateChange: vi.fn()
  }
}

vi.mock('@/lib/supabase/client', () => ({
  supabase: mockSupabase
}))

// Mock task store
const mockTaskStore = {
  fetchTasks: vi.fn(),
  reset: vi.fn()
}

vi.mock('@/lib/store/task-store', () => ({
  useTaskStore: vi.fn((selector) => selector(mockTaskStore))
}))

// Mock logger
vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  })
}))

describe('AuthProvider', () => {
  const mockPush = vi.fn()
  const mockUnsubscribe = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup router mock
    ;(useRouter as any).mockReturnValue({
      push: mockPush
    })

    // Setup auth state change subscription mock
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: mockUnsubscribe
        }
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should render children', () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      const { getByText } = render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      expect(getByText('Test Child')).toBeTruthy()
    })

    it('should load initial data when user is authenticated', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: mockUser }, 
        error: null 
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      // Wait for useEffect to complete
      await vi.waitFor(() => {
        expect(mockSupabase.auth.getUser).toHaveBeenCalled()
        expect(mockTaskStore.fetchTasks).toHaveBeenCalled()
      })
    })

    it('should not load data when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      await vi.waitFor(() => {
        expect(mockSupabase.auth.getUser).toHaveBeenCalled()
        expect(mockTaskStore.fetchTasks).not.toHaveBeenCalled()
      })
    })

    it('should handle errors when loading initial data', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: mockUser }, 
        error: null 
      })
      
      const mockError = new Error('Failed to fetch tasks')
      mockTaskStore.fetchTasks.mockRejectedValue(mockError)

      // Should not throw error
      expect(() => {
        render(
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        )
      }).not.toThrow()

      await vi.waitFor(() => {
        expect(mockTaskStore.fetchTasks).toHaveBeenCalled()
      })
    })
  })

  describe('auth state change handling', () => {
    it('should setup auth state change listener', () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      )
    })

    it('should handle SIGNED_IN event', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        }
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      // Simulate sign in
      const mockSession = { user: { id: 'user-1' }, access_token: 'token' }
      await authCallback('SIGNED_IN', mockSession)

      expect(mockTaskStore.fetchTasks).toHaveBeenCalled()
    })

    it('should handle SIGNED_OUT event', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        }
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      // Simulate sign out
      await authCallback('SIGNED_OUT', null)

      expect(mockTaskStore.reset).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should ignore other auth events', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        }
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      // Simulate other event
      await authCallback('TOKEN_REFRESHED', { user: { id: 'user-1' } })

      // Should not trigger actions for other events
      expect(mockTaskStore.fetchTasks).not.toHaveBeenCalled()
      expect(mockTaskStore.reset).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    it('should unsubscribe from auth changes on unmount', () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      const { unmount } = render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })

    it('should handle multiple mount/unmount cycles', () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      const { unmount: unmount1 } = render(
        <AuthProvider>
          <div>Test Child 1</div>
        </AuthProvider>
      )

      const { unmount: unmount2 } = render(
        <AuthProvider>
          <div>Test Child 2</div>
        </AuthProvider>
      )

      unmount1()
      unmount2()

      expect(mockUnsubscribe).toHaveBeenCalledTimes(2)
    })
  })

  describe('error scenarios', () => {
    it('should handle Supabase auth errors gracefully', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Auth service unavailable'))

      // Should not throw
      expect(() => {
        render(
          <AuthProvider>
            <div>Test Child</div>
          </AuthProvider>
        )
      }).not.toThrow()
    })

    it('should handle task fetching errors during sign in', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      mockTaskStore.fetchTasks.mockRejectedValue(new Error('Task fetch failed'))

      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        }
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      // Should handle error gracefully
      expect(async () => {
        await authCallback('SIGNED_IN', { user: { id: 'user-1' } })
      }).not.toThrow()
    })

    it('should handle router navigation errors', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      mockPush.mockRejectedValue(new Error('Navigation failed'))

      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        }
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      // Should handle navigation error gracefully
      expect(async () => {
        await authCallback('SIGNED_OUT', null)
      }).not.toThrow()
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete auth flow', async () => {
      // Initial state - not authenticated
      mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: null }, 
        error: null 
      })

      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } }
        }
      })

      render(
        <AuthProvider>
          <div>Test Child</div>
        </AuthProvider>
      )

      // User signs in
      const mockSession = { user: { id: 'user-1' }, access_token: 'token' }
      await authCallback('SIGNED_IN', mockSession)

      expect(mockTaskStore.fetchTasks).toHaveBeenCalledTimes(1)

      // User signs out
      await authCallback('SIGNED_OUT', null)

      expect(mockTaskStore.reset).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})