import { useState, useEffect } from 'react';
import { backupService } from '@/services/backup';

export const useBackupNotification = () => {
  const [shouldShowNotification, setShouldShowNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  useEffect(() => {
    const checkBackupNeeded = () => {
      const settings = backupService.getBackupSettings();

      // Si auto-backup désactivé, ne pas afficher
      if (!settings.autoBackupEnabled) {
        return false;
      }

      // Si jamais de backup
      if (!settings.lastBackupDate) {
        return true;
      }

      // Si backup trop ancien (plus d'une semaine)
      const lastBackup = new Date(settings.lastBackupDate);
      const now = new Date();
      const daysSinceBackup = Math.floor(
        (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24),
      );

      return daysSinceBackup >= 7;
    };

    // Vérifier après un délai (pour laisser l'app se charger)
    const timer = setTimeout(() => {
      if (checkBackupNeeded() && !notificationDismissed) {
        setShouldShowNotification(true);
      }
    }, 5000); // 5 secondes

    return () => clearTimeout(timer);
  }, [notificationDismissed]);

  const dismissNotification = () => {
    setNotificationDismissed(true);
    setShouldShowNotification(false);
  };

  const createBackup = async () => {
    try {
      await backupService.downloadBackup();
      dismissNotification();
      return true;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return false;
    }
  };

  return {
    shouldShowNotification,
    dismissNotification,
    createBackup,
  };
};
