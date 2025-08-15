'use client'

import { useState, useEffect, useCallback } from 'react'
import { taskService, type TaskWithDetails } from '@/lib/services/tasks'
import { useToastStore } from '@/lib/store/toast-store'
import { createLogger } from '@/lib/logger';
const logger = createLogger('use-tasks.ts');

export interface UseTasksReturn {
  tasks: TaskWithDetails[]
  loading: boolean
  error: Error | null
  refreshTasks: () => Promise<void>
  createTask: (task: any) => Promise<void>
  updateTask: (taskId: string, updates: any) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  moveTask: (taskId: string, newStatus: string, newPosition: number) => Promise<void>
}

export function useTasks(projectId?: string): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { success, error: showError } = useToastStore()

  // Charger les tâches
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = projectId 
        ? await taskService.getProjectTasks(projectId)
        : await taskService.getAllTasks()
      
      setTasks(data)
    } catch (err) {
      logger.error('Error fetching tasks:', err)
      setError(err as Error)
      showError('Erreur lors du chargement des tâches')
    } finally {
      setLoading(false)
    }
  }, [projectId, showError])

  // Créer une tâche
  const createTask = useCallback(async (taskData: any) => {
    try {
      const newTask = await taskService.createTask({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'medium',
        project_id: taskData.projectId || projectId,
        status: taskData.status || 'todo',
        due_date: taskData.dueDate,
        estimated_hours: taskData.estimatedHours
      })

      // Ajouter les tags si présents
      if (taskData.tags && taskData.tags.length > 0) {
        // Pour l'instant, on suppose que taskData.tags contient des IDs
        // Dans une vraie app, il faudrait gérer la création de nouveaux tags
        await taskService.addTagsToTask(newTask.id, taskData.tags)
      }

      success('Tâche créée avec succès')
      await fetchTasks() // Recharger les tâches
    } catch (err) {
      logger.error('Error creating task:', err)
      showError('Erreur lors de la création de la tâche')
      throw err
    }
  }, [projectId, fetchTasks, success, showError])

  // Mettre à jour une tâche
  const updateTask = useCallback(async (taskId: string, updates: any) => {
    try {
      await taskService.updateTask(taskId, updates)
      success('Tâche mise à jour')
      await fetchTasks()
    } catch (err) {
      logger.error('Error updating task:', err)
      showError('Erreur lors de la mise à jour')
      throw err
    }
  }, [fetchTasks, success, showError])

  // Supprimer une tâche
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId)
      success('Tâche supprimée')
      await fetchTasks()
    } catch (err) {
      logger.error('Error deleting task:', err)
      showError('Erreur lors de la suppression')
      throw err
    }
  }, [fetchTasks, success, showError])

  // Déplacer une tâche (drag & drop)
  const moveTask = useCallback(async (
    taskId: string, 
    newStatus: string, 
    newPosition: number
  ) => {
    try {
      await taskService.moveTask(taskId, newStatus, newPosition)
      await fetchTasks()
    } catch (err) {
      logger.error('Error moving task:', err)
      showError('Erreur lors du déplacement')
      throw err
    }
  }, [fetchTasks, showError])

  // Charger les tâches au montage
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    refreshTasks: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask
  }
}