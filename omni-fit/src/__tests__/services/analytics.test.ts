import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analytics } from '../../services/analytics';
import { db } from '../../db';

// Mock de la base de données
vi.mock('../../db', () => ({
  db: {
    analytics: {
      get: vi.fn(),
      put: vi.fn(),
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
      clear: vi.fn(),
    },
    workouts: {
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
    },
  },
}));

// Mock de date-fns
vi.mock('date-fns', () => ({
  format: vi.fn(() => {
    return '2024-01-15';
  }),
  startOfWeek: vi.fn(() => new Date('2024-01-15')),
  endOfWeek: vi.fn(() => new Date('2024-01-21')),
  subDays: vi.fn(() => new Date('2024-01-14')),
  isSameDay: vi.fn(() => true),
}));

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackSessionStart', () => {
    it('should track session start correctly', async () => {
      const mockExisting = {
        date: '2024-01-15',
        sessions: 2,
        exercises: 10,
        lastActivity: new Date(),
        exerciseBreakdown: { burpees: 5, pompes: 3, squats: 2 },
      };

      vi.mocked(db.analytics.get).mockResolvedValue(mockExisting);
      vi.mocked(db.analytics.put).mockResolvedValue('2024-01-15');

      await analytics.trackSessionStart();

      expect(db.analytics.get).toHaveBeenCalledWith('2024-01-15');
      expect(db.analytics.put).toHaveBeenCalledWith({
        date: '2024-01-15',
        sessions: 3, // incrémenté
        exercises: 10,
        lastActivity: expect.any(Date),
        exerciseBreakdown: { burpees: 5, pompes: 3, squats: 2 },
      });
    });

    it('should handle first session of the day', async () => {
      vi.mocked(db.analytics.get).mockResolvedValue(undefined);
      vi.mocked(db.analytics.put).mockResolvedValue('2024-01-15');

      await analytics.trackSessionStart();

      expect(db.analytics.put).toHaveBeenCalledWith({
        date: '2024-01-15',
        sessions: 1,
        exercises: 0,
        lastActivity: expect.any(Date),
        exerciseBreakdown: { burpees: 0, pompes: 0, squats: 0 },
      });
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(db.analytics.get).mockRejectedValue(new Error('DB Error'));

      // Ne devrait pas lever d'exception
      await expect(analytics.trackSessionStart()).resolves.toBeUndefined();
    });
  });

  describe('trackExercise', () => {
    it('should track exercise correctly', async () => {
      const mockExisting = {
        date: '2024-01-15',
        sessions: 1,
        exercises: 5,
        lastActivity: new Date(),
        exerciseBreakdown: { burpees: 5, pompes: 0, squats: 0 },
      };

      vi.mocked(db.analytics.get).mockResolvedValue(mockExisting);
      vi.mocked(db.analytics.put).mockResolvedValue('2024-01-15');

      await analytics.trackExercise('pompes', 10);

      expect(db.analytics.put).toHaveBeenCalledWith({
        date: '2024-01-15',
        sessions: 1,
        exercises: 15, // 5 + 10
        lastActivity: expect.any(Date),
        exerciseBreakdown: { burpees: 5, pompes: 10, squats: 0 },
      });
    });

    it('should handle first exercise of the day', async () => {
      vi.mocked(db.analytics.get).mockResolvedValue(undefined);
      vi.mocked(db.analytics.put).mockResolvedValue('2024-01-15');

      await analytics.trackExercise('burpees', 1);

      expect(db.analytics.put).toHaveBeenCalledWith({
        date: '2024-01-15',
        sessions: 1,
        exercises: 1,
        lastActivity: expect.any(Date),
        exerciseBreakdown: { burpees: 1, pompes: 0, squats: 0 },
      });
    });
  });

  describe('getAnalytics', () => {
    it('should return empty analytics when no data', async () => {
      vi.mocked(db.analytics.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      } as any);

      vi.mocked(db.workouts.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await analytics.getAnalytics();

      expect(result.totalSessions).toBe(0);
      expect(result.totalExercises).toBe(0);
      expect(result.currentStreak).toBe(0);
      expect(result.favoriteExercise).toBe('burpees');
    });

    it('should calculate analytics correctly with data', async () => {
      const mockAnalyticsData = [
        {
          date: '2024-01-14',
          sessions: 1,
          exercises: 15,
          lastActivity: new Date('2024-01-14'),
          exerciseBreakdown: { burpees: 10, pompes: 5, squats: 0 },
        },
        {
          date: '2024-01-15',
          sessions: 2,
          exercises: 20,
          lastActivity: new Date('2024-01-15'),
          exerciseBreakdown: { burpees: 5, pompes: 10, squats: 5 },
        },
      ];

      vi.mocked(db.analytics.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockAnalyticsData),
      } as any);

      vi.mocked(db.workouts.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await analytics.getAnalytics();

      expect(result.totalSessions).toBe(3);
      expect(result.totalExercises).toBe(35);
      expect(result.activeDays).toBe(2);
      expect(result.averageExercisesPerDay).toBe(17.5);
      expect(result.exerciseDistribution.burpees).toBe(15);
      expect(result.exerciseDistribution.pompes).toBe(15);
      expect(result.exerciseDistribution.squats).toBe(5);
      expect(result.favoriteExercise).toEqual(expect.stringMatching(/burpees|pompes/));
    });
  });

  describe('exportAnalytics', () => {
    it('should export CSV format correctly', async () => {
      const mockData = [
        {
          date: '2024-01-15',
          sessions: 1,
          exercises: 10,
          exerciseBreakdown: { burpees: 5, pompes: 3, squats: 2 },
        },
      ];

      vi.mocked(db.analytics.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockData),
      } as any);

      const csvResult = await analytics.exportAnalytics();

      expect(csvResult).toContain('Date,Sessions,Exercises,Burpees,Pompes,Squats');
      expect(csvResult).toContain('2024-01-15,1,10,5,3,2');
    });
  });

  describe('clearAnalytics', () => {
    it('should clear analytics data', async () => {
      vi.mocked(db.analytics.clear).mockResolvedValue(undefined);

      await analytics.clearAnalytics();

      expect(db.analytics.clear).toHaveBeenCalledTimes(1);
    });

    it('should handle clear errors gracefully', async () => {
      vi.mocked(db.analytics.clear).mockRejectedValue(new Error('Clear failed'));

      await expect(analytics.clearAnalytics()).resolves.toBeUndefined();
    });
  });
});
