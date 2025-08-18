import { create } from 'zustand';
import type { Exercise, ExerciseDefinition, ExerciseType } from '@/types';
import { addWorkout, getTodayStats } from '@/db';
import { analytics } from '@/services/analytics';
import { syncService } from '@/services/sync';
import { logger } from '@/utils/logger';

interface ProgramExercise {
  type: string;
  sets: number;
  reps: number;
  rest: number;
}

interface ActiveProgram {
  id: string;
  name: string;
  exercises: ProgramExercise[];
  currentExerciseIndex: number;
  completedExercises: number;
  startedAt: string;
}

interface ExercisesState {
  exerciseDefinitions: ExerciseDefinition[];
  exercises: Exercise[];
  todayTotal: number;
  loading: boolean;
  completedCount: number;
  todayStats: {
    total: number;
    exercises: number;
  };
  weeklyStats: {
    total: number;
    average: number;
    days: number;
  };
  activeProgram: ActiveProgram | null;
  incrementExercise: (type: ExerciseType) => Promise<void>;
  addExercise: (name: string, count: number) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  loadTodayStats: () => Promise<void>;
  loadWeeklyStats: () => Promise<void>;
  resetDaily: () => void;
  reset: () => Promise<void>;
  // Programme methods
  startProgram: (program: Omit<ActiveProgram, 'currentExerciseIndex' | 'completedExercises' | 'startedAt'>) => void;
  completeCurrentProgramExercise: () => void;
  cancelProgram: () => void;
}

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  activeProgram: null,
  exerciseDefinitions: [
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
    {
      type: 'plank',
      name: 'Planche',
      emoji: '🏋️',
      count: 0,
      increment: 30, // en secondes
    },
    {
      type: 'jumping-jacks',
      name: 'Jumping Jacks',
      emoji: '⭐',
      count: 0,
      increment: 20,
    },
    {
      type: 'lunges',
      name: 'Fentes',
      emoji: '🚶',
      count: 0,
      increment: 10,
    },
  ],
  exercises: [],
  todayTotal: 0,
  loading: false,
  completedCount: 0,
  todayStats: {
    total: 0,
    exercises: 0,
  },
  weeklyStats: {
    total: 0,
    average: 0,
    days: 0,
  },

  incrementExercise: async (type: ExerciseType) => {
    const { exerciseDefinitions, todayStats } = get();
    const exerciseDef = exerciseDefinitions.find((e) => e.type === type);
    if (!exerciseDef) return;

    // Vérifier la limite pour les utilisateurs gratuits
    const { useSubscription } = await import('@/hooks/useSubscription');
    const { isPremium } = useSubscription.getState();
    
    if (!isPremium && todayStats.exercises >= 3) {
      // Afficher un message ou déclencher l'écran d'upgrade
      const event = new CustomEvent('show-upgrade-prompt', { 
        detail: { reason: 'exercise_limit' } 
      });
      window.dispatchEvent(event);
      return;
    }

    set({ loading: true });

    try {
      await addWorkout(type, exerciseDef.increment);

      // Track analytics (mapping types)
      const analyticsType = type === 'pushups' ? 'pompes' : type;
      await analytics.trackExercise(
        analyticsType as 'burpees' | 'pompes' | 'squats',
        exerciseDef.increment,
      );

      // Ajouter à la queue de synchronisation
      syncService.addToSyncQueue({
        type: 'workout',
        action: 'create',
        data: {
          type,
          count: exerciseDef.increment,
          date: new Date().toISOString(),
        },
      });

      set({
        exerciseDefinitions: exerciseDefinitions.map((e) =>
          e.type === type ? { ...e, count: e.count + e.increment } : e,
        ),
        todayTotal: get().todayTotal + exerciseDef.increment,
        loading: false,
      });
    } catch (error) {
      logger.error('Error adding workout:', error);
      set({ loading: false });
    }
  },

  loadTodayStats: async () => {
    const { db } = await import('@/db');
    set({ loading: true });

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayExercises = await db.exercises
        .where('timestamp')
        .aboveOrEqual(today)
        .toArray();

      const total = todayExercises.reduce((sum, e) => sum + e.count, 0);
      const completedCount = todayExercises.filter(e => e.completed).length;

      set({
        exercises: todayExercises,
        todayTotal: total,
        todayStats: {
          total,
          exercises: todayExercises.length,
        },
        completedCount,
        loading: false,
      });
    } catch (error) {
      logger.error('Error loading today stats:', error);
      set({ loading: false });
    }
  },

  resetDaily: () => {
    const { exerciseDefinitions } = get();
    set({
      exerciseDefinitions: exerciseDefinitions.map((e) => ({ ...e, count: 0 })),
      exercises: [],
      todayTotal: 0,
      completedCount: 0,
      todayStats: {
        total: 0,
        exercises: 0,
      },
    });
  },

  addExercise: async (name: string, count: number) => {
    const { db } = await import('@/db');
    const { todayStats } = get();
    
    // Vérifier la limite pour les utilisateurs gratuits
    const { useSubscription } = await import('@/hooks/useSubscription');
    const { isPremium } = useSubscription.getState();
    
    if (!isPremium && todayStats.exercises >= 3) {
      // Afficher un message ou déclencher l'écran d'upgrade
      const event = new CustomEvent('show-upgrade-prompt', { 
        detail: { reason: 'exercise_limit' } 
      });
      window.dispatchEvent(event);
      return;
    }
    
    set({ loading: true });

    try {
      const exercise: Exercise = {
        id: crypto.randomUUID(),
        name,
        count,
        timestamp: new Date(),
        synced: false,
        completed: true,
      };

      await db.exercises.add(exercise);
      
      const exercises = get().exercises;
      set({
        exercises: [...exercises, exercise],
        todayStats: {
          total: get().todayStats.total + count,
          exercises: get().todayStats.exercises + 1,
        },
        completedCount: get().completedCount + 1,
        loading: false,
      });

      // Update exercise stats
      const stats = await db.exerciseStats.where('name').equals(name).first();
      if (stats) {
        await db.exerciseStats.where('name').equals(name).modify({
          totalCount: stats.totalCount + count,
          sessionCount: stats.sessionCount + 1,
          lastCompleted: new Date(),
        });
      } else {
        await db.exerciseStats.add({
          name,
          totalCount: count,
          sessionCount: 1,
          lastCompleted: new Date(),
        });
      }
    } catch (error) {
      logger.error('Error adding exercise:', error);
      set({ loading: false });
      throw error;
    }
  },

  deleteExercise: async (id: string) => {
    const { db } = await import('@/db');
    set({ loading: true });

    try {
      const exercise = get().exercises.find(e => e.id === id);
      if (!exercise) return;

      await db.exercises.where('id').equals(id).delete();
      
      const exercises = get().exercises.filter(e => e.id !== id);
      set({
        exercises,
        todayStats: {
          total: get().todayStats.total - exercise.count,
          exercises: get().todayStats.exercises - 1,
        },
        completedCount: exercises.filter(e => e.completed).length,
        loading: false,
      });
    } catch (error) {
      logger.error('Error deleting exercise:', error);
      set({ loading: false });
    }
  },

  loadWeeklyStats: async () => {
    const { db } = await import('@/db');
    set({ loading: true });

    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const exercises = await db.exercises.toArray();
      const weekExercises = exercises.filter(e => e.timestamp >= weekAgo);
      
      const total = weekExercises.reduce((sum, e) => sum + e.count, 0);
      const days = 7;
      const average = Math.round(total / days);

      set({
        weeklyStats: { total, average, days },
        loading: false,
      });
    } catch (error) {
      logger.error('Error loading weekly stats:', error);
      set({ loading: false });
    }
  },

  reset: async () => {
    const { db } = await import('@/db');
    
    try {
      await db.exercises.clear();
      await db.exerciseStats.clear();
      
      set({
        exercises: [],
        todayTotal: 0,
        completedCount: 0,
        todayStats: {
          total: 0,
          exercises: 0,
        },
        weeklyStats: {
          total: 0,
          average: 0,
          days: 0,
        },
      });
    } catch (error) {
      logger.error('Error resetting exercises:', error);
    }
  },

  // Programme methods
  startProgram: (program) => {
    set({
      activeProgram: {
        ...program,
        currentExerciseIndex: 0,
        completedExercises: 0,
        startedAt: new Date().toISOString(),
      },
    });
    
    logger.info('Started program:', program.name);
  },

  completeCurrentProgramExercise: () => {
    const { activeProgram } = get();
    if (!activeProgram) return;

    const newCompletedExercises = activeProgram.completedExercises + 1;
    const newCurrentExerciseIndex = activeProgram.currentExerciseIndex + 1;

    if (newCurrentExerciseIndex >= activeProgram.exercises.length) {
      // Programme terminé
      analytics.trackEvent('program_completed', {
        program_id: activeProgram.id,
        program_name: activeProgram.name,
        duration: Date.now() - new Date(activeProgram.startedAt).getTime(),
      });
      
      set({ activeProgram: null });
      logger.info('Program completed:', activeProgram.name);
    } else {
      // Passer à l'exercice suivant
      set({
        activeProgram: {
          ...activeProgram,
          currentExerciseIndex: newCurrentExerciseIndex,
          completedExercises: newCompletedExercises,
        },
      });
    }
  },

  cancelProgram: () => {
    const { activeProgram } = get();
    if (activeProgram) {
      analytics.trackEvent('program_cancelled', {
        program_id: activeProgram.id,
        program_name: activeProgram.name,
        progress: `${activeProgram.completedExercises}/${activeProgram.exercises.length}`,
      });
      
      logger.info('Program cancelled:', activeProgram.name);
    }
    
    set({ activeProgram: null });
  },
}));
