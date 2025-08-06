import { useEffect, useState } from 'react';

type Permission = 'granted' | 'denied' | 'default';

export const useNotification = () => {
  const [permission, setPermission] = useState<Permission>('default');
  const [isLoading, setIsLoading] = useState(true);
  // Pour l'instant on est toujours en mode web/PWA
  const isNative = false;

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      // Utiliser l'API standard du navigateur
      if ('Notification' in window) {
        setPermission(Notification.permission as Permission);
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      // Utiliser l'API standard du navigateur
      if ('Notification' in window && permission === 'default') {
        const result = await Notification.requestPermission();
        setPermission(result as Permission);
        return result;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setPermission('denied');
      return 'denied';
    }
    return permission;
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    try {
      if (permission !== 'granted') {
        console.warn('Notifications not granted');
        return;
      }

      // Utiliser l'API standard du navigateur
      if ('Notification' in window) {
        return new Notification(title, options);
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: isNative || 'Notification' in window,
    isLoading,
    isNative,
  };
};
