import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DropZone } from '../DropZone'

describe('DropZone', () => {
  const mockOnDrop = vi.fn()

  beforeEach(() => {
    mockOnDrop.mockClear()
  })

  it('renders without crashing', () => {
    render(<DropZone onDrop={mockOnDrop} />)
    expect(screen.getByText(/glissez-déposez un fichier/i)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<DropZone onDrop={mockOnDrop} isLoading />)
    expect(screen.getByText(/traitement en cours/i)).toBeInTheDocument()
  })

  it('shows compact mode', () => {
    const { container } = render(<DropZone onDrop={mockOnDrop} compact />)
    expect(container.querySelector('.p-6')).toBeInTheDocument()
  })

  it('handles file drop', async () => {
    render(<DropZone onDrop={mockOnDrop} />)
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const dropzone = screen.getByText(/glissez-déposez un fichier/i).parentElement

    // Créer un événement de drop plus complet pour react-dropzone
    const dropEvent = new Event('drop', { bubbles: true })
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [file],
        items: [{
          kind: 'file',
          type: 'application/pdf',
          getAsFile: () => file
        }],
        types: ['Files']
      }
    })

    fireEvent(dropzone!, dropEvent)

    expect(mockOnDrop).toHaveBeenCalledWith([file])
  })

  it('respects maxSize prop', () => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    render(<DropZone onDrop={mockOnDrop} maxSize={maxSize} />)
    
    expect(screen.getByText(/max 10MB/i)).toBeInTheDocument()
  })

  it('is disabled when loading', () => {
    const { container } = render(<DropZone onDrop={mockOnDrop} isLoading />)
    expect(container.querySelector('.cursor-not-allowed')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<DropZone onDrop={mockOnDrop} className="custom-class" />)
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})