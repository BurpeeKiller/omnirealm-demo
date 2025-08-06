import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useExercisesStore } from '../../stores/exercises.store';

// Mock Dexie database
vi.mock('../../db', () => ({
  db: {
    workouts: {
      add: vi.fn(),
      toArray: vi.fn(() => Promise.resolve([])),
      where: vi.fn(() => ({
        between: vi.fn(() => ({
          toArray: vi.fn(() => Promise.resolve([])),
        })),
      })),
    },
    dailyStats: {
      get: vi.fn(() => Promise.resolve(undefined)),
      put: vi.fn(),
    },
  },
}));

describe('ExercisesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useExercisesStore.setState({
      exercises: {
        burpees: 0,
        pompes: 0,
        squats: 0,
      },
      dailyTotal: 0,
      weeklyTotal: 0,
      isLoading: false,
    });
  });

  it('initializes with correct default state', () => {
    const store = useExercisesStore.getState();

    expect(store.exercises).toEqual({
      burpees: 0,
      pompes: 0,
      squats: 0,
    });
    expect(store.dailyTotal).toBe(0);
    expect(store.weeklyTotal).toBe(0);
    expect(store.isLoading).toBe(false);
  });

  it('increments exercise count correctly', () => {
    const { incrementExercise } = useExercisesStore.getState();

    incrementExercise('burpees');

    const state = useExercisesStore.getState();
    expect(state.exercises.burpees).toBe(1);
    expect(state.exercises.pompes).toBe(0);
    expect(state.exercises.squats).toBe(0);
  });

  it('updates daily total when exercise is incremented', () => {
    const { incrementExercise } = useExercisesStore.getState();

    incrementExercise('burpees');
    incrementExercise('pompes');

    const state = useExercisesStore.getState();
    expect(state.dailyTotal).toBe(2);
  });

  it('handles multiple increments of same exercise', () => {
    const { incrementExercise } = useExercisesStore.getState();

    incrementExercise('burpees');
    incrementExercise('burpees');
    incrementExercise('burpees');

    const state = useExercisesStore.getState();
    expect(state.exercises.burpees).toBe(3);
    expect(state.dailyTotal).toBe(3);
  });

  it('resets daily stats correctly', () => {
    const { incrementExercise, resetDaily } = useExercisesStore.getState();

    // Add some exercises
    incrementExercise('burpees');
    incrementExercise('pompes');

    // Reset
    resetDaily();

    const state = useExercisesStore.getState();
    expect(state.exercises).toEqual({
      burpees: 0,
      pompes: 0,
      squats: 0,
    });
    expect(state.dailyTotal).toBe(0);
  });

  it('sets loading state correctly', () => {
    const { setLoading } = useExercisesStore.getState();

    setLoading(true);
    expect(useExercisesStore.getState().isLoading).toBe(true);

    setLoading(false);
    expect(useExercisesStore.getState().isLoading).toBe(false);
  });

  it('validates exercise types', () => {
    const { incrementExercise } = useExercisesStore.getState();

    // Valid exercise
    incrementExercise('burpees');
    expect(useExercisesStore.getState().exercises.burpees).toBe(1);

    // Invalid exercise should not crash
    incrementExercise('invalid' as any);
    const state = useExercisesStore.getState();
    expect(state.exercises).toEqual({
      burpees: 1,
      pompes: 0,
      squats: 0,
    });
  });
});
