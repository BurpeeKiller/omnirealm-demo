import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KanbanBoard } from '../kanban-board'
import { useTaskStore } from '@/lib/store/task-store'
import { TaskStatus } from '@/lib/types'

// Mock du store
vi.mock('@/lib/store/task-store')

// Mock des composants enfants pour simplifier les tests
vi.mock('../kanban-column', () => ({
  KanbanColumn: ({ column, onAddTask, onEditTask }: any) => (
    <div data-testid={`column-${column.id}`}>
      <h3>{column.title}</h3>
      <div data-testid={`tasks-${column.id}`}>
        {column.tasks.map((task: any) => (
          <div 
            key={task.id} 
            data-testid={`task-${task.id}`}
            onClick={() => onEditTask(task)}
          >
            {task.title}
          </div>
        ))}
      </div>
      <button onClick={() => onAddTask(column.id)}>
        Ajouter une tâche
      </button>
    </div>
  )
}))

vi.mock('@/components/task-form', () => ({
  TaskForm: ({ isOpen, onClose, task, defaultStatus }: any) => (
    isOpen ? (
      <div data-testid="task-form">
        <h2>{task ? 'Modifier' : 'Nouvelle'} tâche</h2>
        {defaultStatus && <p>Statut: {defaultStatus}</p>}
        <button onClick={onClose}>Fermer</button>
      </div>
    ) : null
  )
}))

// Mock de @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }: any) => (
    <div data-testid="drag-drop-context" onDragEnd={onDragEnd}>
      {children}
    </div>
  ),
  Droppable: ({ children }: any) => children({}),
  Draggable: ({ children }: any) => children({}, {})
}))

describe('KanbanBoard', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Tâche TODO',
      status: TaskStatus.TODO,
      priority: 'MEDIUM' as const,
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1'
    },
    {
      id: '2',
      title: 'Tâche En cours',
      status: TaskStatus.IN_PROGRESS,
      priority: 'HIGH' as const,
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1'
    },
    {
      id: '3',
      title: 'Tâche En revue',
      status: TaskStatus.REVIEW,
      priority: 'LOW' as const,
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1'
    },
    {
      id: '4',
      title: 'Tâche Terminée',
      status: TaskStatus.DONE,
      priority: 'MEDIUM' as const,
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1'
    }
  ]

  const mockMoveTask = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTaskStore as any).mockReturnValue({
      tasks: mockTasks,
      moveTask: mockMoveTask,
      selectedProjectId: null
    })
  })

  it('devrait afficher toutes les colonnes du kanban', () => {
    render(<KanbanBoard />)

    expect(screen.getByTestId('column-TODO')).toBeInTheDocument()
    expect(screen.getByTestId('column-IN_PROGRESS')).toBeInTheDocument()
    expect(screen.getByTestId('column-REVIEW')).toBeInTheDocument()
    expect(screen.getByTestId('column-DONE')).toBeInTheDocument()
  })

  it('devrait afficher les tâches dans les bonnes colonnes', () => {
    render(<KanbanBoard />)

    const todoColumn = screen.getByTestId('tasks-TODO')
    const inProgressColumn = screen.getByTestId('tasks-IN_PROGRESS')
    const reviewColumn = screen.getByTestId('tasks-REVIEW')
    const doneColumn = screen.getByTestId('tasks-DONE')

    expect(within(todoColumn).getByText('Tâche TODO')).toBeInTheDocument()
    expect(within(inProgressColumn).getByText('Tâche En cours')).toBeInTheDocument()
    expect(within(reviewColumn).getByText('Tâche En revue')).toBeInTheDocument()
    expect(within(doneColumn).getByText('Tâche Terminée')).toBeInTheDocument()
  })

  it('devrait filtrer les tâches par projet sélectionné', () => {
    const projectTasks = [
      { ...mockTasks[0], projectId: 'project1' },
      { ...mockTasks[1], projectId: 'project2' },
    ]

    ;(useTaskStore as any).mockReturnValue({
      tasks: projectTasks,
      moveTask: mockMoveTask,
      selectedProjectId: 'project1'
    })

    render(<KanbanBoard />)

    const todoColumn = screen.getByTestId('tasks-TODO')
    expect(within(todoColumn).getByText('Tâche TODO')).toBeInTheDocument()
    expect(screen.queryByText('Tâche En cours')).not.toBeInTheDocument()
  })

  it('devrait ouvrir le formulaire pour ajouter une tâche', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    // Cliquer sur le bouton d'ajout dans la colonne TODO
    const addButtons = screen.getAllByText('Ajouter une tâche')
    await user.click(addButtons[0])

    // Vérifier que le formulaire s'ouvre avec le bon statut
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
    expect(screen.getByText('Nouvelle tâche')).toBeInTheDocument()
    expect(screen.getByText('Statut: TODO')).toBeInTheDocument()
  })

  it('devrait ouvrir le formulaire pour éditer une tâche', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    // Cliquer sur une tâche
    await user.click(screen.getByTestId('task-1'))

    // Vérifier que le formulaire s'ouvre en mode édition
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
    expect(screen.getByText('Modifier tâche')).toBeInTheDocument()
  })

  it('devrait fermer le formulaire', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    // Ouvrir le formulaire
    const addButtons = screen.getAllByText('Ajouter une tâche')
    await user.click(addButtons[0])
    expect(screen.getByTestId('task-form')).toBeInTheDocument()

    // Fermer le formulaire
    await user.click(screen.getByText('Fermer'))
    expect(screen.queryByTestId('task-form')).not.toBeInTheDocument()
  })

  it('devrait initialiser le drag and drop context', () => {
    render(<KanbanBoard />)
    expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument()
  })
})