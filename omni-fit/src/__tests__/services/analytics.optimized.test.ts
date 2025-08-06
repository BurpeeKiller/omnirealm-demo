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

// Mock de date-fns - VERSION OPTIMISÉE
vi.mock('date-fns', () => ({
  format: vi.fn(() => '2024-01-15'),
  startOfWeek: vi.fn(() => new Date('2024-01-15')),
  endOfWeek: vi.fn(() => new Date('2024-01-21')),
  subDays: vi.fn(() => new Date('2024-01-14')),
  isSameDay: vi.fn(() => true),
}));

describe('AnalyticsService (Optimized)', () => {
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
      vi.mocked(db.analytics.put).mockResolvedValue(undefined);

      await analytics.trackSessionStart();

      expect(db.analytics.get).toHaveBeenCalledWith('2024-01-15');
      expect(db.analytics.put).toHaveBeenCalledWith(
        expect.objectContaining({
          date: '2024-01-15',
          sessions: 3,
        }),
      );
    }, 5000); // Timeout réduit à 5 secondes

    it('should handle first session of the day', async () => {
      vi.mocked(db.analytics.get).mockResolvedValue(undefined);
      vi.mocked(db.analytics.put).mockResolvedValue(undefined);

      await analytics.trackSessionStart();

      expect(db.analytics.put).toHaveBeenCalledWith(
        expect.objectContaining({
          date: '2024-01-15',
          sessions: 1,
          exercises: 0,
        }),
      );
    }, 5000);
  });

  describe('getAnalytics', () => {
    it('should return analytics correctly with minimal data', async () => {
      const mockAnalyticsData = [
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

      expect(result.totalSessions).toBe(2);
      expect(result.totalExercises).toBe(20);
    }, 5000);
  });

  describe('clearAnalytics', () => {
    it('should clear analytics data', async () => {
      vi.mocked(db.analytics.clear).mockResolvedValue(undefined);

      await analytics.clearAnalytics();

      expect(db.analytics.clear).toHaveBeenCalledTimes(1);
    }, 3000); // Timeout court pour les tests simples
  });
});
