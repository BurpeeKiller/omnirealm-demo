import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../page'
import { useRouter } from 'next/navigation'
import { useToastStore } from '@/lib/store/toast-store'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

// Mock du store toast
vi.mock('@/lib/store/toast-store')

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn()
    }
  }
}))

// Import après les mocks
import { supabase } from '@/lib/supabase/client'

// Mock du composant Logo
vi.mock('@/components/logo', () => ({
  Logo: ({ className }: any) => <div className={className}>Logo</div>
}))

// Mock window.location
delete (window as any).location
window.location = { href: '' } as any

describe('LoginPage', () => {
  const mockPush = vi.fn()
  const mockRefresh = vi.fn()
  const mockSuccess = vi.fn()
  const mockError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    window.location.href = ''
    ;(useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh
    })
    ;(useToastStore as any).mockReturnValue({
      success: mockSuccess,
      error: mockError
    })
  })

  describe('Vérification d\'authentification', () => {
    it('devrait rediriger vers le dashboard si déjà connecté', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: { user: { id: '1' } } as any },
        error: null
      })

      render(<LoginPage />)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('devrait afficher le formulaire si non connecté', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })

      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByText('Connexion')).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
      })
    })

    it('devrait afficher un loader pendant la vérification', () => {
      vi.mocked(supabase.auth.getSession).mockImplementation(
        () => new Promise(() => {}) // Ne jamais résoudre
      )

      render(<LoginPage />)

      expect(screen.getByText('Chargement...')).toBeInTheDocument()
    })
  })

  describe('Formulaire de connexion', () => {
    beforeEach(async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      })
    })

    it('devrait permettre de saisir email et mot de passe', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/mot de passe/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })

    it('devrait connecter l\'utilisateur avec succès', async () => {
      const user = userEvent.setup()
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: { id: '1' }, session: {} } as any,
        error: null
      })
      
      vi.mocked(supabase.auth.getSession)
        .mockResolvedValueOnce({ data: { session: null }, error: null })
        .mockResolvedValueOnce({ data: { session: { user: { id: '1' } } as any } as any, error: null })

      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /se connecter/i }))

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        })
        expect(mockSuccess).toHaveBeenCalledWith('Connexion réussie !')
        expect(mockRefresh).toHaveBeenCalled()
        expect(window.location.href).toBe('/dashboard')
      })
    })

    it('devrait afficher une erreur en cas d\'échec de connexion', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Invalid login credentials'
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: errorMessage } as any
      })

      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /se connecter/i }))

      await waitFor(() => {
        expect(mockError).toHaveBeenCalledWith(errorMessage)
      })
    })

    it('devrait afficher une erreur si la session n\'est pas établie', async () => {
      const user = userEvent.setup()
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: { id: '1' }, session: {} } as any,
        error: null
      })
      
      vi.mocked(supabase.auth.getSession)
        .mockResolvedValue({ data: { session: null }, error: null })

      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /se connecter/i }))

      await waitFor(() => {
        expect(mockError).toHaveBeenCalledWith('Session non établie après connexion')
      })
    })

    it('devrait désactiver les champs pendant le chargement', async () => {
      const user = userEvent.setup()
      
      vi.mocked(supabase.auth.signInWithPassword).mockImplementation(
        () => new Promise(() => {}) // Ne jamais résoudre
      )

      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })

      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /se connecter/i }))

      expect(screen.getByLabelText(/email/i)).toBeDisabled()
      expect(screen.getByLabelText(/mot de passe/i)).toBeDisabled()
      expect(screen.getByRole('button', { name: /connexion.../i })).toBeDisabled()
    })

    it('devrait avoir un lien vers la page d\'inscription', async () => {
      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })

      const registerLink = screen.getByRole('link', { name: /créer un compte/i })
      expect(registerLink).toHaveAttribute('href', '/register')
    })

    it('devrait valider que l\'email est requis', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      })

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      expect(emailInput.required).toBe(true)
    })

    it('devrait valider que le mot de passe est requis', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      await waitFor(() => {
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
      })

      const passwordInput = screen.getByLabelText(/mot de passe/i) as HTMLInputElement
      expect(passwordInput.required).toBe(true)
    })
  })
})