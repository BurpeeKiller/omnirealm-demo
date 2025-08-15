'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRealtimeSync } from '@/lib/hooks/use-realtime-sync'
import { useNetworkStatus } from '@/lib/hooks/use-network-status'
import { useRealtimeProjects } from '@/lib/hooks/use-realtime-projects'
import { SyncStatusIndicator } from './sync-status-indicator'
import { createLogger } from '@/lib/logger'
import type { Task, Project } from '@/lib/types'
import type { SyncStatus } from '@/lib/hooks/use-realtime-sync'
import type { ProjectSyncStatus } from '@/lib/hooks/use-realtime-projects'
import type { NetworkStatus } from '@/lib/hooks/use-network-status'

const logger = createLogger('realtime-provider')

// Contexte pour partager les données de synchronisation
interface RealtimeContextType {
  // Données synchronisées
  tasks: Task[]
  projects: Project[]
  
  // Statuts
  tasksSyncStatus: SyncStatus
  projectsSyncStatus: ProjectSyncStatus
  networkStatus: NetworkStatus
  
  // Actions globales
  forceSync: () => Promise<void>
  reconnect: () => void
  resolveConflicts: () => Promise<void>
  
  // Hooks spécialisés (pour composants qui en ont besoin)
  realtimeTasks: ReturnType<typeof useRealtimeSync>
  realtimeProjects: ReturnType<typeof useRealtimeProjects>
  networkManager: ReturnType<typeof useNetworkStatus>
}

const RealtimeContext = createContext<RealtimeContextType | null>(null)

// Hook pour utiliser le contexte
export function useRealtime(): RealtimeContextType {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}

// Composant fournisseur
interface RealtimeProviderProps {
  children: React.ReactNode
  showStatusIndicator?: boolean
  statusIndicatorPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

export function RealtimeProvider({
  children,
  showStatusIndicator = true,
  statusIndicatorPosition = 'bottom-right',
  className = ''
}: RealtimeProviderProps) {
  // Hooks de synchronisation
  const realtimeTasks = useRealtimeSync()
  const realtimeProjects = useRealtimeProjects()
  const networkManager = useNetworkStatus()
  
  // État de notification pour les changements
  const [lastNotification, setLastNotification] = useState<Date | null>(null)
  
  // Actions globales combinées
  const forceSync = async () => {
    logger.info('Global force sync requested')
    await Promise.all([
      realtimeTasks.forcSync(),
      realtimeProjects.refreshProjects()
    ])
  }
  
  const reconnect = () => {
    logger.info('Global reconnect requested')
    networkManager.reconnect()
  }
  
  const resolveConflicts = async () => {
    logger.info('Global conflict resolution requested')
    await Promise.all([
      realtimeTasks.resolveConflicts(),
      // Les projets n'ont pas de gestion de conflits pour l'instant
    ])
  }
  
  // Surveillance des changements pour les notifications
  useEffect(() => {
    const hasTaskChanges = realtimeTasks.syncStatus.lastSync !== null
    const hasProjectChanges = realtimeProjects.syncStatus.lastSync !== null
    
    if (hasTaskChanges || hasProjectChanges) {
      const latestSync = [
        realtimeTasks.syncStatus.lastSync,
        realtimeProjects.syncStatus.lastSync
      ]
      .filter(Boolean)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0]
      
      if (latestSync && (!lastNotification || latestSync > lastNotification)) {
        setLastNotification(latestSync)
        logger.debug('Data synchronized across devices')
        
        // Ici on pourrait ajouter des notifications toast si nécessaire
        // showNotification('Données synchronisées')
      }
    }
  }, [
    realtimeTasks.syncStatus.lastSync,
    realtimeProjects.syncStatus.lastSync,
    lastNotification
  ])
  
  // Valeur du contexte
  const contextValue: RealtimeContextType = {
    tasks: realtimeTasks.tasks,
    projects: realtimeProjects.projects,
    tasksSyncStatus: realtimeTasks.syncStatus,
    projectsSyncStatus: realtimeProjects.syncStatus,
    networkStatus: networkManager.networkStatus,
    forceSync,
    reconnect,
    resolveConflicts,
    realtimeTasks,
    realtimeProjects,
    networkManager
  }
  
  // Position de l'indicateur
  const getIndicatorPositionClasses = () => {
    const base = 'fixed z-50'
    switch (statusIndicatorPosition) {
      case 'top-left':
        return `${base} top-4 left-4`
      case 'top-right':
        return `${base} top-4 right-4`
      case 'bottom-left':
        return `${base} bottom-4 left-4`
      case 'bottom-right':
      default:
        return `${base} bottom-4 right-4`
    }
  }
  
  return (
    <RealtimeContext.Provider value={contextValue}>
      <div className={className}>
        {children}
        
        {showStatusIndicator && (
          <div className={getIndicatorPositionClasses()}>
            <SyncStatusIndicator
              syncStatus={realtimeTasks.syncStatus}
              networkStatus={networkManager.networkStatus}
              onForceSync={forceSync}
              onReconnect={reconnect}
              onResolveConflicts={resolveConflicts}
            />
          </div>
        )}
      </div>
    </RealtimeContext.Provider>
  )
}

// Hook spécialisé pour les tâches (avec données du contexte)
export function useRealtimeTasks() {
  const { tasks, tasksSyncStatus, realtimeTasks } = useRealtime()
  
  return {
    tasks,
    syncStatus: tasksSyncStatus,
    ...realtimeTasks
  }
}

// Hook spécialisé pour les projets (avec données du contexte)  
export function useRealtimeProjectsContext() {
  const { projects, projectsSyncStatus, realtimeProjects } = useRealtime()
  
  return {
    projects,
    syncStatus: projectsSyncStatus,
    ...realtimeProjects
  }
}

// Hook pour le statut réseau uniquement
export function useNetworkStatusContext() {
  const { networkStatus, networkManager } = useRealtime()
  
  return {
    networkStatus,
    ...networkManager
  }
}