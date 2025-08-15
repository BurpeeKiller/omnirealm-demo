// @ts-ignore - VitePWA virtual module
import { registerSW } from 'virtual:pwa-register';
import { logger } from '@/utils/logger';

export const registerServiceWorker = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      // Nouvelle version disponible
      if (confirm('Nouvelle version disponible ! Voulez-vous mettre à jour ?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      logger.info('✅ App prête pour utilisation hors ligne');
      // Notifier l'utilisateur
      showOfflineReadyNotification();
    },
    onRegistered(r: any) {
      logger.info('✅ Service Worker enregistré');
      // Vérification de mise à jour toutes les heures
      r && setInterval(() => {
        r.update();
      }, 60 * 60 * 1000);
      
      // Enregistrer le Background Sync
      registerBackgroundSync();
      
      // Enregistrer le Periodic Background Sync si disponible
      registerPeriodicSync();
    },
    onRegisterError(error: any) {
      logger.error('❌ Erreur enregistrement SW:', error);
    },
  });
};

// Enregistrer le Background Sync
async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register('fitness-sync');
      logger.info('✅ Background Sync activé');
    } catch (error) {
      logger.warn('Background Sync non disponible:', error);
    }
  }
}

// Enregistrer le Periodic Background Sync
async function registerPeriodicSync() {
  if ('serviceWorker' in navigator && 'periodicSync' in (window as any)) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as any,
      });
      
      if (status.state === 'granted') {
        await (registration as any).periodicSync.register('omni-fit', {
          minInterval: 60 * 60 * 1000, // 1 heure
        });
        logger.info('✅ Periodic Sync activé');
      }
    } catch (error) {
      logger.warn('Periodic Sync non disponible:', error);
    }
  }
}

// Afficher une notification offline ready
function showOfflineReadyNotification() {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up';
  notification.textContent = '✅ Application prête pour utilisation hors ligne';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('animate-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Vérifier si l'app est en mode offline
export const isOffline = () => !navigator.onLine;

// Vérifier si PWA est installée
export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

// Gestionnaire d'état online/offline
export const setupNetworkHandlers = () => {
  window.addEventListener('online', () => {
    logger.info('✅ Connexion rétablie');
    // Possibilité de synchroniser les données ici
  });

  window.addEventListener('offline', () => {
    logger.info('⚠️ Mode hors ligne activé');
  });
};