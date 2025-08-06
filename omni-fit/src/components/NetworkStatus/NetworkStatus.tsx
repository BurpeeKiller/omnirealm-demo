import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { syncService } from '@/services/sync';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [syncStatus, setSyncStatus] = useState(syncService.getSyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setSyncStatus(syncService.getSyncStatus());
      
      // Masquer après 3 secondes si online
      setTimeout(() => {
        if (navigator.onLine) setShowStatus(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
      setSyncStatus(syncService.getSyncStatus());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier le statut initial
    if (!navigator.onLine) {
      setShowStatus(true);
    }

    // Mettre à jour le statut de sync périodiquement
    const interval = setInterval(() => {
      setSyncStatus(syncService.getSyncStatus());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleForceSync = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    try {
      await syncService.forceSync();
      setSyncStatus(syncService.getSyncStatus());
    } catch (error) {
      console.error('Erreur sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AnimatePresence>
      {(showStatus || syncStatus.pendingItems > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full shadow-lg ${
            isOnline 
              ? 'bg-green-500/90 text-white' 
              : 'bg-orange-500/90 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5 animate-pulse" />
            )}
            <span className="font-medium">
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>

          {syncStatus.pendingItems > 0 && (
            <>
              <div className="w-px h-5 bg-white/30" />
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {syncStatus.pendingItems} en attente
                </span>
                {isOnline && (
                  <button
                    onClick={handleForceSync}
                    disabled={isSyncing}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                    title="Synchroniser maintenant"
                  >
                    <RefreshCw 
                      className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} 
                    />
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NetworkStatus;