'use client'

import { useState } from 'react'
import { Wifi, WifiOff, Loader2, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SyncStatus } from '@/lib/hooks/use-realtime-sync'
import type { NetworkStatus } from '@/lib/hooks/use-network-status'

export interface SyncStatusIndicatorProps {
  syncStatus: SyncStatus
  networkStatus: NetworkStatus
  onForceSync?: () => Promise<void>
  onReconnect?: () => void
  onResolveConflicts?: () => Promise<void>
  className?: string
}

export function SyncStatusIndicator({
  syncStatus,
  networkStatus,
  onForceSync,
  onReconnect,
  onResolveConflicts,
  className = ''
}: SyncStatusIndicatorProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  // Déterminer le statut principal
  const getMainStatus = () => {
    if (!networkStatus.online) return 'offline'
    if (!syncStatus.connected) return 'disconnected'
    if (syncStatus.syncing) return 'syncing'
    if (syncStatus.conflicts > 0) return 'conflicts'
    if (syncStatus.error) return 'error'
    return 'connected'
  }
  
  const mainStatus = getMainStatus()
  
  // Configuration de l'apparence selon le statut
  const getStatusConfig = () => {
    switch (mainStatus) {
      case 'offline':
        return {
          icon: WifiOff,
          color: 'bg-red-500',
          text: 'Hors ligne',
          badge: 'destructive' as const,
          description: 'Aucune connexion internet'
        }
      case 'disconnected':
        return {
          icon: AlertTriangle,
          color: 'bg-yellow-500',
          text: 'Déconnecté',
          badge: 'secondary' as const,
          description: 'Connexion au serveur perdue'
        }
      case 'syncing':
        return {
          icon: Loader2,
          color: 'bg-blue-500',
          text: 'Synchronisation',
          badge: 'default' as const,
          description: 'Synchronisation en cours...',
          animate: true
        }
      case 'conflicts':
        return {
          icon: AlertTriangle,
          color: 'bg-orange-500',
          text: `${syncStatus.conflicts} conflit${syncStatus.conflicts > 1 ? 's' : ''}`,
          badge: 'destructive' as const,
          description: 'Conflits de synchronisation détectés'
        }
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'bg-red-500',
          text: 'Erreur',
          badge: 'destructive' as const,
          description: syncStatus.error || 'Erreur de synchronisation'
        }
      default:
        return {
          icon: CheckCircle,
          color: 'bg-green-500',
          text: 'Synchronisé',
          badge: 'outline' as const,
          description: 'Tout est à jour'
        }
    }
  }
  
  const config = getStatusConfig()
  const Icon = config.icon
  
  // Formatage de la dernière synchronisation
  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Jamais'
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes}min`
    if (hours < 24) return `Il y a ${hours}h`
    return date.toLocaleDateString()
  }
  
  // Gestion des actions
  const handleForceSync = async () => {
    if (!onForceSync) return
    setIsLoading(true)
    try {
      await onForceSync()
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleResolveConflicts = async () => {
    if (!onResolveConflicts) return
    setIsLoading(true)
    try {
      await onResolveConflicts()
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2 gap-2 ${className}`}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Icon 
                className={`h-4 w-4 ${config.animate ? 'animate-spin' : ''}`}
              />
              <div 
                className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${config.color}`}
              />
            </div>
            <Badge variant={config.badge} className="h-5 text-xs px-1.5">
              {config.text}
            </Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3">
          <h4 className="font-medium mb-2">État de synchronisation</h4>
          <p className="text-sm text-muted-foreground mb-3">
            {config.description}
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut réseau:</span>
              <span className="flex items-center gap-1">
                {networkStatus.online ? (
                  <>
                    <Wifi className="h-3 w-3 text-green-500" />
                    En ligne
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 text-red-500" />
                    Hors ligne
                  </>
                )}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connexion:</span>
              <span>{networkStatus.effectiveType.toUpperCase()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dernière sync:</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatLastSync(syncStatus.lastSync)}
              </span>
            </div>
            
            {syncStatus.conflicts > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conflits:</span>
                <span className="text-orange-600 font-medium">
                  {syncStatus.conflicts}
                </span>
              </div>
            )}
            
            {networkStatus.saveData && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode économie:</span>
                <span className="text-blue-600">Activé</span>
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          {mainStatus === 'offline' && onReconnect && (
            <DropdownMenuItem 
              onClick={onReconnect}
              className="cursor-pointer"
            >
              <Wifi className="h-4 w-4 mr-2" />
              Tenter la reconnexion
            </DropdownMenuItem>
          )}
          
          {mainStatus === 'conflicts' && onResolveConflicts && (
            <DropdownMenuItem 
              onClick={handleResolveConflicts}
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              Résoudre les conflits
            </DropdownMenuItem>
          )}
          
          {onForceSync && mainStatus !== 'offline' && (
            <DropdownMenuItem 
              onClick={handleForceSync}
              disabled={isLoading || syncStatus.syncing}
              className="cursor-pointer"
            >
              {isLoading || syncStatus.syncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Synchroniser maintenant
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}