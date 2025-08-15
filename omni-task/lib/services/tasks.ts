import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export interface TaskWithDetails extends Omit<Task, 'tags'> {
  tags?: Array<{ id: string; name: string; color: string }>
  project?: {
    id: string
    name: string
    color: string
  }
  comments_count?: number
}

export const taskService = {
  // Récupérer toutes les tâches de l'utilisateur
  async getAllTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(id, name, color),
        task_tags(
          tag:tags(id, name, color)
        )
      `)
      .eq('is_archived', false)
      .order('position', { ascending: true })

    if (error) throw error

    // Transformer les données pour avoir un format plus simple
    const tasks = data?.map(task => ({
      ...task,
      tags: task.task_tags?.map((tt: any) => tt.tag) || []
    })) || []

    return tasks as TaskWithDetails[]
  },

  // Récupérer les tâches d'un projet
  async getProjectTasks(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_tags(
          tag:tags(id, name, color)
        )
      `)
      .eq('project_id', projectId)
      .eq('is_archived', false)
      .order('position', { ascending: true })

    if (error) throw error

    const tasks = data?.map(task => ({
      ...task,
      tags: task.task_tags?.map((tt: any) => tt.tag) || []
    })) || []

    return tasks as TaskWithDetails[]
  },

  // Créer une nouvelle tâche
  async createTask(task: Omit<TaskInsert, 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        user_id: user.id,
        position: 0 // Sera ajusté plus tard
      })
      .select()
      .single()

    if (error) throw error
    return data as Task
  },

  // Mettre à jour une tâche
  async updateTask(taskId: string, updates: TaskUpdate) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    return data as Task
  },

  // Supprimer une tâche
  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error
  },

  // Déplacer une tâche (drag & drop)
  async moveTask(taskId: string, newStatus: string, newPosition: number) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        position: newPosition,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    return data as Task
  },

  // Ajouter des tags à une tâche
  async addTagsToTask(taskId: string, tagIds: string[]) {
    const inserts = tagIds.map(tagId => ({
      task_id: taskId,
      tag_id: tagId
    }))

    const { error } = await supabase
      .from('task_tags')
      .insert(inserts)

    if (error) throw error
  },

  // Retirer des tags d'une tâche
  async removeTagsFromTask(taskId: string, tagIds: string[]) {
    const { error } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .in('tag_id', tagIds)

    if (error) throw error
  }
}

// Service pour les projets
export const projectService = {
  // Récupérer tous les projets
  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_archived', false)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Créer un projet
  async createProject(name: string, description?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name,
        description
      })
      .select()
      .single()

    if (error) throw error

    // Créer les statuts par défaut
    await supabase.rpc('create_default_task_statuses', {
      p_project_id: data.id
    })

    return data
  }
}

// Service pour les tags
export const tagService = {
  // Récupérer tous les tags de l'utilisateur
  async getAllTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Créer un tag
  async createTag(name: string, color: string = '#6366f1') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tags')
      .insert({
        user_id: user.id,
        name,
        color
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}