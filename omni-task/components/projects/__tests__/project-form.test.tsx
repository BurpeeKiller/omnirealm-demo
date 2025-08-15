import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectForm } from '../project-form'

// Mock API
const mockCreateProject = vi.fn()
const mockUpdateProject = vi.fn()

vi.mock('@/lib/api/projects', () => ({
  projectsApi: {
    createProject: mockCreateProject,
    updateProject: mockUpdateProject,
  }
}))

// Mock du store
const mockSetProjects = vi.fn()
const mockProjects: any[] = []

vi.mock('@/lib/store/task-store', () => ({
  useTaskStore: () => ({
    setProjects: mockSetProjects,
    projects: mockProjects,
  })
}))

// Mock du toast store
const mockSuccess = vi.fn()
const mockError = vi.fn()

vi.mock('@/lib/store/toast-store', () => ({
  useToastStore: () => ({
    success: mockSuccess,
    error: mockError,
  })
}))

// Mock du Modal
vi.mock('@/components/ui/modal', () => ({
  Modal: ({ children, isOpen, title }: any) => 
    isOpen ? (
      <div role="dialog" aria-label={title}>
        <h2>{title}</h2>
        {children}
      </div>
    ) : null
}))

describe('ProjectForm', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateProject.mockClear()
    mockUpdateProject.mockClear()
    mockSetProjects.mockClear()
    mockSuccess.mockClear()
    mockError.mockClear()
  })

  describe('Création de projet', () => {
    it('devrait afficher le formulaire de création', () => {
      render(<ProjectForm isOpen={true} onClose={mockOnClose} />)
      
      expect(screen.getByText('Nouveau projet')).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /nom du projet/i })).toBeInTheDocument()
      expect(screen.getByText(/icône/i)).toBeInTheDocument()
      expect(screen.getByText(/couleur/i)).toBeInTheDocument()
    })

    it('devrait créer un nouveau projet', async () => {
      const user = userEvent.setup()
      
      mockCreateProject.mockResolvedValue({
        id: 'new-id',
        name: 'Mon nouveau projet',
        icon: '🚀',
        color: '#3B82F6',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false
      })
      
      render(<ProjectForm isOpen={true} onClose={mockOnClose} />)
      
      // Remplir le formulaire
      await user.type(screen.getByRole('textbox', { name: /nom du projet/i }), 'Mon nouveau projet')
      
      // Sélectionner une icône
      const iconButtons = screen.getAllByRole('button')
      const rocketIcon = iconButtons.find(btn => btn.textContent === '🚀')
      if (rocketIcon) await user.click(rocketIcon)
      
      // Soumettre
      await user.click(screen.getByRole('button', { name: /créer/i }))
      
      await waitFor(() => {
        expect(mockCreateProject).toHaveBeenCalledWith({
          name: 'Mon nouveau projet',
          icon: '🚀',
          color: expect.any(String),
          is_archived: false
        })
        expect(mockSetProjects).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('devrait valider les champs requis', async () => {
      const user = userEvent.setup()
      render(<ProjectForm isOpen={true} onClose={mockOnClose} />)
      
      // Essayer de soumettre sans nom
      await user.clear(screen.getByRole('textbox', { name: /nom du projet/i }))
      await user.click(screen.getByRole('button', { name: /créer/i }))
      
      // Le formulaire ne devrait pas être soumis
      expect(mockCreateProject).not.toHaveBeenCalled()
    })
  })

  describe('Modification de projet', () => {
    const mockProject = {
      id: '1',
      name: 'Projet existant',
      description: 'Description existante',
      icon: '📁',
      color: '#3B82F6',
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    }

    it('devrait afficher le formulaire de modification', () => {
      render(<ProjectForm isOpen={true} onClose={mockOnClose} project={mockProject} />)
      
      expect(screen.getByText('Modifier le projet')).toBeInTheDocument()
      
      const nameInput = screen.getByRole('textbox', { name: /nom du projet/i }) as HTMLInputElement
      expect(nameInput.value).toBe('Projet existant')
    })

    it('devrait modifier un projet existant', async () => {
      const user = userEvent.setup()
      
      mockUpdateProject.mockResolvedValue({
        ...mockProject,
        name: 'Projet modifié'
      })
      
      render(<ProjectForm isOpen={true} onClose={mockOnClose} project={mockProject} />)
      
      // Modifier le nom
      const nameInput = screen.getByRole('textbox', { name: /nom du projet/i })
      await user.clear(nameInput)
      await user.type(nameInput, 'Projet modifié')
      
      // Soumettre
      await user.click(screen.getByRole('button', { name: /mettre à jour/i }))
      
      await waitFor(() => {
        expect(mockUpdateProject).toHaveBeenCalledWith('1', {
          name: 'Projet modifié',
          description: 'Description existante',
          icon: '📁',
          color: '#3B82F6'
        })
        expect(mockSetProjects).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  it('devrait fermer le formulaire en cliquant sur Annuler', async () => {
    const user = userEvent.setup()
    render(<ProjectForm isOpen={true} onClose={mockOnClose} />)
    
    await user.click(screen.getByRole('button', { name: /annuler/i }))
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('ne devrait rien afficher si isOpen est false', () => {
    const { container } = render(<ProjectForm isOpen={false} onClose={mockOnClose} />)
    expect(container.firstChild).toBeNull()
  })
})