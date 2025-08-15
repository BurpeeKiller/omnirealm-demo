'use client'

import { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { KanbanColumn } from './kanban-column'
import { TaskForm } from '@/components/task-form'
import { useRealtimeTasks } from '@/components/sync/realtime-provider'
import { TaskStatus } from '@/lib/types'
import type { KanbanColumn as KanbanColumnType, Task } from '@/lib/types'

const columns: Omit<KanbanColumnType, 'tasks'>[] = [
  { id: TaskStatus.TODO, title: 'À faire', color: '#6366f1', limit: 10 },
  { id: TaskStatus.IN_PROGRESS, title: 'En cours', color: '#f59e0b', limit: 5 },
  { id: TaskStatus.REVIEW, title: 'En revue', color: '#8b5cf6', limit: 3 },
  { id: TaskStatus.DONE, title: 'Terminé', color: '#10b981' },
]

export function KanbanBoard() {
  const { tasks, moveTask, updateTask } = useRealtimeTasks()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Filtrer les tâches par projet si nécessaire
  const filteredTasks = selectedProjectId 
    ? tasks.filter(t => t.projectId === selectedProjectId)
    : tasks

  // Grouper les tâches par statut
  const tasksByStatus = filteredTasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = []
    acc[task.status].push(task)
    return acc
  }, {} as Record<TaskStatus, typeof tasks>)

  // Créer les colonnes avec leurs tâches
  const columnsWithTasks: KanbanColumnType[] = columns.map(col => ({
    ...col,
    tasks: tasksByStatus[col.id] || []
  }))

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result

    // Pas de destination = annuler
    if (!destination) return

    // Même position = ne rien faire
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    // Déplacer la tâche
    await moveTask(
      draggableId,
      destination.droppableId as TaskStatus,
      destination.index
    )
  }

  const [addTaskStatus, setAddTaskStatus] = useState<TaskStatus | null>(null)
  
  const handleAddTask = (status: string) => {
    setAddTaskStatus(status as TaskStatus)
    setIsTaskFormOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsTaskFormOpen(false)
    setEditingTask(null)
    setAddTaskStatus(null)
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columnsWithTasks.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      </DragDropContext>
      
      <TaskForm 
        isOpen={isTaskFormOpen}
        onClose={handleCloseForm}
        task={editingTask}
        defaultStatus={addTaskStatus}
      />
    </>
  )
}