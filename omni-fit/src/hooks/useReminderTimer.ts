import { useEffect } from 'react';
import { useReminderStore } from '@/stores/reminder.store';

/**
 * Hook pour gérer le lifecycle du timer de rappel
 * Garantit le nettoyage correct pour éviter les memory leaks
 */
export function useReminderTimer(enabled: boolean = true) {
  const { startTimer, cleanup } = useReminderStore();

  useEffect(() => {
    if (!enabled) return;

    // Démarrer le timer
    startTimer();

    // Cleanup function qui sera appelée au démontage
    return () => {
      cleanup();
    };
  }, [enabled, startTimer, cleanup]);

  // Aussi nettoyer quand la fenêtre se ferme ou l'onglet change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        useReminderStore.getState().stopTimer();
      } else {
        useReminderStore.getState().startTimer();
      }
    };

    const handleBeforeUnload = () => {
      useReminderStore.getState().cleanup();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}