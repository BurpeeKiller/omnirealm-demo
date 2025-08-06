import { supabase, handleSupabaseError } from '@/lib/supabase/client'
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/lib/types'
import type { Database } from '@/lib/supabase/database.types'

type DbTask = Database['public']['Tables']['tasks']['Row']

// Convertir une tâche DB en Task du domaine
function mapDbTaskToTask(dbTask: DbTask): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description ?? undefined,
    status: dbTask.status as TaskStatus,
    priority: dbTask.priority,
    projectId: dbTask.project_id ?? undefined,
    userId: dbTask.user_id,
    assigneeId: dbTask.assignee_id ?? undefined,
    position: dbTask.position,
    dueDate: dbTask.due_date ?? undefined,
    estimatedHours: dbTask.estimated_hours ?? undefined,
    actualHours: dbTask.actual_hours ?? undefined,
    tags: dbTask.tags ?? undefined,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at,
  }
}

export const tasksApi = {
  // Récupérer toutes les tâches de l'utilisateur
  async fetchTasks(projectId?: string) {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query

      if (error) throw error
      return data ? data.map(mapDbTaskToTask) : []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Créer une nouvelle tâche
  async createTask(taskData: CreateTaskInput) {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) throw new Error('User not authenticated')

      // Obtenir la position max pour le statut
      const { data: positionData } = await supabase
        .from('tasks')
        .select('position')
        .eq('status', 'TODO')
        .eq('user_id', userData.user.id)
        .order('position', { ascending: false })
        .limit(1)

      const position = positionData?.[0]?.position ?? -1

      // Mapper les champs pour correspondre aux noms de colonnes DB
      const dbTask = {
        title: taskData.title,
        description: taskData.description,
        status: 'TODO',
        priority: taskData.priority,
        project_id: taskData.projectId,
        due_date: taskData.dueDate,
        estimated_hours: taskData.estimatedHours,
        tags: taskData.tags,
        user_id: userData.user.id,
        position: position + 1,
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(dbTask)
        .select()
        .single()

      if (error) throw error
      return mapDbTaskToTask(data)
    } catch (error) {
      console.error('Error creating task:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Mettre à jour une tâche
  async updateTask(id: string, updates: UpdateTaskInput) {
    try {
      // Mapper les champs pour correspondre aux noms de colonnes DB
      const dbUpdates: any = {}
      if (updates.title !== undefined) dbUpdates.title = updates.title
      if (updates.description !== undefined) dbUpdates.description = updates.description
      if (updates.status !== undefined) dbUpdates.status = updates.status
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority
      if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate
      if (updates.estimatedHours !== undefined) dbUpdates.estimated_hours = updates.estimatedHours
      if (updates.actualHours !== undefined) dbUpdates.actual_hours = updates.actualHours
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags
      if (updates.position !== undefined) dbUpdates.position = updates.position

      const { data, error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return mapDbTaskToTask(data)
    } catch (error) {
      console.error('Error updating task:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Supprimer une tâche
  async deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting task:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Déplacer une tâche (drag & drop)
  async moveTask(taskId: string, newStatus: TaskStatus, newPosition: number) {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('User not authenticated')

      // Transaction manuelle car Supabase ne supporte pas les transactions côté client
      // 1. Récupérer la tâche actuelle
      const { data: task, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

      if (fetchError || !task) throw fetchError

      const oldStatus = task.status
      const oldPosition = task.position

      // 2. Mettre à jour les positions dans l'ancienne colonne
      if (oldStatus === newStatus) {
        // Déplacement dans la même colonne
        if (oldPosition < newPosition) {
          // Déplacement vers le bas
          await supabase
            .from('tasks')
            .update({ position: `position - 1` })
            .eq('status', oldStatus)
            .eq('user_id', userData.user.id)
            .gt('position', oldPosition)
            .lte('position', newPosition)
        } else if (oldPosition > newPosition) {
          // Déplacement vers le haut
          await supabase
            .from('tasks')
            .update({ position: `position + 1` })
            .eq('status', oldStatus)
            .eq('user_id', userData.user.id)
            .gte('position', newPosition)
            .lt('position', oldPosition)
        }
      } else {
        // Déplacement entre colonnes
        // Décaler dans l'ancienne colonne
        await supabase
          .from('tasks')
          .update({ position: `position - 1` })
          .eq('status', oldStatus)
          .eq('user_id', userData.user.id)
          .gt('position', oldPosition)

        // Décaler dans la nouvelle colonne
        await supabase
          .from('tasks')
          .update({ position: `position + 1` })
          .eq('status', newStatus)
          .eq('user_id', userData.user.id)
          .gte('position', newPosition)
      }

      // 3. Mettre à jour la tâche déplacée
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          position: newPosition,
        })
        .eq('id', taskId)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Error moving task:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Souscrire aux changements en temps réel
  subscribeToTasks(callback: (payload: any) => void) {
    return supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        callback
      )
      .subscribe()
  },
}