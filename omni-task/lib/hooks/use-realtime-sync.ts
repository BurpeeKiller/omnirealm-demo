'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './use-auth'
import { createLogger } from '@/lib/logger'
import type { Task, Project } from '@/lib/types'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

const logger = createLogger('use-realtime-sync')

// Types pour les événements de synchronisation
export interface SyncEvent<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  table: 'tasks' | 'projects' | 'user_preferences'
  record: T
  timestamp: string
}

export interface SyncStatus {
  connected: boolean
  syncing: boolean
  lastSync: Date | null
  conflicts: number
  error: string | null
}

export interface UseRealtimeSyncReturn {
  // État de synchronisation
  syncStatus: SyncStatus
  
  // Données synchronisées
  tasks: Task[]
  projects: Project[]
  
  // Actions
  forcSync: () => Promise<void>
  clearSyncError: () => void
  resolveConflicts: () => Promise<void>
  
  // Callbacks personnalisés
  onTaskChange?: (event: SyncEvent<Task>) => void
  onProjectChange?: (event: SyncEvent<Project>) => void
  onConnectionChange?: (connected: boolean) => void
}

export function useRealtimeSync(): UseRealtimeSyncReturn {
  const { user } = useAuth()
  const supabase = createClient()
  
  // État de synchronisation
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    connected: false,
    syncing: false,
    lastSync: null,
    conflicts: 0,
    error: null
  })
  
  // Données synchronisées
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  
  // Références pour les channels
  const tasksChannelRef = useRef<RealtimeChannel | null>(null)
  const projectsChannelRef = useRef<RealtimeChannel | null>(null)
  const preferencesChannelRef = useRef<RealtimeChannel | null>(null)
  
  // Cache pour la détection de conflits
  const lastUpdatesRef = useRef<Map<string, Date>>(new Map())
  
  // Mise à jour du statut de connexion
  const updateConnectionStatus = useCallback((connected: boolean) => {
    setSyncStatus(prev => ({ ...prev, connected }))
    logger.info(`Realtime connection status: ${connected ? 'connected' : 'disconnected'}`)
  }, [])
  
  // Mise à jour du statut de synchronisation
  const updateSyncStatus = useCallback((syncing: boolean, error?: string | null) => {
    setSyncStatus(prev => ({
      ...prev,
      syncing,
      lastSync: syncing ? prev.lastSync : new Date(),
      error: error || (syncing ? prev.error : null)
    }))
  }, [])
  
  // Gestion des événements de tâches
  const handleTaskChange = useCallback((payload: RealtimePostgresChangesPayload<Task>) => {
    logger.debug('Task realtime event:', payload)
    
    updateSyncStatus(true)
    
    try {
      switch (payload.eventType) {
        case 'INSERT':
          if (payload.new) {
            setTasks(prev => {
              // Éviter les doublons
              const exists = prev.some(task => task.id === payload.new.id)
              if (exists) return prev
              return [...prev, payload.new as Task]
            })
          }
          break
          
        case 'UPDATE':
          if (payload.new) {
            const updatedTask = payload.new as Task
            
            // Détection de conflit basique
            const lastUpdate = lastUpdatesRef.current.get(updatedTask.id)
            const currentUpdate = new Date(updatedTask.updatedAt)
            
            if (lastUpdate && currentUpdate < lastUpdate) {
              logger.warn('Potential conflict detected for task:', updatedTask.id)
              setSyncStatus(prev => ({ ...prev, conflicts: prev.conflicts + 1 }))
            }
            
            setTasks(prev => prev.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            ))
            
            // Mettre à jour le cache
            lastUpdatesRef.current.set(updatedTask.id, currentUpdate)
          }
          break
          
        case 'DELETE':
          if (payload.old) {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id))
            lastUpdatesRef.current.delete(payload.old.id)
          }
          break
      }
    } catch (error) {
      logger.error('Error handling task change:', error)
      updateSyncStatus(false, 'Erreur lors de la synchronisation des tâches')
    } finally {
      updateSyncStatus(false)
    }
  }, [updateSyncStatus])
  
  // Gestion des événements de projets
  const handleProjectChange = useCallback((payload: RealtimePostgresChangesPayload<Project>) => {
    logger.debug('Project realtime event:', payload)
    
    updateSyncStatus(true)
    
    try {
      switch (payload.eventType) {
        case 'INSERT':
          if (payload.new) {
            setProjects(prev => {
              const exists = prev.some(project => project.id === payload.new.id)
              if (exists) return prev
              return [...prev, payload.new as Project]
            })
          }
          break
          
        case 'UPDATE':
          if (payload.new) {
            const updatedProject = payload.new as Project
            
            // Détection de conflit
            const lastUpdate = lastUpdatesRef.current.get(updatedProject.id)
            const currentUpdate = new Date(updatedProject.updatedAt)
            
            if (lastUpdate && currentUpdate < lastUpdate) {
              logger.warn('Potential conflict detected for project:', updatedProject.id)
              setSyncStatus(prev => ({ ...prev, conflicts: prev.conflicts + 1 }))
            }
            
            setProjects(prev => prev.map(project => 
              project.id === updatedProject.id ? updatedProject : project
            ))
            
            lastUpdatesRef.current.set(updatedProject.id, currentUpdate)
          }
          break
          
        case 'DELETE':
          if (payload.old) {
            setProjects(prev => prev.filter(project => project.id !== payload.old.id))
            lastUpdatesRef.current.delete(payload.old.id)
          }
          break
      }
    } catch (error) {
      logger.error('Error handling project change:', error)
      updateSyncStatus(false, 'Erreur lors de la synchronisation des projets')
    } finally {
      updateSyncStatus(false)
    }
  }, [updateSyncStatus])
  
  // Charger les données initiales
  const loadInitialData = useCallback(async () => {
    if (!user?.id) return
    
    try {
      updateSyncStatus(true)
      
      // Charger les tâches
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('position')
      
      if (tasksError) throw tasksError
      
      // Charger les projets
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('created_at')
      
      if (projectsError) throw projectsError
      
      setTasks(tasksData || [])
      setProjects(projectsData || [])
      
      // Initialiser le cache des timestamps
      tasksData?.forEach(task => {
        lastUpdatesRef.current.set(task.id, new Date(task.updated_at))
      })
      
      projectsData?.forEach(project => {
        lastUpdatesRef.current.set(project.id, new Date(project.updated_at))
      })
      
      logger.info(`Loaded ${tasksData?.length || 0} tasks and ${projectsData?.length || 0} projects`)
      
    } catch (error) {
      logger.error('Error loading initial data:', error)
      updateSyncStatus(false, 'Erreur lors du chargement initial')
    } finally {
      updateSyncStatus(false)
    }
  }, [user?.id, supabase, updateSyncStatus])
  
  // Configurer les subscriptions temps réel
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user?.id) return
    
    logger.info('Setting up realtime subscriptions for user:', user.id)
    
    // Channel pour les tâches
    tasksChannelRef.current = supabase
      .channel(`tasks_user_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        },
        handleTaskChange
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Tasks realtime subscription active')
          updateConnectionStatus(true)
        } else if (status === 'CLOSED') {
          logger.warn('Tasks realtime subscription closed')
          updateConnectionStatus(false)
        }
      })
    
    // Channel pour les projets
    projectsChannelRef.current = supabase
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
        if (status === 'SUBSCRIBED') {
          logger.info('Projects realtime subscription active')
        } else if (status === 'CLOSED') {
          logger.warn('Projects realtime subscription closed')
          updateConnectionStatus(false)
        }
      })
    
  }, [user?.id, supabase, handleTaskChange, handleProjectChange, updateConnectionStatus])
  
  // Nettoyer les subscriptions
  const cleanupSubscriptions = useCallback(() => {
    logger.info('Cleaning up realtime subscriptions')
    
    if (tasksChannelRef.current) {
      supabase.removeChannel(tasksChannelRef.current)
      tasksChannelRef.current = null
    }
    
    if (projectsChannelRef.current) {
      supabase.removeChannel(projectsChannelRef.current)
      projectsChannelRef.current = null
    }
    
    if (preferencesChannelRef.current) {
      supabase.removeChannel(preferencesChannelRef.current)
      preferencesChannelRef.current = null
    }
    
    updateConnectionStatus(false)
  }, [supabase, updateConnectionStatus])
  
  // Forcer une synchronisation
  const forcSync = useCallback(async () => {
    logger.info('Force sync requested')
    await loadInitialData()
  }, [loadInitialData])
  
  // Effacer les erreurs de sync
  const clearSyncError = useCallback(() => {
    setSyncStatus(prev => ({ ...prev, error: null }))
  }, [])
  
  // Résoudre les conflits (pour l'instant, juste reset le compteur)
  const resolveConflicts = useCallback(async () => {
    logger.info('Resolving conflicts')
    setSyncStatus(prev => ({ ...prev, conflicts: 0 }))
    await forcSync()
  }, [forcSync])
  
  // Effet pour initialiser la synchronisation
  useEffect(() => {
    if (user?.id) {
      loadInitialData()
      setupRealtimeSubscriptions()
    } else {
      cleanupSubscriptions()
      setTasks([])
      setProjects([])
    }
    
    return cleanupSubscriptions
  }, [user?.id, loadInitialData, setupRealtimeSubscriptions, cleanupSubscriptions])
  
  // Effet pour la gestion de la visibilité (pause/resume)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause quand l'onglet est caché
        logger.debug('Tab hidden, pausing realtime')
      } else {
        // Resume et sync quand l'onglet redevient visible
        logger.debug('Tab visible, resuming realtime')
        if (user?.id && !syncStatus.connected) {
          setupRealtimeSubscriptions()
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user?.id, syncStatus.connected, setupRealtimeSubscriptions])
  
  return {
    syncStatus,
    tasks,
    projects,
    forcSync,
    clearSyncError,
    resolveConflicts
  }
}