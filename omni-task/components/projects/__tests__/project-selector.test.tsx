import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectSelector } from '../project-selector'
import { useTaskStore } from '@/lib/store/task-store'
import { vi } from 'vitest'

// Mock du store
vi.mock('@/lib/store/task-store', () => ({
  useTaskStore: vi.fn()
}))

// Mock de @omnirealm/ui
vi.mock('@omnirealm/ui', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}))

describe('ProjectSelector', () => {
  const mockSelectProject = vi.fn()
  const mockOnCreateProject = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher "Tous les projets" par défaut', () => {
    ;(useTaskStore as any).mockReturnValue({
      projects: [],
      selectedProjectId: null,
      selectProject: mockSelectProject
    })

    render(<ProjectSelector onCreateProject={mockOnCreateProject} />)
    
    expect(screen.getByText('Tous les projets')).toBeInTheDocument()
  })

  it('devrait afficher le nom du projet sélectionné', () => {
    const projects = [
      { id: 'project1', name: 'Mon Projet', color: '#3B82F6', description: 'Test' }
    ]
    
    ;(useTaskStore as any).mockReturnValue({
      projects,
      selectedProjectId: 'project1',
      selectProject: mockSelectProject
    })

    render(<ProjectSelector onCreateProject={mockOnCreateProject} />)
    
    expect(screen.getByText('Mon Projet')).toBeInTheDocument()
  })

  it('devrait ouvrir le menu au clic', () => {
    const projects = [
      { id: 'project1', name: 'Mon Projet', color: '#3B82F6', description: 'Test' }
    ]
    
    ;(useTaskStore as any).mockReturnValue({
      projects,
      selectedProjectId: null,
      selectProject: mockSelectProject
    })

    render(<ProjectSelector onCreateProject={mockOnCreateProject} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('Nouveau projet')).toBeInTheDocument()
  })

  it('devrait appeler selectProject au clic sur un projet', () => {
    const projects = [
      { id: 'project1', name: 'Mon Projet', color: '#3B82F6', description: 'Test' }
    ]
    
    ;(useTaskStore as any).mockReturnValue({
      projects,
      selectedProjectId: null,
      selectProject: mockSelectProject
    })

    render(<ProjectSelector onCreateProject={mockOnCreateProject} />)
    
    // Ouvrir le menu
    fireEvent.click(screen.getByRole('button'))
    
    // Cliquer sur le projet
    fireEvent.click(screen.getByText('Mon Projet'))
    
    expect(mockSelectProject).toHaveBeenCalledWith('project1')
  })

  it('devrait appeler onCreateProject au clic sur "Nouveau projet"', () => {
    ;(useTaskStore as any).mockReturnValue({
      projects: [],
      selectedProjectId: null,
      selectProject: mockSelectProject
    })

    render(<ProjectSelector onCreateProject={mockOnCreateProject} />)
    
    // Ouvrir le menu
    fireEvent.click(screen.getByRole('button'))
    
    // Cliquer sur "Nouveau projet"
    fireEvent.click(screen.getByText('Nouveau projet'))
    
    expect(mockOnCreateProject).toHaveBeenCalled()
  })
})