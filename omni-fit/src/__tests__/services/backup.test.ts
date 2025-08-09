import { describe, it, expect, beforeEach, vi } from 'vitest';
import { backupService, BackupService } from '../../services/backup';
import { db } from '../../db';

// Mock de la base de données
vi.mock('../../db', () => ({
  db: {
    workouts: {
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
      clear: vi.fn(),
      bulkAdd: vi.fn(),
    },
    dailyStats: {
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
      clear: vi.fn(),
      bulkAdd: vi.fn(),
    },
    settings: {
      toArray: vi.fn(),
      clear: vi.fn(),
      bulkAdd: vi.fn(),
    },
    analytics: {
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
      clear: vi.fn(),
      bulkAdd: vi.fn(),
    },
  },
}));

// Mock des services analytics
vi.mock('../../services/analytics', () => ({
  analytics: {
    getAnalytics: vi.fn().mockResolvedValue({
      totalSessions: 5,
      totalExercises: 50,
      averageExercisesPerDay: 10,
      currentStreak: 3,
      longestStreak: 5,
      favoriteExercise: 'burpees',
    }),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock URL.createObjectURL et URL.revokeObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  value: vi.fn(),
});

// Mock navigator
Object.defineProperty(window.navigator, 'platform', {
  value: 'TestPlatform',
});

Object.defineProperty(window.navigator, 'userAgent', {
  value: 'TestBrowser/1.0',
});

describe('BackupService', () => {
  let service: BackupService;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.length = 0;
    service = BackupService.getInstance();
  });

  describe('getBackupSettings', () => {
    it('should return default settings when no saved settings', () => {
      const settings = service.getBackupSettings();

      expect(settings).toEqual({
        autoBackupEnabled: false, // Valeur par défaut corrigée
        backupFrequency: 'weekly',
        maxBackupFiles: 3, // Valeur par défaut corrigée
        lastBackupDate: null,
      });
    });

    it('should return saved settings when available', () => {
      const savedSettings = {
        autoBackupEnabled: false,
        backupFrequency: 'daily' as const,
        maxBackupFiles: 3,
        lastBackupDate: '2024-01-15T10:00:00.000Z',
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSettings));

      const settings = service.getBackupSettings();
      expect(settings).toEqual(savedSettings);
    });

    it('should handle JSON parsing errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const settings = service.getBackupSettings();
      expect(settings.autoBackupEnabled).toBe(false); // Default value corrigé
    });
  });

  describe('saveBackupSettings', () => {
    it('should save settings to localStorage', () => {
      const settings = {
        autoBackupEnabled: false,
        backupFrequency: 'monthly' as const,
        maxBackupFiles: 10,
        lastBackupDate: '2024-01-15T10:00:00.000Z',
      };

      service.saveBackupSettings(settings);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'omni-fit-backup-settings',
        JSON.stringify(settings),
      );
    });

    it('should handle save errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const settings = {
        autoBackupEnabled: true,
        backupFrequency: 'weekly' as const,
        maxBackupFiles: 5,
        lastBackupDate: null,
      };

      // Should not throw
      expect(() => service.saveBackupSettings(settings)).not.toThrow();
    });
  });

  describe('createBackup', () => {
    it('should create a complete backup', async () => {
      const mockWorkouts = [{ id: 1, exercise: 'burpees', count: 10 }];
      const mockDailyStats = [{ date: '2024-01-15', total: 10 }];
      const mockSettings = [{ key: 'theme', value: 'dark' }];
      const mockAnalytics = [{ date: '2024-01-15', sessions: 1 }];

      vi.mocked(db.workouts.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockWorkouts),
      } as any);

      vi.mocked(db.dailyStats.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockDailyStats),
      } as any);

      vi.mocked(db.settings.toArray).mockResolvedValue(mockSettings);

      vi.mocked(db.analytics.orderBy).mockReturnValue({
        toArray: vi.fn().mockResolvedValue(mockAnalytics),
      } as any);

      // Import du service analytics pour le mock
      const { analytics } = await import('../../services/analytics');
      vi.mocked(analytics.getAnalytics).mockResolvedValue({
        totalSessions: 5,
        totalExercises: 50,
        averageExercisesPerDay: 10,
        currentStreak: 3,
        longestStreak: 5,
      } as any);

      const backup = await service.createBackup();

      expect(backup.version).toBe('1.0.0');
      expect(backup.data.workouts).toEqual(mockWorkouts);
      expect(backup.data.dailyStats).toEqual(mockDailyStats);
      expect(backup.data.settings).toEqual(mockSettings);
      expect(backup.data.analytics).toEqual(mockAnalytics);
      expect(backup.metadata.totalWorkouts).toBe(1);
      expect(backup.metadata.totalSessions).toBe(5);
    });

    it('should handle database errors', async () => {
      vi.mocked(db.workouts.orderBy).mockReturnValue({
        toArray: vi.fn().mockRejectedValue(new Error('DB Error')),
      } as any);

      await expect(service.createBackup()).rejects.toThrow();
    });
  });

  describe('shouldAutoBackup', () => {
    it('should return false when auto-backup is disabled', () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          autoBackupEnabled: false,
          backupFrequency: 'weekly',
          maxBackupFiles: 5,
          lastBackupDate: null,
        }),
      );

      expect(service.shouldAutoBackup()).toBe(false);
    });

    it('should return true when no previous backup', () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          autoBackupEnabled: true,
          backupFrequency: 'weekly',
          maxBackupFiles: 5,
          lastBackupDate: null,
        }),
      );

      expect(service.shouldAutoBackup()).toBe(true);
    });

    it('should return true when backup is older than frequency', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 8); // 8 days ago

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          autoBackupEnabled: true,
          backupFrequency: 'weekly',
          maxBackupFiles: 5,
          lastBackupDate: oldDate.toISOString(),
        }),
      );

      expect(service.shouldAutoBackup()).toBe(true);
    });

    it('should return false when backup is recent', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 3); // 3 days ago

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          autoBackupEnabled: true,
          backupFrequency: 'weekly',
          maxBackupFiles: 5,
          lastBackupDate: recentDate.toISOString(),
        }),
      );

      expect(service.shouldAutoBackup()).toBe(false);
    });
  });

  describe('getLocalBackups', () => {
    it('should return empty array when no backups', () => {
      localStorageMock.length = 0;
      localStorageMock.key.mockReturnValue(null);

      const backups = service.getLocalBackups();
      expect(backups).toEqual([]);
    });

    it('should return list of backups', () => {
      const mockKeys = [
        'omni-fit-backup-1642249200000',
        'omni-fit-backup-1642335600000',
        'other-key',
      ];

      localStorageMock.length = mockKeys.length;
      localStorageMock.key.mockImplementation((index) => mockKeys[index]);
      localStorageMock.getItem.mockImplementation((key) =>
        key?.startsWith('omni-fit-backup-') ? '{"data": "test"}' : null,
      );

      const backups = service.getLocalBackups();

      expect(backups).toHaveLength(2);
      expect(backups[0].key).toBe('omni-fit-backup-1642335600000');
      expect(backups[1].key).toBe('omni-fit-backup-1642249200000');
    });
  });

  describe('restoreFromBackup', () => {
    it('should restore backup data correctly', async () => {
      const mockBackup = {
        version: '1.0.0',
        timestamp: '2024-01-15T10:00:00.000Z',
        data: {
          workouts: [{ id: 1, exercise: 'burpees' }],
          dailyStats: [{ date: '2024-01-15' }],
          settings: [{ key: 'theme' }],
          analytics: [{ date: '2024-01-15' }],
        },
        metadata: {
          totalWorkouts: 1,
          totalSessions: 1,
          createdAt: '2024-01-15T10:00:00.000Z',
          deviceInfo: 'Test',
        },
      };

      await service.restoreFromBackup(mockBackup);

      expect(db.workouts.clear).toHaveBeenCalledTimes(1);
      expect(db.dailyStats.clear).toHaveBeenCalledTimes(1);
      expect(db.settings.clear).toHaveBeenCalledTimes(1);
      expect(db.analytics.clear).toHaveBeenCalledTimes(1);

      expect(db.workouts.bulkAdd).toHaveBeenCalledWith(mockBackup.data.workouts);
      expect(db.dailyStats.bulkAdd).toHaveBeenCalledWith(mockBackup.data.dailyStats);
      expect(db.settings.bulkAdd).toHaveBeenCalledWith(mockBackup.data.settings);
      expect(db.analytics.bulkAdd).toHaveBeenCalledWith(mockBackup.data.analytics);
    });

    it('should throw error for invalid backup format', async () => {
      const invalidBackup = {
        // Missing version and data
      } as any;

      await expect(service.restoreFromBackup(invalidBackup)).rejects.toThrow(
        'Format de backup invalide',
      );
    });
  });
});
