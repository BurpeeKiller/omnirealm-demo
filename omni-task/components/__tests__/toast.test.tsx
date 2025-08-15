import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastContainer } from '../toast'
import { useToastStore } from '@/lib/store/toast-store'

// Mock du store toast
vi.mock('@/lib/store/toast-store')

describe('ToastContainer', () => {
  const mockRemoveToast = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ne devrait rien afficher si aucun toast', () => {
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [],
      removeToast: mockRemoveToast
    } as any)

    const { container } = render(<ToastContainer />)
    expect(container.firstChild).toBeNull()
  })

  it('devrait afficher un toast de succès', () => {
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [{
        id: '1',
        type: 'success',
        message: 'Opération réussie !',
        timestamp: Date.now()
      }],
      removeToast: mockRemoveToast
    } as any)

    render(<ToastContainer />)
    
    expect(screen.getByText('Opération réussie !')).toBeInTheDocument()
    
    // Vérifier les classes CSS pour le type success
    const toastElement = screen.getByText('Opération réussie !').closest('div')
    expect(toastElement).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800')
  })

  it('devrait afficher un toast d\'erreur', () => {
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [{
        id: '1',
        type: 'error',
        message: 'Une erreur est survenue',
        timestamp: Date.now()
      }],
      removeToast: mockRemoveToast
    } as any)

    render(<ToastContainer />)
    
    expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument()
    
    // Vérifier les classes CSS pour le type error
    const toastElement = screen.getByText('Une erreur est survenue').closest('div')
    expect(toastElement).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800')
  })

  it('devrait afficher un toast d\'info', () => {
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [{
        id: '1',
        type: 'info',
        message: 'Information importante',
        timestamp: Date.now()
      }],
      removeToast: mockRemoveToast
    } as any)

    render(<ToastContainer />)
    
    expect(screen.getByText('Information importante')).toBeInTheDocument()
    
    // Vérifier les classes CSS pour le type info
    const toastElement = screen.getByText('Information importante').closest('div')
    expect(toastElement).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800')
  })

  it('devrait afficher un toast d\'avertissement', () => {
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [{
        id: '1',
        type: 'warning',
        message: 'Attention requise',
        timestamp: Date.now()
      }],
      removeToast: mockRemoveToast
    } as any)

    render(<ToastContainer />)
    
    expect(screen.getByText('Attention requise')).toBeInTheDocument()
    
    // Vérifier les classes CSS pour le type warning
    const toastElement = screen.getByText('Attention requise').closest('div')
    expect(toastElement).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800')
  })

  it('devrait afficher plusieurs toasts', () => {
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [
        {
          id: '1',
          type: 'success',
          message: 'Premier toast',
          timestamp: Date.now()
        },
        {
          id: '2',
          type: 'error',
          message: 'Deuxième toast',
          timestamp: Date.now()
        },
        {
          id: '3',
          type: 'info',
          message: 'Troisième toast',
          timestamp: Date.now()
        }
      ],
      removeToast: mockRemoveToast
    } as any)

    render(<ToastContainer />)
    
    expect(screen.getByText('Premier toast')).toBeInTheDocument()
    expect(screen.getByText('Deuxième toast')).toBeInTheDocument()
    expect(screen.getByText('Troisième toast')).toBeInTheDocument()
  })

  it('devrait supprimer un toast au clic sur le bouton fermer', async () => {
    const user = userEvent.setup()
    
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [{
        id: 'toast-1',
        type: 'success',
        message: 'Toast à fermer',
        timestamp: Date.now()
      }],
      removeToast: mockRemoveToast
    } as any)

    render(<ToastContainer />)
    
    // Trouver et cliquer sur le bouton de fermeture
    const closeButtons = screen.getAllByRole('button')
    const closeButton = closeButtons[closeButtons.length - 1] // Le dernier bouton est le bouton de fermeture
    
    await user.click(closeButton)
    
    expect(mockRemoveToast).toHaveBeenCalledWith('toast-1')
  })

  it('devrait positionner le conteneur en bas à droite', () => {
    vi.mocked(useToastStore).mockReturnValue({
      toasts: [{
        id: '1',
        type: 'success',
        message: 'Test position',
        timestamp: Date.now()
      }],
      removeToast: mockRemoveToast
    } as any)

    render(<ToastContainer />)
    
    const container = screen.getByText('Test position').closest('.fixed')
    expect(container).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-50')
  })

  it('devrait avoir les bonnes icônes pour chaque type', () => {
    const toastTypes = [
      { type: 'success' as const, expectedIcon: 'text-green-500' },
      { type: 'error' as const, expectedIcon: 'text-red-500' },
      { type: 'info' as const, expectedIcon: 'text-blue-500' },
      { type: 'warning' as const, expectedIcon: 'text-yellow-500' }
    ]

    toastTypes.forEach(({ type, expectedIcon }) => {
      vi.mocked(useToastStore).mockReturnValue({
        toasts: [{
          id: '1',
          type,
          message: `${type} message`,
          timestamp: Date.now()
        }],
        removeToast: mockRemoveToast
      } as any)

      const { container } = render(<ToastContainer />)
      
      // Chercher l'icône par sa classe de couleur
      const icon = container.querySelector(`.${expectedIcon}`)
      expect(icon).toBeInTheDocument()
      
      // Nettoyer pour le prochain test
      container.remove()
    })
  })
})