import { create } from 'zustand';
import type { Exercise, ExerciseType } from '@/types';
import { addWorkout, getTodayStats } from '@/db';
import { analytics } from '@/services/analytics';
import { syncService } from '@/services/sync';

interface ExercisesState {
  exercises: Exercise[];
  todayTotal: number;
  loading: boolean;
  incrementExercise: (type: ExerciseType) => Promise<void>;
  loadTodayStats: () => Promise<void>;
  resetDaily: () => void;
}

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  exercises: [
    {
      type: 'burpees',
      name: 'Burpees',
      emoji: '🔥',
      count: 0,
      increment: 10,
    },
    {
      type: 'pushups',
      name: 'Pompes',
      emoji: '💪',
      count: 0,
      increment: 10,
    },
    {
      type: 'squats',
      name: 'Squats',
      emoji: '🦵',
      count: 0,
      increment: 10,
    },
  ],
  todayTotal: 0,
  loading: false,

  incrementExercise: async (type: ExerciseType) => {
    const { exercises } = get();
    const exercise = exercises.find((e) => e.type === type);
    if (!exercise) return;

    set({ loading: true });

    try {
      await addWorkout(type, exercise.increment);

      // Track analytics (mapping types)
      const analyticsType = type === 'pushups' ? 'pompes' : type;
      await analytics.trackExercise(
        analyticsType as 'burpees' | 'pompes' | 'squats',
        exercise.increment,
      );

      // Ajouter à la queue de synchronisation
      syncService.addToSyncQueue({
        type: 'workout',
        action: 'create',
        data: {
          type,
          count: exercise.increment,
          date: new Date().toISOString(),
        },
      });

      set({
        exercises: exercises.map((e) =>
          e.type === type ? { ...e, count: e.count + e.increment } : e,
        ),
        todayTotal: get().todayTotal + exercise.increment,
        loading: false,
      });
    } catch (error) {
      console.error('Error adding workout:', error);
      set({ loading: false });
    }
  },

  loadTodayStats: async () => {
    set({ loading: true });

    try {
      const stats = await getTodayStats();
      const { exercises } = get();

      set({
        exercises: exercises.map((e) => ({
          ...e,
          count: stats[e.type] || 0,
        })),
        todayTotal: stats.total,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading today stats:', error);
      set({ loading: false });
    }
  },

  resetDaily: () => {
    const { exercises } = get();
    set({
      exercises: exercises.map((e) => ({ ...e, count: 0 })),
      todayTotal: 0,
    });
  },
}));
