import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

type Permission = 'granted' | 'denied' | 'default';

// Détection d'iOS Safari
const isIOSSafari = () => {
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad|iPhone|iPod/);
  const webkit = !!ua.match(/WebKit/);
  return iOS && webkit && !ua.match(/CriOS|EdgiOS|FxiOS|GSA|OPiOS/);
};

export const useNotification = () => {
  const [permission, setPermission] = useState<Permission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  // Pour l'instant on est toujours en mode web/PWA
  const isNative = false;

  useEffect(() => {
    setIsIOSDevice(isIOSSafari());
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      // Utiliser l'API standard du navigateur
      if ('Notification' in window) {
        setPermission(Notification.permission as Permission);
      } else if (isIOSSafari()) {
        // Sur iOS Safari, les notifications ne sont pas supportées
        // sauf si l'app est ajoutée à l'écran d'accueil
        setPermission('denied');
        logger.info('iOS Safari detected - notifications require Add to Home Screen');
      }
    } catch (error) {
      logger.error('Error checking notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      if (isIOSSafari() && !(window.navigator as any).standalone) {
        // Sur iOS Safari, suggérer d'ajouter à l'écran d'accueil
        logger.warn('iOS Safari: Add to Home Screen required for notifications');
        return 'denied';
      }

      // Utiliser l'API standard du navigateur
      if ('Notification' in window && permission === 'default') {
        const result = await Notification.requestPermission();
        setPermission(result as Permission);
        return result;
      }
    } catch (error) {
      logger.error('Error requesting notification permission:', error);
      setPermission('denied');
      return 'denied';
    }
    return permission;
  };

  const showNotification = async (title: string, options?: NotificationOptions): Promise<Notification | undefined> => {
    try {
      if (isIOSSafari() && !(window.navigator as any).standalone) {
        // Fallback pour iOS Safari : vibration ou son
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        logger.warn('iOS Safari: notification shown as vibration only');
        return;
      }

      if (permission !== 'granted') {
        logger.warn('Notifications not granted');
        return;
      }

      // Utiliser l'API standard du navigateur
      if ('Notification' in window) {
        return new Notification(title, options);
      }
    } catch (error) {
      logger.error('Error showing notification:', error);
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: isNative || ('Notification' in window && (!isIOSDevice || (window.navigator as any).standalone)),
    isLoading,
    isNative,
    isIOSDevice,
    requiresAddToHomeScreen: isIOSDevice && !(window.navigator as any).standalone,
  };
};
