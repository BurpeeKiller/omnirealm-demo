import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useExercisesStore } from '../../stores/exercises.store';
import { db } from '../../db';
import type { Exercise } from '../../types';

// Mock the database
vi.mock('../../db', () => ({
  db: {
    exercises: {
      add: vi.fn(),
      where: vi.fn(() => ({
        toArray: vi.fn(),
        count: vi.fn(),
        delete: vi.fn(),
      })),
      toArray: vi.fn(),
      clear: vi.fn(),
    },
    exerciseStats: {
      where: vi.fn(() => ({
        first: vi.fn(),
        modify: vi.fn(),
      })),
      add: vi.fn(),
    },
  },
}));

describe('ExercisesStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useExercisesStore());
    act(() => {
      result.current.reset();
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addExercise', () => {
    it('should add an exercise and update today stats', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      // Mock database responses
      vi.mocked(db.exercises.add).mockResolvedValue('1');
      vi.mocked(db.exercises.where).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(1),
        delete: vi.fn(),
      });

      const exerciseName = 'Push-ups';
      const count = 20;

      await act(async () => {
        await result.current.addExercise(exerciseName, count);
      });

      // Verify database was called
      expect(db.exercises.add).toHaveBeenCalledWith(
        expect.objectContaining({
          name: exerciseName,
          count: count,
        })
      );

      // Verify state was updated
      expect(result.current.todayStats.total).toBe(count);
      expect(result.current.exercises).toHaveLength(1);
      expect(result.current.exercises[0]).toMatchObject({
        name: exerciseName,
        count: count,
      });
    });

    it('should handle errors gracefully', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      // Mock database error
      vi.mocked(db.exercises.add).mockRejectedValue(new Error('Database error'));

      const exerciseName = 'Push-ups';
      const count = 20;

      await act(async () => {
        await expect(
          result.current.addExercise(exerciseName, count)
        ).rejects.toThrow('Database error');
      });

      // Verify state was not updated
      expect(result.current.todayStats.total).toBe(0);
      expect(result.current.exercises).toHaveLength(0);
    });

    it('should update existing exercise stats', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      const existingStats = {
        name: 'Push-ups',
        totalCount: 50,
        sessionCount: 2,
        lastCompleted: new Date('2025-01-01'),
      };

      // Mock existing stats
      vi.mocked(db.exerciseStats.where).mockReturnValue({
        first: vi.fn().mockResolvedValue(existingStats),
        modify: vi.fn().mockResolvedValue(1),
      });

      vi.mocked(db.exercises.add).mockResolvedValue('1');
      vi.mocked(db.exercises.where).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(1),
        delete: vi.fn(),
      });

      await act(async () => {
        await result.current.addExercise('Push-ups', 20);
      });

      // Verify stats were updated
      expect(db.exerciseStats.where).toHaveBeenCalledWith('name').equals('Push-ups');
      expect(db.exerciseStats.where('name').equals('Push-ups').modify).toHaveBeenCalled();
    });
  });

  describe('loadTodayStats', () => {
    it('should load exercises for today', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      const todayExercises: Exercise[] = [
        {
          id: '1',
          name: 'Push-ups',
          count: 20,
          timestamp: new Date(),
          synced: false,
        },
        {
          id: '2',
          name: 'Squats',
          count: 30,
          timestamp: new Date(),
          synced: false,
        },
      ];

      vi.mocked(db.exercises.where).mockReturnValue({
        toArray: vi.fn().mockResolvedValue(todayExercises),
        count: vi.fn(),
        delete: vi.fn(),
      });

      await act(async () => {
        await result.current.loadTodayStats();
      });

      expect(result.current.exercises).toEqual(todayExercises);
      expect(result.current.todayStats.total).toBe(50);
      expect(result.current.todayStats.exercises).toBe(2);
    });

    it('should handle empty results', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      vi.mocked(db.exercises.where).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        count: vi.fn(),
        delete: vi.fn(),
      });

      await act(async () => {
        await result.current.loadTodayStats();
      });

      expect(result.current.exercises).toEqual([]);
      expect(result.current.todayStats.total).toBe(0);
      expect(result.current.todayStats.exercises).toBe(0);
    });
  });

  describe('deleteExercise', () => {
    it('should delete an exercise and update stats', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      // Set initial state
      const exercise: Exercise = {
        id: '1',
        name: 'Push-ups',
        count: 20,
        timestamp: new Date(),
        synced: false,
      };

      vi.mocked(db.exercises.where).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([exercise]),
        count: vi.fn(),
        delete: vi.fn().mockResolvedValue(1),
      });

      // Load initial data
      await act(async () => {
        await result.current.loadTodayStats();
      });

      expect(result.current.exercises).toHaveLength(1);
      expect(result.current.todayStats.total).toBe(20);

      // Delete the exercise
      await act(async () => {
        await result.current.deleteExercise('1');
      });

      expect(db.exercises.where).toHaveBeenCalledWith('id').equals('1');
      expect(result.current.exercises).toHaveLength(0);
      expect(result.current.todayStats.total).toBe(0);
    });
  });

  describe('weeklyStats', () => {
    it('should calculate weekly statistics correctly', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      // Mock 7 days of data
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          id: `${i}`,
          name: 'Push-ups',
          count: 20 + i * 5,
          timestamp: date,
          synced: false,
        };
      });

      vi.mocked(db.exercises.toArray).mockResolvedValue(weekData);

      await act(async () => {
        await result.current.loadWeeklyStats();
      });

      // Should have loaded weekly data
      expect(result.current.weeklyStats.total).toBeGreaterThan(0);
      expect(result.current.weeklyStats.days).toBe(7);
      expect(result.current.weeklyStats.average).toBeGreaterThan(0);
    });
  });

  describe('persistence', () => {
    it('should persist state changes', async () => {
      const { result, rerender } = renderHook(() => useExercisesStore());
      
      vi.mocked(db.exercises.add).mockResolvedValue('1');
      vi.mocked(db.exercises.where).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(1),
        delete: vi.fn(),
      });

      // Add an exercise
      await act(async () => {
        await result.current.addExercise('Push-ups', 20);
      });

      // Simulate remount
      rerender();

      // State should be persisted
      expect(result.current.todayStats.total).toBe(20);
    });
  });

  describe('reset', () => {
    it('should clear all data and reset state', async () => {
      const { result } = renderHook(() => useExercisesStore());
      
      // Add some data first
      vi.mocked(db.exercises.add).mockResolvedValue('1');
      vi.mocked(db.exercises.where).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(1),
        delete: vi.fn(),
      });

      await act(async () => {
        await result.current.addExercise('Push-ups', 20);
      });

      expect(result.current.todayStats.total).toBe(20);

      // Reset
      await act(async () => {
        await result.current.reset();
      });

      expect(db.exercises.clear).toHaveBeenCalled();
      expect(result.current.todayStats.total).toBe(0);
      expect(result.current.exercises).toHaveLength(0);
    });
  });
});