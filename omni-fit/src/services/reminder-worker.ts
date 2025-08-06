// Service de gestion des rappels avec le Service Worker

export class ReminderWorkerService {
  private static instance: ReminderWorkerService;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): ReminderWorkerService {
    if (!ReminderWorkerService.instance) {
      ReminderWorkerService.instance = new ReminderWorkerService();
    }
    return ReminderWorkerService.instance;
  }

  async init() {
    if ('serviceWorker' in navigator) {
      this.registration = await navigator.serviceWorker.ready;
    }
  }

  // Planifier des rappels via le service worker
  async scheduleReminders(config: {
    enabled: boolean;
    startHour: number;
    endHour: number;
    intervalMinutes: number;
  }) {
    if (!this.registration) {
      await this.init();
    }

    // Sauvegarder la config dans IndexedDB pour le SW
    await this.saveReminderConfig(config);

    // Envoyer un message au SW pour mettre à jour les rappels
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'UPDATE_REMINDERS',
        config,
      });
    }

    // Si les rappels sont activés, demander la permission
    if (config.enabled) {
      await this.requestNotificationPermission();
      await this.scheduleNextReminder();
    }
  }

  // Sauvegarder la configuration dans IndexedDB
  private async saveReminderConfig(config: any) {
    const { db } = await import('@/db');
    await db.settings.put({
      key: 'reminders',
      value: config,
    });
  }

  // Demander la permission pour les notifications
  private async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission notifications refusée');
      }
    }
  }

  // Planifier le prochain rappel
  async scheduleNextReminder() {
    const config = await this.getReminderConfig();
    if (!config || !config.enabled) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Calculer le prochain rappel
    const nextReminderTime = new Date();
    
    // Si on est dans la plage horaire
    if (currentHour >= config.startHour && currentHour <= config.endHour) {
      // Calculer les minutes jusqu'au prochain intervalle
      const minutesUntilNext = config.intervalMinutes - (currentMinute % config.intervalMinutes);
      nextReminderTime.setMinutes(currentMinute + minutesUntilNext);
    } else if (currentHour < config.startHour) {
      // Prochain rappel au début de la plage
      nextReminderTime.setHours(config.startHour, 0, 0, 0);
    } else {
      // Prochain rappel demain
      nextReminderTime.setDate(nextReminderTime.getDate() + 1);
      nextReminderTime.setHours(config.startHour, 0, 0, 0);
    }

    const delay = nextReminderTime.getTime() - now.getTime();
    
    // Planifier via setTimeout (fallback si pas de Periodic Sync)
    setTimeout(() => {
      this.showReminder();
      this.scheduleNextReminder(); // Planifier le suivant
    }, delay);
  }

  // Récupérer la configuration des rappels
  private async getReminderConfig() {
    const { db } = await import('@/db');
    const setting = await db.settings.get('reminders');
    return setting?.value;
  }

  // Afficher un rappel
  private async showReminder() {
    const exercises = ['Burpees', 'Pompes', 'Squats'];
    const exercise = exercises[Math.floor(Math.random() * exercises.length)];
    const count = 10;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💪 OmniFit', {
        body: `C'est l'heure de faire ${count} ${exercise}!`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'omnifit',
        requireInteraction: true,
        actions: [
          { action: 'complete', title: 'Fait ✓' },
          { action: 'snooze', title: 'Plus tard' },
        ] as NotificationAction[],
        data: {
          exercise,
          count,
          timestamp: Date.now(),
        },
      });
    }
  }

  // Tester un rappel immédiatement
  async testReminder() {
    await this.requestNotificationPermission();
    await this.showReminder();
  }

  // Annuler tous les rappels
  async cancelAllReminders() {
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'CANCEL_REMINDERS',
      });
    }
  }
}

export const reminderWorkerService = ReminderWorkerService.getInstance();