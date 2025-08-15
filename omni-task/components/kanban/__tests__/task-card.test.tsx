import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from '../task-card'
import { useTaskStore } from '@/lib/store/task-store'
import { useToastStore } from '@/lib/store/toast-store'

// Mock des stores
vi.mock('@/lib/store/task-store')
vi.mock('@/lib/store/toast-store')

// Mock de date-fns pour des tests déterministes
vi.mock('date-fns', () => ({
  format: vi.fn((date, format) => '15 Jan'),
}))

// Mock global pour window.confirm
global.confirm = vi.fn()

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Tâche de test',
    description: 'Description de la tâche',
    status: 'TODO' as const,
    priority: 'HIGH' as const,
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user1',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Demain
    estimatedHours: 4,
    tags: ['frontend', 'urgent', 'design']
  }

  const mockDeleteTask = vi.fn()
  const mockSuccess = vi.fn()
  const mockError = vi.fn()
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTaskStore as any).mockReturnValue({
      deleteTask: mockDeleteTask
    })
    ;(useToastStore as any).mockReturnValue({
      success: mockSuccess,
      error: mockError
    })
  })

  it('devrait afficher le titre de la tâche', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    expect(screen.getByText('Tâche de test')).toBeInTheDocument()
  })

  it('devrait afficher la description de la tâche', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    expect(screen.getByText('Description de la tâche')).toBeInTheDocument()
  })

  it('devrait afficher le badge de priorité avec la bonne couleur', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    const badge = screen.getByText('Haute')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-orange-50')
  })

  it('devrait afficher la date d\'échéance', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    expect(screen.getByText('15 Jan')).toBeInTheDocument()
  })

  it('devrait afficher une alerte pour les tâches en retard', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Hier
    }
    
    render(<TaskCard task={overdueTask} onClick={mockOnClick} />)
    const dateContainer = screen.getByText('15 Jan').closest('div')
    expect(dateContainer?.className).toContain('bg-red-50')
  })

  it('devrait afficher les heures estimées', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    expect(screen.getByText('4h')).toBeInTheDocument()
  })

  it('devrait afficher les tags (max 3)', () => {
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('urgent')).toBeInTheDocument()
    expect(screen.getByText('design')).toBeInTheDocument()
  })

  it('devrait afficher le nombre de tags supplémentaires', () => {
    const manyTagsTask = {
      ...mockTask,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
    }
    
    render(<TaskCard task={manyTagsTask} onClick={mockOnClick} />)
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('devrait appeler onClick quand on clique sur la carte', async () => {
    const user = userEvent.setup()
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    
    await user.click(screen.getByText('Tâche de test'))
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('devrait supprimer la tâche après confirmation', async () => {
    const user = userEvent.setup()
    ;(global.confirm as any).mockReturnValue(true)
    mockDeleteTask.mockResolvedValue(undefined)
    
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    
    // Le bouton de suppression est caché par défaut, on doit hover
    const deleteButton = screen.getByTitle('Supprimer la tâche')
    await user.click(deleteButton)
    
    expect(global.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer cette tâche ?')
    expect(mockDeleteTask).toHaveBeenCalledWith('1')
    expect(mockSuccess).toHaveBeenCalledWith('Tâche supprimée avec succès')
  })

  it('ne devrait pas supprimer si l\'utilisateur annule', async () => {
    const user = userEvent.setup()
    ;(global.confirm as any).mockReturnValue(false)
    
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    
    const deleteButton = screen.getByTitle('Supprimer la tâche')
    await user.click(deleteButton)
    
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })

  it('devrait afficher une erreur si la suppression échoue', async () => {
    const user = userEvent.setup()
    ;(global.confirm as any).mockReturnValue(true)
    mockDeleteTask.mockRejectedValue(new Error('Erreur'))
    
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    
    const deleteButton = screen.getByTitle('Supprimer la tâche')
    await user.click(deleteButton)
    
    expect(mockError).toHaveBeenCalledWith('Erreur lors de la suppression')
  })

  it('devrait appliquer les styles de dragging', () => {
    render(<TaskCard task={mockTask} isDragging={true} onClick={mockOnClick} />)
    
    const card = screen.getByText('Tâche de test').closest('.task-card')
    expect(card?.className).toContain('opacity-50')
    expect(card?.className).toContain('rotate-2')
  })

  it('ne devrait pas propager le clic du bouton delete vers la carte', async () => {
    const user = userEvent.setup()
    ;(global.confirm as any).mockReturnValue(true)
    
    render(<TaskCard task={mockTask} onClick={mockOnClick} />)
    
    const deleteButton = screen.getByTitle('Supprimer la tâche')
    await user.click(deleteButton)
    
    expect(mockOnClick).not.toHaveBeenCalled()
  })
})