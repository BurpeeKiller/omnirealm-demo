import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KanbanColumn } from '../kanban-column'
import { TaskStatus } from '@/lib/types'

// Mock des composants de drag and drop
vi.mock('@hello-pangea/dnd', () => ({
  Droppable: ({ children, droppableId }: any) => 
    children(
      {
        innerRef: vi.fn(),
        droppableProps: { 'data-droppable-id': droppableId },
        placeholder: <div data-testid="placeholder" />
      },
      { isDraggingOver: false }
    ),
  Draggable: ({ children, draggableId, index }: any) => 
    children(
      {
        innerRef: vi.fn(),
        draggableProps: { 'data-draggable-id': draggableId },
        dragHandleProps: { 'data-drag-handle': true }
      },
      { isDragging: false }
    )
}))

// Mock du TaskCard
vi.mock('../task-card', () => ({
  TaskCard: ({ task, onClick, isDragging }: any) => (
    <div 
      data-testid={`task-card-${task.id}`}
      onClick={onClick}
      className={isDragging ? 'dragging' : ''}
    >
      {task.title}
    </div>
  )
}))

describe('KanbanColumn', () => {
  const mockColumn = {
    id: TaskStatus.TODO,
    title: 'À faire',
    color: '#6366f1',
    limit: 5,
    tasks: [
      {
        id: '1',
        title: 'Première tâche',
        status: TaskStatus.TODO,
        priority: 'MEDIUM' as const,
        position: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1'
      },
      {
        id: '2',
        title: 'Deuxième tâche',
        status: TaskStatus.TODO,
        priority: 'HIGH' as const,
        position: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1'
      }
    ]
  }

  const mockOnAddTask = vi.fn()
  const mockOnEditTask = vi.fn()

  it('devrait afficher le titre de la colonne', () => {
    render(
      <KanbanColumn 
        column={mockColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    expect(screen.getByText('À faire')).toBeInTheDocument()
  })

  it('devrait afficher le nombre de tâches et la limite', () => {
    render(
      <KanbanColumn 
        column={mockColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('devrait afficher toutes les tâches', () => {
    render(
      <KanbanColumn 
        column={mockColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    expect(screen.getByTestId('task-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('task-card-2')).toBeInTheDocument()
    expect(screen.getByText('Première tâche')).toBeInTheDocument()
    expect(screen.getByText('Deuxième tâche')).toBeInTheDocument()
  })

  it('devrait afficher un indicateur rouge quand la limite est atteinte', () => {
    const fullColumn = {
      ...mockColumn,
      tasks: Array(5).fill(null).map((_, i) => ({
        id: `${i}`,
        title: `Tâche ${i}`,
        status: TaskStatus.TODO,
        priority: 'MEDIUM' as const,
        position: i,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user1'
      }))
    }

    render(
      <KanbanColumn 
        column={fullColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    const badge = screen.getByText('5 / 5')
    expect(badge.className).toContain('bg-red-100')
  })

  it('devrait appeler onAddTask quand on clique sur le bouton +', async () => {
    const user = userEvent.setup()
    render(
      <KanbanColumn 
        column={mockColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    const addButton = screen.getByRole('button')
    await user.click(addButton)

    expect(mockOnAddTask).toHaveBeenCalledWith(TaskStatus.TODO)
  })

  it('devrait appeler onEditTask quand on clique sur une tâche', async () => {
    const user = userEvent.setup()
    render(
      <KanbanColumn 
        column={mockColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    await user.click(screen.getByTestId('task-card-1'))

    expect(mockOnEditTask).toHaveBeenCalledWith(mockColumn.tasks[0])
  })

  it('devrait gérer une colonne sans limite', () => {
    const noLimitColumn = {
      ...mockColumn,
      limit: undefined
    }

    render(
      <KanbanColumn 
        column={noLimitColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.queryByText('/')).not.toBeInTheDocument()
  })

  it('devrait afficher le placeholder du droppable', () => {
    render(
      <KanbanColumn 
        column={mockColumn}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
      />
    )

    expect(screen.getByTestId('placeholder')).toBeInTheDocument()
  })
})