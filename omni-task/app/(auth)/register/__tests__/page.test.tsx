import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '../page'
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
      signUp: vi.fn(),
      getUser: vi.fn()
    },
    from: vi.fn(),
    rpc: vi.fn()
  }
}))

// Import après les mocks
import { supabase } from '@/lib/supabase/client'

// Mock du composant Logo
vi.mock('@/components/logo', () => ({
  Logo: ({ className }: any) => <div className={className}>Logo</div>
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: { origin: 'http://localhost:3000' },
  writable: true
})

describe('RegisterPage', () => {
  const mockPush = vi.fn()
  const mockSuccess = vi.fn()
  const mockError = vi.fn()
  const mockInsert = vi.fn()
  const mockSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue({
      push: mockPush
    })
    ;(useToastStore as any).mockReturnValue({
      success: mockSuccess,
      error: mockError
    })
    
    // Mock chaînable pour Supabase
    mockSelect.mockReturnValue({
      data: null,
      error: null
    })
    
    mockInsert.mockReturnValue({
      select: mockSelect
    })
    
    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert
    } as any)
  })

  describe('Affichage du formulaire', () => {
    it('devrait afficher tous les champs du formulaire', () => {
      render(<RegisterPage />)
      
      expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /créer mon compte/i })).toBeInTheDocument()
    })

    it('devrait afficher le titre et la description', () => {
      render(<RegisterPage />)
      
      expect(screen.getByText('Créer un compte')).toBeInTheDocument()
      expect(screen.getByText('Rejoignez OmniTask pour gérer vos projets intelligemment')).toBeInTheDocument()
    })

    it('devrait afficher le lien vers la page de connexion', () => {
      render(<RegisterPage />)
      
      const loginLink = screen.getByRole('link', { name: /se connecter/i })
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('devrait afficher l\'indication de longueur minimale du mot de passe', () => {
      render(<RegisterPage />)
      
      expect(screen.getByText('Minimum 6 caractères')).toBeInTheDocument()
    })
  })

  describe('Validation du formulaire', () => {
    it('devrait valider que tous les champs sont requis', () => {
      render(<RegisterPage />)
      
      const nameInput = screen.getByLabelText(/nom complet/i) as HTMLInputElement
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
      const passwordInput = screen.getByLabelText(/mot de passe/i) as HTMLInputElement
      
      expect(nameInput.required).toBe(true)
      expect(emailInput.required).toBe(true)
      expect(passwordInput.required).toBe(true)
    })

    it('devrait valider la longueur minimale du mot de passe', () => {
      render(<RegisterPage />)
      
      const passwordInput = screen.getByLabelText(/mot de passe/i) as HTMLInputElement
      expect(passwordInput.minLength).toBe(6)
    })
  })

  describe('Inscription réussie', () => {
    it('devrait créer un compte avec succès', async () => {
      const user = userEvent.setup()
      const mockUser = { id: 'user123', email: 'test@example.com' }
      
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: {} } as any,
        error: null
      })
      
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser } as any,
        error: null
      })
      
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      })
      
      render(<RegisterPage />)
      
      // Remplir le formulaire
      await user.type(screen.getByLabelText(/nom complet/i), 'Jean Dupont')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      
      // Soumettre
      await user.click(screen.getByRole('button', { name: /créer mon compte/i }))
      
      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: { full_name: 'Jean Dupont' },
            emailRedirectTo: 'http://localhost:3000/auth/callback'
          }
        })
        
        expect(supabase.rpc).toHaveBeenCalledWith('create_user_profile', {
          p_user_id: 'user123',
          p_email: 'test@example.com',
          p_full_name: 'Jean Dupont',
          p_application_id: 'omnitask'
        })
        
        expect(mockSuccess).toHaveBeenCalledWith('Compte créé ! Vérifiez votre email pour confirmer.')
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('devrait utiliser le fallback si la fonction RPC échoue', async () => {
      const user = userEvent.setup()
      const mockUser = { id: 'user123', email: 'test@example.com' }
      
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: {} } as any,
        error: null
      })
      
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser } as any,
        error: null
      })
      
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: { message: 'RPC failed' } as any,
        count: null,
        status: 500,
        statusText: 'Internal Server Error'
      })
      
      render(<RegisterPage />)
      
      await user.type(screen.getByLabelText(/nom complet/i), 'Jean Dupont')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /créer mon compte/i }))
      
      await waitFor(() => {
        // Vérifier que les insertions manuelles ont été appelées
        expect(mockInsert).toHaveBeenCalledWith({
          id: 'user123',
          email: 'test@example.com',
          full_name: 'Jean Dupont'
        })
        
        expect(mockInsert).toHaveBeenCalledWith({
          user_id: 'user123',
          application_id: 'omnitask',
          subscription_tier: 'free'
        })
        
        expect(mockSuccess).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Gestion des erreurs', () => {
    it('devrait afficher une erreur si l\'inscription échoue', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Email already registered'
      
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: errorMessage } as any
      })
      
      render(<RegisterPage />)
      
      await user.type(screen.getByLabelText(/nom complet/i), 'Jean Dupont')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /créer mon compte/i }))
      
      await waitFor(() => {
        expect(mockError).toHaveBeenCalledWith(errorMessage)
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('devrait afficher un message d\'erreur générique', async () => {
      const user = userEvent.setup()
      
      vi.mocked(supabase.auth.signUp).mockRejectedValue(new Error())
      
      render(<RegisterPage />)
      
      await user.type(screen.getByLabelText(/nom complet/i), 'Jean Dupont')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /créer mon compte/i }))
      
      await waitFor(() => {
        expect(mockError).toHaveBeenCalledWith('Erreur lors de la création du compte')
      })
    })
  })

  describe('État du formulaire', () => {
    it('devrait désactiver les champs pendant le chargement', async () => {
      const user = userEvent.setup()
      
      vi.mocked(supabase.auth.signUp).mockImplementation(
        () => new Promise(() => {}) // Ne jamais résoudre
      )
      
      render(<RegisterPage />)
      
      await user.type(screen.getByLabelText(/nom complet/i), 'Jean Dupont')
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /créer mon compte/i }))
      
      expect(screen.getByLabelText(/nom complet/i)).toBeDisabled()
      expect(screen.getByLabelText(/email/i)).toBeDisabled()
      expect(screen.getByLabelText(/mot de passe/i)).toBeDisabled()
      expect(screen.getByRole('button', { name: /création.../i })).toBeDisabled()
    })

    it('devrait permettre de saisir dans tous les champs', async () => {
      const user = userEvent.setup()
      render(<RegisterPage />)
      
      const nameInput = screen.getByLabelText(/nom complet/i)
      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/mot de passe/i)
      
      await user.type(nameInput, 'Jean Dupont')
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      expect(nameInput).toHaveValue('Jean Dupont')
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })
  })
})