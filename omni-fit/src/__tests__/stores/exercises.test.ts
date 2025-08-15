import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useExercisesStore } from '../../stores/exercises.store';

// Mock the database functions
const mockAddWorkout = vi.fn().mockResolvedValue(undefined);
const mockGetTodayStats = vi.fn().mockResolvedValue({ burpees: 0, pushups: 0, squats: 0, total: 0 });

// Mock analytics and sync services
vi.mock('../../services/analytics', () => ({
  analytics: {
    trackExercise: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../services/sync', () => ({
  syncService: {
    addToSyncQueue: vi.fn(),
  },
}));

// Mock database
vi.mock('../../db', () => ({
  addWorkout: mockAddWorkout,
  getTodayStats: mockGetTodayStats,
}));

describe('ExercisesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useExercisesStore.setState({
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
    });
    
    // Reset mocks
    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const store = useExercisesStore.getState();

    expect(store.exercises).toHaveLength(3);
    expect(store.exercises[0]).toEqual({
      type: 'burpees',
      name: 'Burpees',
      emoji: '🔥',
      count: 0,
      increment: 10,
    });
    expect(store.todayTotal).toBe(0);
    expect(store.loading).toBe(false);
  });

  it('increments exercise count correctly', async () => {
    const { incrementExercise } = useExercisesStore.getState();

    await incrementExercise('burpees');

    const state = useExercisesStore.getState();
    const burpeesExercise = state.exercises.find(e => e.type === 'burpees');
    expect(burpeesExercise?.count).toBe(10); // increment is 10
    expect(state.todayTotal).toBe(10);
    expect(mockAddWorkout).toHaveBeenCalledWith('burpees', 10);
  });

  it('updates daily total when exercise is incremented', async () => {
    const { incrementExercise } = useExercisesStore.getState();

    await incrementExercise('burpees');
    await incrementExercise('pushups');

    const state = useExercisesStore.getState();
    expect(state.todayTotal).toBe(20); // 10 + 10
  });

  it('handles multiple increments of same exercise', async () => {
    const { incrementExercise } = useExercisesStore.getState();

    await incrementExercise('burpees');
    await incrementExercise('burpees');
    await incrementExercise('burpees');

    const state = useExercisesStore.getState();
    const burpeesExercise = state.exercises.find(e => e.type === 'burpees');
    expect(burpeesExercise?.count).toBe(30); // 10 * 3
    expect(state.todayTotal).toBe(30);
  });

  it('resets daily stats correctly', () => {
    const { resetDaily } = useExercisesStore.getState();

    // First set some counts
    useExercisesStore.setState({
      exercises: useExercisesStore.getState().exercises.map(e => ({ ...e, count: 10 })),
      todayTotal: 30,
    });

    // Reset
    resetDaily();

    const state = useExercisesStore.getState();
    state.exercises.forEach(exercise => {
      expect(exercise.count).toBe(0);
    });
    expect(state.todayTotal).toBe(0);
  });

  it('sets loading state correctly', async () => {
    const { incrementExercise } = useExercisesStore.getState();

    // Start an increment (should set loading to true, then false)
    const promise = incrementExercise('burpees');
    
    // Loading should be true during execution
    expect(useExercisesStore.getState().loading).toBe(true);
    
    // Wait for completion
    await promise;
    
    // Loading should be false after completion
    expect(useExercisesStore.getState().loading).toBe(false);
  });

  it('validates exercise types', async () => {
    const { incrementExercise } = useExercisesStore.getState();

    // Valid types should work
    await incrementExercise('burpees');
    const burpeesExercise = useExercisesStore.getState().exercises.find(e => e.type === 'burpees');
    expect(burpeesExercise?.count).toBe(10);

    // Invalid type should be handled gracefully (function returns early)
    await incrementExercise('invalid' as any);
    
    // State should remain unchanged for invalid exercise
    const state = useExercisesStore.getState();
    expect(state.todayTotal).toBe(10); // Only the valid exercise was added
  });
});
