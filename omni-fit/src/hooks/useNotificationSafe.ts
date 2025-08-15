import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';

type Permission = 'granted' | 'denied' | 'default';

// Version temporaire qui évite les erreurs si Capacitor n'est pas installé
export const useNotification = () => {
  const [permission, setPermission] = useState<Permission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const isNative = false; // Pour l'instant on considère qu'on est toujours sur web

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      // Pour l'instant, uniquement la version web
      if ('Notification' in window) {
        setPermission(Notification.permission as Permission);
      }
    } catch (error) {
      logger.error('Error checking notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      // Version web uniquement pour l'instant
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

  const showNotification = async (title: string, options?: NotificationOptions) => {
    try {
      if (permission !== 'granted') {
        logger.warn('Notifications not granted');
        return;
      }

      // Version web uniquement
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
    isSupported: 'Notification' in window,
    isLoading,
    isNative,
  };
};
