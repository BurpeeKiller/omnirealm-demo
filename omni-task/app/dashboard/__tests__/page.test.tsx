import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '../page'

// Mock des composants enfants
vi.mock('@/components/kanban/kanban-board', () => ({
  KanbanBoard: () => <div data-testid="kanban-board">Kanban Board</div>
}))

vi.mock('@/components/task-form', () => ({
  TaskForm: ({ isOpen, onClose }: any) => 
    isOpen ? (
      <div data-testid="task-form">
        Task Form
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
}))

vi.mock('@/components/dashboard-header', () => ({
  DashboardHeader: () => <header data-testid="dashboard-header">Dashboard Header</header>
}))

vi.mock('@/components/footer-simple', () => ({
  FooterSimple: () => <footer data-testid="footer">Footer</footer>
}))

vi.mock('@/components/feedback-widget', () => ({
  FeedbackWidget: () => <div data-testid="feedback-widget">Feedback Widget</div>
}))

vi.mock('@/components/projects/project-selector', () => ({
  ProjectSelector: () => <div data-testid="project-selector">Project Selector</div>
}))

vi.mock('@/components/projects/project-form', () => ({
  ProjectForm: () => <div data-testid="project-form">Project Form</div>
}))

vi.mock('@/components/projects/project-stats', () => ({
  ProjectStats: () => <div data-testid="project-stats">Project Stats</div>
}))

vi.mock('@/components/projects/project-manager', () => ({
  ProjectManager: () => <div data-testid="project-manager">Project Manager</div>
}))

vi.mock('@/components/ai/ai-suggestions', () => ({
  AISuggestions: () => <div data-testid="ai-suggestions">AI Suggestions</div>
}))

// Mock du store
vi.mock('@/lib/store/task-store', () => ({
  useTaskStore: () => ({
    fetchProjects: vi.fn(),
    fetchTasks: vi.fn(),
    selectedProjectId: null,
  })
}))

describe('DashboardPage', () => {
  it('devrait afficher tous les composants principaux', () => {
    render(<DashboardPage />)
    
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('feedback-widget')).toBeInTheDocument()
  })

  it('devrait afficher le titre et la description', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
    expect(screen.getByText('Gérez vos projets avec intelligence')).toBeInTheDocument()
  })

  it('devrait afficher le bouton "Nouvelle tâche"', () => {
    render(<DashboardPage />)
    
    const newTaskButton = screen.getByRole('button', { name: /nouvelle tâche/i })
    expect(newTaskButton).toBeInTheDocument()
  })

  it('devrait ouvrir le formulaire de tâche au clic sur le bouton', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Le formulaire ne devrait pas être visible initialement
    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
    
    // Cliquer sur le bouton
    const newTaskButton = screen.getByRole('button', { name: /nouvelle tâche/i })
    await user.click(newTaskButton)
    
    // Le formulaire devrait maintenant être visible
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
  })

  it('devrait fermer le formulaire de tâche', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Ouvrir le formulaire
    const newTaskButton = screen.getByRole('button', { name: /nouvelle tâche/i })
    await user.click(newTaskButton)
    
    // Le formulaire est visible
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
    
    // Fermer le formulaire
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    // Le formulaire ne devrait plus être visible
    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
  })

  it('devrait avoir la structure de layout correcte', () => {
    const { container } = render(<DashboardPage />)
    
    // Vérifier la structure principale
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'flex-col')
    
    // Vérifier la présence du main
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex-1', 'p-8')
  })

  it('devrait appliquer les styles dark mode', () => {
    render(<DashboardPage />)
    
    // Vérifier que les classes dark sont présentes
    const heading = screen.getByText('Tableau de bord')
    expect(heading).toHaveClass('dark:text-white')
    
    const description = screen.getByText('Gérez vos projets avec intelligence')
    expect(description).toHaveClass('dark:text-gray-400')
  })
})