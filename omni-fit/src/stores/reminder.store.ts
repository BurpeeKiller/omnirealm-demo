import { create } from 'zustand';
import {
  differenceInSeconds,
  addMinutes,
  format,
  parseISO,
  isAfter,
  isBefore,
  startOfToday,
} from 'date-fns';
import { useSettingsStore } from './settings.store';
import { soundGenerator } from '@/utils/sound';
import { reminderWorkerService } from '@/services/reminder-worker';

interface ReminderState {
  nextReminderTime: Date | null;
  timeUntilNextReminder: string;
  isInActiveHours: boolean;
  intervalId: number | null;
  startTimer: () => void;
  stopTimer: () => void;
  checkActiveHours: () => boolean;
  calculateNextReminder: () => Date | null;
  updateCountdown: () => void;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  nextReminderTime: null,
  timeUntilNextReminder: '--:--',
  isInActiveHours: false,
  intervalId: null,

  checkActiveHours: () => {
    const settings = useSettingsStore.getState();
    const now = new Date();
    const today = startOfToday();

    const startTime = parseISO(`${format(today, 'yyyy-MM-dd')}T${settings.startTime}`);
    const endTime = parseISO(`${format(today, 'yyyy-MM-dd')}T${settings.endTime}`);

    const dayName = format(now, 'EEE');
    const isActiveDay = settings.activeDays.includes(dayName);

    const inTimeRange = isAfter(now, startTime) && isBefore(now, endTime);

    return isActiveDay && inTimeRange && settings.enabled;
  },

  calculateNextReminder: () => {
    const { checkActiveHours } = get();
    const settings = useSettingsStore.getState();

    if (!checkActiveHours()) {
      return null;
    }

    const now = new Date();
    const nextTime = addMinutes(now, settings.frequency);

    const today = startOfToday();
    const endTime = parseISO(`${format(today, 'yyyy-MM-dd')}T${settings.endTime}`);

    if (isAfter(nextTime, endTime)) {
      return null;
    }

    return nextTime;
  },

  updateCountdown: () => {
    const { nextReminderTime } = get();

    if (!nextReminderTime) {
      set({ timeUntilNextReminder: '--:--' });
      return;
    }

    const now = new Date();
    const secondsLeft = differenceInSeconds(nextReminderTime, now);

    if (secondsLeft <= 0) {
      // Trigger reminder
      const settings = useSettingsStore.getState();
      if (settings.soundEnabled) {
        soundGenerator.playReminderSound();
      }

      if (settings.vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('OmniFit! 💪', {
          body: "C'est l'heure de faire vos exercices!",
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      }

      // Calculate next reminder
      const nextTime = get().calculateNextReminder();
      set({ nextReminderTime: nextTime });
      return;
    }

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    set({
      timeUntilNextReminder: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    });
  },

  startTimer: () => {
    const { stopTimer, checkActiveHours, calculateNextReminder, updateCountdown } = get();

    stopTimer();

    const isActive = checkActiveHours();
    set({ isInActiveHours: isActive });

    if (isActive) {
      const nextTime = calculateNextReminder();
      set({ nextReminderTime: nextTime });
    }

    // Configurer les rappels via le service worker
    const settings = useSettingsStore.getState();
    const today = startOfToday();
    const startTime = parseISO(`${format(today, 'yyyy-MM-dd')}T${settings.startTime}`);
    const endTime = parseISO(`${format(today, 'yyyy-MM-dd')}T${settings.endTime}`);
    
    reminderWorkerService.scheduleReminders({
      enabled: settings.enabled,
      startHour: startTime.getHours(),
      endHour: endTime.getHours(),
      intervalMinutes: settings.frequency,
    }).catch(console.error);

    updateCountdown();

    const id = window.setInterval(() => {
      const isActive = checkActiveHours();
      set({ isInActiveHours: isActive });

      if (!get().nextReminderTime && isActive) {
        const nextTime = calculateNextReminder();
        set({ nextReminderTime: nextTime });
      }

      updateCountdown();
    }, 1000);

    set({ intervalId: id });
  },

  stopTimer: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null });
    }
    
    // Annuler les rappels du service worker
    reminderWorkerService.cancelAllReminders().catch(console.error);
  },
}));
