import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SimpleLanding } from './SimpleLanding'

// Mock de lucide-react avec toutes les icônes nécessaires
vi.mock('lucide-react', () => ({
  Upload: () => <div data-testid="upload-icon">Upload Icon</div>,
  FileText: () => <div data-testid="file-text-icon">FileText Icon</div>,
  Brain: () => <div data-testid="brain-icon">Brain Icon</div>,
  Download: () => <div data-testid="download-icon">Download Icon</div>,
  Shield: () => <div data-testid="shield-icon">Shield Icon</div>,
  Zap: () => <div data-testid="zap-icon">Zap Icon</div>,
  ChevronRight: () => <div data-testid="chevron-icon">ChevronRight Icon</div>,
  Globe: () => <div data-testid="globe-icon">Globe Icon</div>,
  Lock: () => <div data-testid="lock-icon">Lock Icon</div>,
  Cloud: () => <div data-testid="cloud-icon">Cloud Icon</div>,
  Check: () => <div data-testid="check-icon">Check Icon</div>,
  Star: () => <div data-testid="star-icon">Star Icon</div>,
  Building: () => <div data-testid="building-icon">Building Icon</div>,
  Users: () => <div data-testid="users-icon">Users Icon</div>,
  Clock: () => <div data-testid="clock-icon">Clock Icon</div>
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('SimpleLanding', () => {
  it('renders main heading', () => {
    renderWithRouter(<SimpleLanding />)
    expect(screen.getByText('OmniScan Pro')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    renderWithRouter(<SimpleLanding />)
    expect(screen.getByText(/Transformez vos documents/i)).toBeInTheDocument()
  })

  it('renders CTA button', () => {
    renderWithRouter(<SimpleLanding />)
    const ctaButton = screen.getByRole('button', { name: /Scanner un document maintenant/i })
    expect(ctaButton).toBeInTheDocument()
  })

  it('renders all feature cards', () => {
    renderWithRouter(<SimpleLanding />)
    
    // Vérifier les titres des features
    expect(screen.getByText('Ultra Rapide')).toBeInTheDocument()
    expect(screen.getByText('100% Sécurisé')).toBeInTheDocument()
    expect(screen.getByText('Multi-langues')).toBeInTheDocument()
  })

  it('renders call to action section', () => {
    renderWithRouter(<SimpleLanding />)
    expect(screen.getByText(/Prêt à commencer/i)).toBeInTheDocument()
    expect(screen.getByText(/Essayez gratuitement avec 5 documents par mois/i)).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    renderWithRouter(<SimpleLanding />)
    
    // Vérifier les boutons
    expect(screen.getByRole('button', { name: /Essayer maintenant/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument()
  })

  it('has gradient background', () => {
    const { container } = renderWithRouter(<SimpleLanding />)
    const mainDiv = container.querySelector('.bg-gradient-to-br')
    expect(mainDiv).toBeInTheDocument()
  })
})