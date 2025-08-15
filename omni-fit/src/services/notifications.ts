import { logger } from '@/utils/logger';

// Capacitor imports commented out - PWA mode only
// import { LocalNotifications } from '@capacitor/local-notifications';
// import { Capacitor } from '@capacitor/core';

export async function setupNotifications() {
  // PWA mode only
  logger.info('Notifications: Running in web mode');

  // Request web notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  return;
}

export async function scheduleWorkoutReminder(
  _hour: number,
  _minute: number,
  exerciseType: string,
  count: number = 10,
) {
  // PWA mode only - use web notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification('💪 OmniFit', {
        body: `C'est l'heure de faire ${count} ${exerciseType}!`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      });
    }, 1000);
  }
  return;
}

export async function cancelAllReminders() {
  // PWA mode only - no native notifications to cancel
  return;
}

export async function scheduleMultipleReminders(
  startHour: number,
  endHour: number,
  intervalMinutes: number,
  exercises: { type: string; count: number }[],
) {
  await cancelAllReminders();

  const now = new Date();
  const reminders = [];

  // Générer les heures de rappel
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break;

      // Choisir un exercice aléatoire
      const exercise = exercises[Math.floor(Math.random() * exercises.length)];
      
      if (!exercise) continue;

      const scheduledTime = new Date();
      scheduledTime.setHours(hour, minute, 0, 0);

      // Si l'heure est passée aujourd'hui, programmer pour demain
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      reminders.push({
        title: '💪 OmniFit',
        body: `Temps pour ${exercise.count} ${exercise.type}!`,
        id: reminders.length + 1,
        schedule: {
          at: scheduledTime,
          allowWhileIdle: true,
          repeats: true,
          every: 'day',
        },
        actionTypeId: 'WORKOUT_REMINDER',
        extra: {
          exerciseType: exercise?.type || '',
          count: exercise?.count || 0,
        },
        sound: 'beep.wav',
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#4F46E5',
      });
    }
  }

  // PWA mode only - schedule web notifications instead
  // Note: Web Notifications API doesn't support scheduling
  // Would need to use Service Worker for scheduled notifications

  return reminders.length;
}
