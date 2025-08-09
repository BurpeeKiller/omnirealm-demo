import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/types';

interface SettingsState extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void;
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
    (set) => ({
      ...defaultSettings,

      updateSettings: (newSettings) =>
        set((state) => ({
          ...state,
          ...newSettings,
        })),

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
    }),
    {
      name: 'omni-fit-settings',
    },
  ),
);
