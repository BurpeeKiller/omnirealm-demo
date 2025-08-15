import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuotaDisplay } from '../QuotaDisplay'

describe('QuotaDisplay', () => {
  it('renders compact mode for free user', () => {
    render(<QuotaDisplay used={2} limit={3} variant="compact" />)
    expect(screen.getByText('Scans gratuits :')).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('renders compact mode for Pro user', () => {
    render(<QuotaDisplay used={10} limit={999} isPro variant="compact" />)
    expect(screen.getByText('Pro illimité')).toBeInTheDocument()
  })

  it('renders detailed mode with progress bar', () => {
    render(<QuotaDisplay used={1} limit={3} variant="detailed" />)
    expect(screen.getByText('Quota mensuel')).toBeInTheDocument()
    expect(screen.getByText('2 scans restants')).toBeInTheDocument()
  })

  it('shows warning when near limit', () => {
    // used=3, limit=4 = 75% (besoin de >= 80% pour warning)
    render(<QuotaDisplay used={4} limit={5} variant="detailed" />)
    expect(screen.getByText('Quota bientôt atteint')).toBeInTheDocument()
    expect(screen.getByText(/Il vous reste 1 scan ce mois-ci/)).toBeInTheDocument()
  })

  it('shows singular form for 1 scan remaining', () => {
    render(<QuotaDisplay used={2} limit={3} variant="detailed" />)
    expect(screen.getByText('1 scan restant')).toBeInTheDocument()
  })

  it('shows Pro benefits message', () => {
    render(<QuotaDisplay used={100} limit={999} isPro variant="detailed" />)
    expect(screen.getByText('Scans illimités activés')).toBeInTheDocument()
    expect(screen.getByText(/Profitez de votre abonnement Pro/)).toBeInTheDocument()
  })

  it('calculates percentage correctly', () => {
    const { container } = render(<QuotaDisplay used={1} limit={4} variant="detailed" />)
    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).toBeInTheDocument()
    // Vérifier que le style translate correspond à 25%
    const indicator = container.querySelector('[role="progressbar"] > div')
    expect(indicator).toHaveStyle({ transform: 'translateX(-75%)' }) // 100 - 25 = 75
  })

  it('applies custom className', () => {
    const { container } = render(
      <QuotaDisplay used={1} limit={3} className="custom-class" />
    )
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})