import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal, useModalContainer } from '../modal'
import { renderHook } from '@testing-library/react'

describe('Modal', () => {
  const mockOnClose = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Nettoyer les styles du body
    document.body.style.overflow = 'unset'
  })

  describe('Affichage', () => {
    it('ne devrait rien afficher si isOpen est false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      expect(container.firstChild).toBeNull()
    })

    it('devrait afficher le modal si isOpen est true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu du modal</p>
        </Modal>
      )
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByText('Contenu du modal')).toBeInTheDocument()
    })

    it('devrait appliquer les classes CSS personnalisées', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={mockOnClose} 
          title="Test Modal"
          className="custom-class"
        >
          <p>Contenu</p>
        </Modal>
      )
      
      const modal = screen.getByText('Test Modal').parentElement?.parentElement
      expect(modal).toHaveClass('custom-class')
    })
  })

  describe('Interactions', () => {
    it('devrait appeler onClose en cliquant sur le bouton fermer', async () => {
      const user = userEvent.setup()
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      const closeButton = screen.getByRole('button')
      await user.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalledOnce()
    })

    it('devrait appeler onClose en cliquant sur le backdrop', async () => {
      const user = userEvent.setup()
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      // Le backdrop est le premier div avec bg-black/50
      const backdrop = document.querySelector('.bg-black\\/50')
      expect(backdrop).toBeInTheDocument()
      
      await user.click(backdrop!)
      
      expect(mockOnClose).toHaveBeenCalledOnce()
    })

    it('devrait appeler onClose en appuyant sur Escape', async () => {
      const user = userEvent.setup()
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      await user.keyboard('{Escape}')
      
      expect(mockOnClose).toHaveBeenCalledOnce()
    })

    it('ne devrait pas écouter Escape si le modal est fermé', async () => {
      const user = userEvent.setup()
      
      render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      await user.keyboard('{Escape}')
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Gestion du scroll', () => {
    it('devrait bloquer le scroll du body quand ouvert', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('devrait restaurer le scroll du body quand fermé', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      expect(document.body.style.overflow).toBe('hidden')
      
      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      expect(document.body.style.overflow).toBe('unset')
    })

    it('devrait nettoyer les event listeners au démontage', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const { unmount } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(document.body.style.overflow).toBe('unset')
    })
  })

  describe('Structure', () => {
    it('devrait avoir la structure correcte', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu du modal</p>
        </Modal>
      )
      
      // Vérifier la présence du backdrop
      expect(document.querySelector('.bg-black\\/50')).toBeInTheDocument()
      
      // Vérifier la présence du titre
      const title = screen.getByText('Test Modal')
      expect(title.tagName).toBe('H2')
      expect(title).toHaveClass('text-xl', 'font-semibold')
      
      // Vérifier la présence du contenu
      expect(screen.getByText('Contenu du modal')).toBeInTheDocument()
      
      // Vérifier la présence du bouton fermer avec l'icône X
      const closeButton = screen.getByRole('button')
      expect(closeButton).toHaveClass('text-gray-400')
      const svg = closeButton.querySelector('svg')
      expect(svg).toHaveClass('h-5', 'w-5')
    })

    it('devrait avoir les bonnes classes pour le conteneur principal', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Contenu</p>
        </Modal>
      )
      
      const container = screen.getByText('Test Modal').closest('.fixed')
      expect(container).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center')
    })
  })
})

describe('useModalContainer', () => {
  it('devrait retourner null quand utilisé en dehors du contexte', () => {
    const { result } = renderHook(() => useModalContainer())
    expect(result.current).toBeNull()
  })

  it('devrait retourner la référence du modal quand utilisé dans le contexte', () => {
    const TestComponent = () => {
      const container = useModalContainer()
      return <div data-testid="container">{container ? 'Has container' : 'No container'}</div>
    }

    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test">
        <TestComponent />
      </Modal>
    )

    expect(screen.getByTestId('container')).toHaveTextContent('Has container')
  })
})