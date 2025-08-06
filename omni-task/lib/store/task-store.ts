import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { TaskStore } from '@/lib/types'
import { tasksApi } from '@/lib/api/tasks'

const initialState = {
  tasks: [
    {
      id: '1',
      title: 'Configurer l\'environnement de développement',
      description: 'Installer Node.js, pnpm et les dépendances du projet',
      status: 'DONE' as const,
      priority: 'HIGH' as const,
      position: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '1',
      tags: ['setup', 'dev']
    },
    {
      id: '2',
      title: 'Créer les composants UI de base',
      description: 'Boutons, modals, formulaires avec Radix UI',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      position: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '1',
      estimatedHours: 4
    },
    {
      id: '3',
      title: 'Intégrer l\'authentification Supabase',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      position: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '1',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      title: 'Ajouter les tests unitaires',
      status: 'TODO' as const,
      priority: 'LOW' as const,
      position: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '1'
    }
  ],
  projects: [
    { 
      id: 'a7f8d74e-2c3b-4567-89ab-cdef01234567', 
      name: 'OmniTask MVP', 
      icon: '🚀', 
      color: '#3B82F6',
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    },
    { 
      id: 'b8e9e85f-3d4c-5678-9abc-def012345678', 
      name: 'Marketing', 
      icon: '📢', 
      color: '#8B5CF6',
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    },
    { 
      id: 'c9f0f96a-4e5d-6789-abcd-ef0123456789', 
      name: 'Documentation', 
      icon: '📚', 
      color: '#10B981',
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false
    }
  ],
  selectedProjectId: null,
  isLoading: false,
  error: null,
}

export const useTaskStore = create<TaskStore>()(
  immer((set, get) => ({
    ...initialState,

    setTasks: (tasks) => set((state) => {
      state.tasks = tasks.sort((a, b) => a.position - b.position)
    }),

    addTask: async (taskData) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const newTask = await tasksApi.createTask(taskData)
        
        set((state) => {
          state.tasks.push(newTask)
          state.isLoading = false
        })

        return newTask
      } catch (error) {
        set((state) => {
          state.isLoading = false
          state.error = error instanceof Error ? error.message : 'Erreur lors de la création'
        })
        throw error
      }
    },

    updateTask: async (id, updates) => {
      // Mise à jour optimiste
      set((state) => {
        const index = state.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
          state.tasks[index] = {
            ...state.tasks[index],
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      })

      try {
        await tasksApi.updateTask(id, updates)
      } catch (error) {
        // Rollback en cas d'erreur
        const tasks = await tasksApi.fetchTasks(get().selectedProjectId ?? undefined)
        set((state) => {
          state.tasks = tasks
        })
        throw error
      }
    },

    deleteTask: async (id) => {
      // Sauvegarde pour rollback
      const backup = get().tasks
      
      // Suppression optimiste
      set((state) => {
        state.tasks = state.tasks.filter(t => t.id !== id)
      })

      try {
        await tasksApi.deleteTask(id)
      } catch (error) {
        // Rollback
        set((state) => {
          state.tasks = backup
          state.error = error instanceof Error ? error.message : 'Erreur lors de la suppression'
        })
        throw error
      }
    },

    moveTask: async (taskId, newStatus, newPosition) => {
      set((state) => {
        const taskIndex = state.tasks.findIndex(t => t.id === taskId)
        if (taskIndex === -1) return

        const task = state.tasks[taskIndex]
        const oldStatus = task.status

        // Retirer la tâche de sa position actuelle
        state.tasks.splice(taskIndex, 1)

        // Mettre à jour les positions des tâches dans l'ancienne colonne
        state.tasks
          .filter(t => t.status === oldStatus && t.position > task.position)
          .forEach(t => t.position--)

        // Mettre à jour la tâche
        task.status = newStatus
        task.position = newPosition
        task.updatedAt = new Date().toISOString()

        // Décaler les tâches dans la nouvelle colonne
        state.tasks
          .filter(t => t.status === newStatus && t.position >= newPosition)
          .forEach(t => t.position++)

        // Insérer la tâche à sa nouvelle position
        state.tasks.push(task)
        
        // Trier par position
        state.tasks.sort((a, b) => a.position - b.position)
      })

      try {
        await tasksApi.moveTask(taskId, newStatus, newPosition)
      } catch (error) {
        // Rollback en cas d'erreur
        const tasks = await tasksApi.fetchTasks(get().selectedProjectId ?? undefined)
        set((state) => {
          state.tasks = tasks
        })
        throw error
      }
    },

    fetchTasks: async () => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const tasks = await tasksApi.fetchTasks(get().selectedProjectId ?? undefined)
        set((state) => {
          state.tasks = tasks
          state.isLoading = false
        })
      } catch (error) {
        set((state) => {
          state.isLoading = false
          state.error = error instanceof Error ? error.message : 'Erreur lors du chargement'
        })
      }
    },

    setProjects: (projects) => set((state) => {
      state.projects = projects
    }),

    selectProject: (projectId) => set((state) => {
      state.selectedProjectId = projectId
    }),

    clearError: () => set((state) => {
      state.error = null
    }),

    reset: () => set(initialState),
  }))
)