'use client'

import { useState, useEffect, useCallback } from 'react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('use-network-status')

export interface NetworkStatus {
  online: boolean
  connectionType: 'wifi' | 'cellular' | '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  downlink: number // Mbps
  rtt: number // ms - Round Trip Time
  saveData: boolean // Data Saver mode
}

export interface UseNetworkStatusReturn {
  networkStatus: NetworkStatus
  isOnline: boolean
  isOffline: boolean
  isSlowConnection: boolean
  canSync: boolean
  reconnect: () => void
}

// Fonction pour déterminer si la connexion est lente
const isConnectionSlow = (status: NetworkStatus): boolean => {
  return (
    status.effectiveType === 'slow-2g' || 
    status.effectiveType === '2g' ||
    status.downlink < 1.5 ||
    status.rtt > 300
  )
}

// Fonction pour déterminer si on peut synchroniser
const canPerformSync = (status: NetworkStatus): boolean => {
  return (
    status.online && 
    !status.saveData && 
    (status.effectiveType === '4g' || status.effectiveType === '3g' || status.downlink > 1)
  )
}

export function useNetworkStatus(): UseNetworkStatusReturn {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  })

  // Fonction pour obtenir les informations de connexion
  const getConnectionInfo = useCallback((): Partial<NetworkStatus> => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return {
        online: true,
        connectionType: 'unknown',
        effectiveType: 'unknown',
        downlink: 10, // Valeur par défaut optimiste
        rtt: 100,
        saveData: false
      }
    }

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (!connection) {
      return {
        online: navigator.onLine,
        connectionType: 'unknown',
        effectiveType: 'unknown',
        downlink: navigator.onLine ? 10 : 0,
        rtt: navigator.onLine ? 100 : 0,
        saveData: false
      }
    }

    return {
      online: navigator.onLine,
      connectionType: connection.type || connection.effectiveType || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    }
  }, [])

  // Mettre à jour le statut réseau
  const updateNetworkStatus = useCallback(() => {
    const newStatus = {
      ...networkStatus,
      ...getConnectionInfo()
    }
    
    setNetworkStatus(newStatus)
    
    logger.debug('Network status updated:', {
      online: newStatus.online,
      effectiveType: newStatus.effectiveType,
      downlink: newStatus.downlink,
      rtt: newStatus.rtt,
      saveData: newStatus.saveData
    })
  }, [networkStatus, getConnectionInfo])

  // Fonction de reconnexion manuelle
  const reconnect = useCallback(() => {
    logger.info('Manual reconnection attempt')
    updateNetworkStatus()
    
    // Test de connectivité basique
    if (typeof fetch !== 'undefined') {
      fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      })
      .then(() => {
        logger.info('Reconnection test successful')
        updateNetworkStatus()
      })
      .catch((error) => {
        logger.warn('Reconnection test failed:', error.message)
      })
    }
  }, [updateNetworkStatus])

  // Effet pour écouter les changements de statut réseau
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Handlers pour les événements de connexion
    const handleOnline = () => {
      logger.info('Network: ONLINE')
      updateNetworkStatus()
    }

    const handleOffline = () => {
      logger.info('Network: OFFLINE')
      updateNetworkStatus()
    }

    const handleConnectionChange = () => {
      logger.debug('Network connection changed')
      updateNetworkStatus()
    }

    // Écouter les événements
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Écouter les changements de connexion (si disponible)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection

      if (connection) {
        connection.addEventListener('change', handleConnectionChange)
      }
    }

    // Statut initial
    updateNetworkStatus()

    // Polling périodique pour détecter les changements (toutes les 30s)
    const interval = setInterval(() => {
      if (navigator.onLine !== networkStatus.online) {
        updateNetworkStatus()
      }
    }, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection || 
                          (navigator as any).mozConnection || 
                          (navigator as any).webkitConnection

        if (connection) {
          connection.removeEventListener('change', handleConnectionChange)
        }
      }

      clearInterval(interval)
    }
  }, [updateNetworkStatus, networkStatus.online])

  // Variables dérivées pour simplifier l'utilisation
  const isOnline = networkStatus.online
  const isOffline = !networkStatus.online
  const isSlowConnection = isConnectionSlow(networkStatus)
  const canSync = canPerformSync(networkStatus)

  return {
    networkStatus,
    isOnline,
    isOffline,
    isSlowConnection,
    canSync,
    reconnect
  }
}