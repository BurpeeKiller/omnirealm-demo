import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '../task-form'
import { useTaskStore } from '@/lib/store/task-store'
import { useToastStore } from '@/lib/store/toast-store'
import { TaskStatus } from '@/lib/types'

// Mock des stores
vi.mock('@/lib/store/task-store')
vi.mock('@/lib/store/toast-store')

// Mock du composant Modal
vi.mock('@/components/ui/modal', () => ({
  Modal: ({ children, isOpen, title }: any) => 
    isOpen ? (
      <div role="dialog" aria-label={title}>
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
  useModalContainer: () => document.body
}))

// Mock du Select
vi.mock('@/components/ui/select-modal', () => ({
  Select: ({ children, value, onValueChange }: any) => {
    // Simuler le comportement du Select sans utiliser de vrais éléments select/option
    return <div data-value={value} data-onvaluechange={onValueChange}>{children}</div>
  },
  SelectTrigger: ({ children, id }: any) => <button type="button" id={id}>{children}</button>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder || 'Select...'}</span>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value} data-testid="select-item">{children}</div>
}))

describe('TaskForm', () => {
  const mockProjects = [
    {
      id: 'project1',
      name: 'Projet 1',
      icon: '📁',
      color: '#000',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    },
    {
      id: 'project2',
      name: 'Projet 2',
      icon: '📂',
      color: '#fff',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    }
  ]

  const mockAddTask = vi.fn()
  const mockUpdateTask = vi.fn()
  const mockSuccess = vi.fn()
  const mockError = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTaskStore as any).mockReturnValue({
      projects: mockProjects,
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      isLoading: false
    })
    ;(useToastStore as any).mockReturnValue({
      success: mockSuccess,
      error: mockError
    })
  })

  describe('Mode création', () => {
    it('devrait afficher le titre "Nouvelle tâche"', () => {
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      expect(screen.getByText('Nouvelle tâche')).toBeInTheDocument()
    })

    it('devrait avoir tous les champs vides par défaut', () => {
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      const titleInput = screen.getByLabelText(/titre/i) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
      const dueDateInput = screen.getByLabelText(/date limite/i) as HTMLInputElement
      const hoursInput = screen.getByLabelText(/heures estimées/i) as HTMLInputElement
      const tagsInput = screen.getByLabelText(/tags/i) as HTMLInputElement
      
      expect(titleInput.value).toBe('')
      expect(descriptionInput.value).toBe('')
      expect(dueDateInput.value).toBe('')
      expect(hoursInput.value).toBe('')
      expect(tagsInput.value).toBe('')
    })

    it('devrait créer une nouvelle tâche', async () => {
      const user = userEvent.setup()
      mockAddTask.mockResolvedValue(undefined)
      
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      // Remplir le formulaire
      await user.type(screen.getByLabelText(/titre/i), 'Nouvelle tâche test')
      await user.type(screen.getByLabelText(/description/i), 'Description de test')
      await user.type(screen.getByLabelText(/date limite/i), '2024-12-25')
      await user.type(screen.getByLabelText(/heures estimées/i), '4.5')
      await user.type(screen.getByLabelText(/tags/i), 'test, vitest, react')
      
      // Soumettre
      await user.click(screen.getByRole('button', { name: /créer/i }))
      
      await waitFor(() => {
        expect(mockAddTask).toHaveBeenCalledWith({
          title: 'Nouvelle tâche test',
          description: 'Description de test',
          status: 'TODO',
          priority: 'MEDIUM',
          projectId: undefined,
          dueDate: '2024-12-25',
          estimatedHours: 4.5,
          tags: ['test', 'vitest', 'react']
        })
      })
      
      expect(mockSuccess).toHaveBeenCalledWith('Tâche créée avec succès !')
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('devrait utiliser le status par défaut fourni', async () => {
      const user = userEvent.setup()
      mockAddTask.mockResolvedValue(undefined)
      
      render(
        <TaskForm 
          isOpen={true} 
          onClose={mockOnClose} 
          defaultStatus={TaskStatus.IN_PROGRESS}
        />
      )
      
      await user.type(screen.getByLabelText(/titre/i), 'Test')
      await user.click(screen.getByRole('button', { name: /créer/i }))
      
      await waitFor(() => {
        expect(mockAddTask).toHaveBeenCalledWith(
          expect.objectContaining({
            status: TaskStatus.IN_PROGRESS
          })
        )
      })
    })

    it('devrait valider que le titre est requis', async () => {
      const user = userEvent.setup()
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      const submitButton = screen.getByRole('button', { name: /créer/i })
      expect(submitButton).toBeDisabled()
      
      await user.type(screen.getByLabelText(/titre/i), 'Test')
      expect(submitButton).not.toBeDisabled()
    })

    it('devrait gérer les erreurs de création', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Erreur de création'
      mockAddTask.mockRejectedValue(new Error(errorMessage))
      
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      await user.type(screen.getByLabelText(/titre/i), 'Test')
      await user.click(screen.getByRole('button', { name: /créer/i }))
      
      await waitFor(() => {
        expect(mockError).toHaveBeenCalledWith(errorMessage)
      })
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Mode édition', () => {
    const mockTask = {
      id: '1',
      title: 'Tâche existante',
      description: 'Description existante',
      status: TaskStatus.IN_PROGRESS,
      priority: 'HIGH' as const,
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1',
      projectId: 'project1',
      dueDate: '2024-12-31T00:00:00Z',
      estimatedHours: 8,
      tags: ['bug', 'urgent']
    }

    it('devrait afficher le titre "Modifier la tâche"', () => {
      render(<TaskForm isOpen={true} onClose={mockOnClose} task={mockTask} />)
      expect(screen.getByText('Modifier la tâche')).toBeInTheDocument()
    })

    it('devrait pré-remplir les champs avec les données de la tâche', () => {
      render(<TaskForm isOpen={true} onClose={mockOnClose} task={mockTask} />)
      
      const titleInput = screen.getByLabelText(/titre/i) as HTMLInputElement
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement
      const dueDateInput = screen.getByLabelText(/date limite/i) as HTMLInputElement
      const hoursInput = screen.getByLabelText(/heures estimées/i) as HTMLInputElement
      const tagsInput = screen.getByLabelText(/tags/i) as HTMLInputElement
      
      expect(titleInput.value).toBe('Tâche existante')
      expect(descriptionInput.value).toBe('Description existante')
      expect(dueDateInput.value).toBe('2024-12-31')
      expect(hoursInput.value).toBe('8')
      expect(tagsInput.value).toBe('bug, urgent')
    })

    it('devrait mettre à jour la tâche', async () => {
      const user = userEvent.setup()
      mockUpdateTask.mockResolvedValue(undefined)
      
      render(<TaskForm isOpen={true} onClose={mockOnClose} task={mockTask} />)
      
      // Modifier le titre
      const titleInput = screen.getByLabelText(/titre/i)
      await user.clear(titleInput)
      await user.type(titleInput, 'Tâche modifiée')
      
      // Soumettre
      await user.click(screen.getByRole('button', { name: /modifier/i }))
      
      await waitFor(() => {
        expect(mockUpdateTask).toHaveBeenCalledWith('1', expect.objectContaining({
          title: 'Tâche modifiée'
        }))
      })
      
      expect(mockSuccess).toHaveBeenCalledWith('Tâche modifiée avec succès !')
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('devrait gérer les erreurs de mise à jour', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Erreur de mise à jour'
      mockUpdateTask.mockRejectedValue(new Error(errorMessage))
      
      render(<TaskForm isOpen={true} onClose={mockOnClose} task={mockTask} />)
      
      await user.click(screen.getByRole('button', { name: /modifier/i }))
      
      await waitFor(() => {
        expect(mockError).toHaveBeenCalledWith(errorMessage)
      })
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Interactions communes', () => {
    it('devrait fermer le formulaire en cliquant sur Annuler', async () => {
      const user = userEvent.setup()
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      await user.click(screen.getByRole('button', { name: /annuler/i }))
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('devrait désactiver les boutons pendant le chargement', () => {
      ;(useTaskStore as any).mockReturnValue({
        projects: mockProjects,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        isLoading: true
      })
      
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      expect(screen.getByRole('button', { name: /annuler/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /enregistrement/i })).toBeDisabled()
    })

    it('ne devrait rien afficher si isOpen est false', () => {
      const { container } = render(<TaskForm isOpen={false} onClose={mockOnClose} />)
      expect(container.firstChild).toBeNull()
    })

    it('devrait gérer les tags correctement', async () => {
      const user = userEvent.setup()
      mockAddTask.mockResolvedValue(undefined)
      
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      await user.type(screen.getByLabelText(/titre/i), 'Test')
      await user.type(screen.getByLabelText(/tags/i), ' tag1 , , tag2 , tag3 ')
      await user.click(screen.getByRole('button', { name: /créer/i }))
      
      await waitFor(() => {
        expect(mockAddTask).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['tag1', 'tag2', 'tag3']
          })
        )
      })
    })

    it('devrait afficher les projets disponibles', () => {
      render(<TaskForm isOpen={true} onClose={mockOnClose} />)
      
      // Vérifier que les projets sont présents dans le DOM
      expect(screen.getByText(/Projet 1/)).toBeInTheDocument()
      expect(screen.getByText(/Projet 2/)).toBeInTheDocument()
    })
  })
})