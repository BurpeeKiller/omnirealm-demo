'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './use-auth'
import { useNetworkStatus } from './use-network-status'
import { createLogger } from '@/lib/logger'
import type { Project } from '@/lib/types'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

const logger = createLogger('use-realtime-projects')

export interface ProjectSyncStatus {
  connected: boolean
  syncing: boolean
  lastSync: Date | null
  error: string | null
  pendingOperations: number
}

export interface UseRealtimeProjectsReturn {
  projects: Project[]
  syncStatus: ProjectSyncStatus
  
  // Actions CRUD avec sync temps réel
  createProject: (projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  archiveProject: (id: string) => Promise<void>
  unarchiveProject: (id: string) => Promise<void>
  
  // Utilitaires
  refreshProjects: () => Promise<void>
  clearError: () => void
}

export function useRealtimeProjects(): UseRealtimeProjectsReturn {
  const { user } = useAuth()
  const { canSync, isOnline } = useNetworkStatus()
  const supabase = createClient()
  
  // État des projets
  const [projects, setProjects] = useState<Project[]>([])
  
  // État de synchronisation
  const [syncStatus, setSyncStatus] = useState<ProjectSyncStatus>({
    connected: false,
    syncing: false,
    lastSync: null,
    error: null,
    pendingOperations: 0
  })
  
  // Références pour le channel et le cache
  const channelRef = useRef<RealtimeChannel | null>(null)
  const operationQueueRef = useRef<Array<() => Promise<void>>>([])
  const isProcessingQueueRef = useRef(false)
  
  // Mise à jour du statut de sync
  const updateSyncStatus = useCallback((
    updates: Partial<ProjectSyncStatus>
  ) => {
    setSyncStatus(prev => ({ ...prev, ...updates }))
  }, [])
  
  // Traitement de la queue d'opérations offline
  const processOperationQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || !isOnline || !canSync) return
    
    const queue = operationQueueRef.current
    if (queue.length === 0) return
    
    isProcessingQueueRef.current = true
    updateSyncStatus({ syncing: true, pendingOperations: queue.length })
    
    logger.info(`Processing ${queue.length} pending operations`)
    
    try {
      // Traiter les opérations une par une
      for (const operation of queue) {
        await operation()
      }
      
      // Vider la queue après succès
      operationQueueRef.current = []
      updateSyncStatus({ pendingOperations: 0 })
      
      logger.info('All pending operations processed successfully')
      
    } catch (error) {
      logger.error('Error processing operation queue:', error)
      updateSyncStatus({ 
        error: 'Erreur lors de la synchronisation des modifications'
      })
    } finally {
      isProcessingQueueRef.current = false
      updateSyncStatus({ syncing: false })
    }
  }, [isOnline, canSync, updateSyncStatus])
  
  // Gestionnaire d'événements temps réel
  const handleProjectChange = useCallback((
    payload: RealtimePostgresChangesPayload<Project>
  ) => {
    logger.debug('Project realtime event:', payload.eventType, payload.new?.id)
    
    switch (payload.eventType) {
      case 'INSERT':
        if (payload.new) {
          setProjects(prev => {
            // Éviter les doublons
            const exists = prev.some(p => p.id === payload.new!.id)
            if (exists) return prev
            return [...prev, payload.new as Project]
          })
        }
        break
        
      case 'UPDATE':
        if (payload.new) {
          setProjects(prev => 
            prev.map(p => p.id === payload.new!.id ? payload.new as Project : p)
          )
        }
        break
        
      case 'DELETE':
        if (payload.old) {
          setProjects(prev => prev.filter(p => p.id !== payload.old!.id))
        }
        break
    }
    
    updateSyncStatus({ lastSync: new Date() })
  }, [updateSyncStatus])
  
  // Charger les projets initiaux
  const loadProjects = useCallback(async () => {
    if (!user?.id) return
    
    try {
      updateSyncStatus({ syncing: true, error: null })
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setProjects(data || [])
      updateSyncStatus({ lastSync: new Date() })
      
      logger.info(`Loaded ${data?.length || 0} projects`)
      
    } catch (error) {
      logger.error('Error loading projects:', error)
      updateSyncStatus({ 
        error: 'Erreur lors du chargement des projets'
      })
    } finally {
      updateSyncStatus({ syncing: false })
    }
  }, [user?.id, supabase, updateSyncStatus])
  
  // Configurer la subscription temps réel
  const setupRealtimeSubscription = useCallback(() => {
    if (!user?.id) return
    
    logger.info('Setting up projects realtime subscription')
    
    channelRef.current = supabase
      .channel(`projects_user_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`
        },
        handleProjectChange
      )
      .subscribe((status) => {
        const connected = status === 'SUBSCRIBED'
        updateSyncStatus({ connected })
        
        if (connected) {
          logger.info('Projects realtime subscription active')
        } else if (status === 'CLOSED') {
          logger.warn('Projects realtime subscription closed')
        }
      })
  }, [user?.id, supabase, handleProjectChange, updateSyncStatus])
  
  // Nettoyer la subscription
  const cleanupSubscription = useCallback(() => {
    if (channelRef.current) {
      logger.info('Cleaning up projects realtime subscription')
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
      updateSyncStatus({ connected: false })
    }
  }, [supabase, updateSyncStatus])
  
  // CRUD Operations avec gestion offline
  
  const createProject = useCallback(async (
    projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Project> => {
    if (!user?.id) throw new Error('User not authenticated')
    
    const operation = async () => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: user.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data as Project
    }
    
    if (isOnline && canSync) {
      try {
        updateSyncStatus({ syncing: true })
        const result = await operation()
        updateSyncStatus({ syncing: false, lastSync: new Date() })
        return result
      } catch (error) {
        updateSyncStatus({ syncing: false, error: 'Erreur lors de la création' })
        throw error
      }
    } else {
      // Mode offline: ajouter à la queue
      const tempId = `temp_${Date.now()}`
      const tempProject: Project = {
        id: tempId,
        ...projectData,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Ajouter optimistiquement
      setProjects(prev => [tempProject, ...prev])
      
      // Ajouter à la queue
      operationQueueRef.current.push(operation)
      updateSyncStatus({ pendingOperations: operationQueueRef.current.length })
      
      return tempProject
    }
  }, [user?.id, supabase, isOnline, canSync, updateSyncStatus])
  
  const updateProject = useCallback(async (
    id: string, 
    updates: Partial<Project>
  ): Promise<void> => {
    const operation = async () => {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
      
      if (error) throw error
    }
    
    if (isOnline && canSync) {
      try {
        updateSyncStatus({ syncing: true })
        await operation()
        updateSyncStatus({ syncing: false, lastSync: new Date() })
      } catch (error) {
        updateSyncStatus({ syncing: false, error: 'Erreur lors de la mise à jour' })
        throw error
      }
    } else {
      // Mise à jour optimiste
      setProjects(prev => 
        prev.map(p => p.id === id ? { ...p, ...updates } : p)
      )
      
      // Ajouter à la queue
      operationQueueRef.current.push(operation)
      updateSyncStatus({ pendingOperations: operationQueueRef.current.length })
    }
  }, [user?.id, supabase, isOnline, canSync, updateSyncStatus])
  
  const deleteProject = useCallback(async (id: string): Promise<void> => {
    const operation = async () => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)
      
      if (error) throw error
    }
    
    if (isOnline && canSync) {
      try {
        updateSyncStatus({ syncing: true })
        await operation()
        updateSyncStatus({ syncing: false, lastSync: new Date() })
      } catch (error) {
        updateSyncStatus({ syncing: false, error: 'Erreur lors de la suppression' })
        throw error
      }
    } else {
      // Suppression optimiste
      setProjects(prev => prev.filter(p => p.id !== id))
      
      // Ajouter à la queue
      operationQueueRef.current.push(operation)
      updateSyncStatus({ pendingOperations: operationQueueRef.current.length })
    }
  }, [user?.id, supabase, isOnline, canSync, updateSyncStatus])
  
  const archiveProject = useCallback(async (id: string): Promise<void> => {
    await updateProject(id, { is_archived: true })
  }, [updateProject])
  
  const unarchiveProject = useCallback(async (id: string): Promise<void> => {
    await updateProject(id, { is_archived: false })
  }, [updateProject])
  
  // Utilitaires
  const refreshProjects = useCallback(async () => {
    await loadProjects()
  }, [loadProjects])
  
  const clearError = useCallback(() => {
    updateSyncStatus({ error: null })
  }, [updateSyncStatus])
  
  // Effets
  
  // Initialisation
  useEffect(() => {
    if (user?.id) {
      loadProjects()
      setupRealtimeSubscription()
    } else {
      cleanupSubscription()
      setProjects([])
    }
    
    return cleanupSubscription
  }, [user?.id, loadProjects, setupRealtimeSubscription, cleanupSubscription])
  
  // Traitement de la queue quand on redevient online
  useEffect(() => {
    if (isOnline && canSync) {
      processOperationQueue()
    }
  }, [isOnline, canSync, processOperationQueue])
  
  return {
    projects,
    syncStatus,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    unarchiveProject,
    refreshProjects,
    clearError
  }
}