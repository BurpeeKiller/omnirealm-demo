import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '../auth.service'

// Mock Supabase
const mockSupabase = {
  auth: {
    onAuthStateChange: vi.fn(),
    getSession: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn()
  },
  from: vi.fn(() => ({
    insert: vi.fn()
  }))
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabase)
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { origin: 'http://localhost:3000' }
    })

    // Setup default session mock
    mockSupabase.auth.getSession.mockResolvedValue({ 
      data: { session: null }, 
      error: null 
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should setup auth state change listener', () => {
      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      )
    })

    it('should restore session on startup', () => {
      expect(mockSupabase.auth.getSession).toHaveBeenCalled()
    })

    it('should initialize with no user', () => {
      expect(authService.user).toBeNull()
      expect(authService.session).toBeNull()
      expect(authService.isAuthenticated).toBe(false)
    })
  })

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const mockUser = { 
        id: 'user-1', 
        email: 'test@example.com',
        created_at: '2023-01-01'
      }
      
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock profile creation
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      })

      const result = await authService.signUp('test@example.com', 'password123')

      expect(result.data).toEqual(mockUser)
      expect(result.error).toBeUndefined()
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
          data: { app: 'omnifit' }
        }
      })
    })

    it('should handle signup errors', async () => {
      const mockError = { message: 'Invalid email', status: '400' }
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await authService.signUp('invalid-email', 'password123')

      expect(result.error).toEqual({ 
        message: 'Invalid email', 
        code: '400' 
      })
      expect(result.data).toBeUndefined()
    })

    it('should create user profile after successful signup', async () => {
      const mockUser = { 
        id: 'user-1', 
        email: 'test@example.com' 
      }
      
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const insertMock = vi.fn().mockResolvedValue({ data: null, error: null })
      mockSupabase.from.mockReturnValue({ insert: insertMock })

      await authService.signUp('test@example.com', 'password123')

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(insertMock).toHaveBeenCalledWith({
        id: 'user-1',
        email: 'test@example.com',
        app: 'omnifit',
        created_at: expect.any(String)
      })
    })

    it('should handle exceptions during signup', async () => {
      mockSupabase.auth.signUp.mockRejectedValue(new Error('Network error'))

      const result = await authService.signUp('test@example.com', 'password123')

      expect(result.error?.message).toBe('Network error')
    })
  })

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = { 
        id: 'user-1', 
        email: 'test@example.com' 
      }
      
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const result = await authService.signIn('test@example.com', 'password123')

      expect(result.data).toEqual(mockUser)
      expect(result.error).toBeUndefined()
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('should handle signin errors', async () => {
      const mockError = { message: 'Invalid credentials', status: '401' }
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await authService.signIn('test@example.com', 'wrongpassword')

      expect(result.error).toEqual({ 
        message: 'Invalid credentials', 
        code: '401' 
      })
      expect(result.data).toBeUndefined()
    })

    it('should handle exceptions during signin', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValue(new Error('Service unavailable'))

      const result = await authService.signIn('test@example.com', 'password123')

      expect(result.error?.message).toBe('Service unavailable')
    })
  })

  describe('signInWithProvider', () => {
    it('should sign in with Google successfully', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: null })

      const result = await authService.signInWithProvider('google')

      expect(result.data).toBe(true)
      expect(result.error).toBeUndefined()
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        }
      })
    })

    it('should sign in with GitHub successfully', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: null })

      const result = await authService.signInWithProvider('github')

      expect(result.data).toBe(true)
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        }
      })
    })

    it('should handle OAuth errors', async () => {
      const mockError = { message: 'Provider not configured' }
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: mockError })

      const result = await authService.signInWithProvider('google')

      expect(result.error?.message).toBe('Provider not configured')
      expect(result.data).toBeUndefined()
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      localStorage.setItem('omnifit_token', 'test-token')
      localStorage.setItem('omnifit_user', 'test-user')

      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      const result = await authService.signOut()

      expect(result.data).toBe(true)
      expect(result.error).toBeUndefined()
      expect(localStorage.getItem('omnifit_token')).toBeNull()
      expect(localStorage.getItem('omnifit_user')).toBeNull()
    })

    it('should handle signout errors', async () => {
      const mockError = { message: 'Signout failed' }
      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError })

      const result = await authService.signOut()

      expect(result.error?.message).toBe('Signout failed')
      expect(result.data).toBeUndefined()
    })

    it('should handle exceptions during signout', async () => {
      mockSupabase.auth.signOut.mockRejectedValue(new Error('Network error'))

      const result = await authService.signOut()

      expect(result.error?.message).toBe('Network error')
    })
  })

  describe('resetPassword', () => {
    it('should send reset password email successfully', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null })

      const result = await authService.resetPassword('test@example.com')

      expect(result.data).toBe(true)
      expect(result.error).toBeUndefined()
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: 'http://localhost:3000/auth/reset-password' }
      )
    })

    it('should handle reset password errors', async () => {
      const mockError = { message: 'Email not found' }
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: mockError })

      const result = await authService.resetPassword('notfound@example.com')

      expect(result.error?.message).toBe('Email not found')
      expect(result.data).toBeUndefined()
    })
  })

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const result = await authService.updatePassword('newpassword123')

      expect(result.data).toEqual(mockUser)
      expect(result.error).toBeUndefined()
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123'
      })
    })

    it('should handle update password errors', async () => {
      const mockError = { message: 'Invalid session' }
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: null },
        error: mockError
      })

      const result = await authService.updatePassword('newpassword123')

      expect(result.error?.message).toBe('Invalid session')
      expect(result.data).toBeUndefined()
    })
  })

  describe('auth state management', () => {
    it('should update state when auth changes', () => {
      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      })

      const mockUser = { id: 'user-1', email: 'test@example.com' }
      const mockSession = { 
        user: mockUser, 
        access_token: 'test-token',
        expires_at: Date.now() + 3600000
      }

      // Simulate auth state change
      authCallback('SIGNED_IN', mockSession)

      expect(authService.user).toEqual(mockUser)
      expect(authService.session).toEqual(mockSession)
      expect(authService.isAuthenticated).toBe(true)
      expect(localStorage.getItem('omnifit_token')).toBe('test-token')
    })

    it('should clear state when user signs out', () => {
      let authCallback: (event: string, session: any) => void = () => {}
      
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: { unsubscribe: vi.fn() } } }
      })

      // Set initial auth state
      const mockSession = { 
        user: { id: 'user-1' }, 
        access_token: 'test-token' 
      }
      authCallback('SIGNED_IN', mockSession)

      // Sign out
      authCallback('SIGNED_OUT', null)

      expect(authService.user).toBeNull()
      expect(authService.session).toBeNull()
      expect(authService.isAuthenticated).toBe(false)
      expect(localStorage.getItem('omnifit_token')).toBeNull()
    })
  })

  describe('profile creation', () => {
    it('should handle profile creation errors gracefully', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      // Mock profile creation failure
      const insertMock = vi.fn().mockRejectedValue(new Error('Database error'))
      mockSupabase.from.mockReturnValue({ insert: insertMock })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Should still succeed even if profile creation fails
      const result = await authService.signUp('test@example.com', 'password123')

      expect(result.data).toEqual(mockUser)
      expect(consoleSpy).toHaveBeenCalledWith('Erreur création profil:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})