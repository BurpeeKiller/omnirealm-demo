import { supabase, handleSupabaseError } from '@/lib/supabase/client'
import type { Project } from '@/lib/types'

export const projectsApi = {
  // Récupérer tous les projets de l'utilisateur
  async fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Créer un nouveau projet
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: userData.user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Mettre à jour un projet
  async updateProject(id: string, updates: Partial<Project>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating project:', error)
      throw new Error(handleSupabaseError(error))
    }
  },

  // Archiver un projet
  async archiveProject(id: string) {
    return projectsApi.updateProject(id, { isArchived: true })
  }
}