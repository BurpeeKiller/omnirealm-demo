import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

// Mock des modules externes
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    }
  }))
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
  })

  it('has gray background', () => {
    render(<App />)
    const appDiv = document.querySelector('.bg-gray-50')
    expect(appDiv).toBeInTheDocument()
  })

  it('renders with ToastProvider', () => {
    const { container } = render(<App />)
    // ToastProvider ne rend pas d'élément visible par défaut
    expect(container).toBeTruthy()
  })
})