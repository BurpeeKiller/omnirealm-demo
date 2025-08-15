import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/types';

// Debounce utility pour éviter les race conditions
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

interface SettingsState extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateSettingsDebounced: (settings: Partial<UserSettings>) => void;
  toggleReminders: () => void;
  setExerciseIncrement: (exercise: string, value: number) => void;
}

const defaultSettings: UserSettings = {
  enabled: true,
  startTime: '09:00',
  endTime: '18:00',
  frequency: 30, // minutes
  exercisesPerReminder: {
    burpees: 10,
    pushups: 10,
    squats: 10,
  },
  activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  soundEnabled: true,
  vibrationEnabled: true,
  dailyGoal: 300,
  theme: 'dark',
  firstDayOfWeek: 'monday',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => {
      const updateSettingsImmediate = (newSettings: Partial<UserSettings>) =>
        set((state) => ({
          ...state,
          ...newSettings,
        }));

      const updateSettingsDebounced = debounce(updateSettingsImmediate, 300);

      return {
        ...defaultSettings,

        updateSettings: updateSettingsImmediate,
        updateSettingsDebounced,

        toggleReminders: () =>
        set((state) => ({
          enabled: !state.enabled,
        })),

        setExerciseIncrement: (exercise, value) =>
        set((state) => ({
          exercisesPerReminder: {
            ...state.exercisesPerReminder,
            [exercise]: value,
          },
        })),
      };
    },
    {
      name: 'omni-fit-settings',
    },
  ),
);
