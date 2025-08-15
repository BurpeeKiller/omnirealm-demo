import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { backupService } from '@/services/backup';
import { db } from '@/db';
import type { BackupData, BackupSettings } from '@/services/backup';

// Mock dependencies
vi.mock('@/db', () => ({
  db: {
    workouts: {
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
      bulkAdd: vi.fn(),
      clear: vi.fn(),
    },
    dailyStats: {
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
      bulkAdd: vi.fn(),
      clear: vi.fn(),
    },
    settings: {
      toArray: vi.fn(),
      bulkAdd: vi.fn(),
      clear: vi.fn(),
    },
    analytics: {
      orderBy: vi.fn(() => ({
        toArray: vi.fn(),
      })),
      bulkAdd: vi.fn(),
      clear: vi.fn(),
    },
  },
}));

vi.mock('@/services/analytics', () => ({
  analytics: {
    getAnalytics: vi.fn(),
    trackBackupCreated: vi.fn(),
    trackBackupRestored: vi.fn(),
  },
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('BackupService', () => {
  const mockWorkouts = [
    { id: 1, date: new Date('2024-01-01'), exercise: 'pushups', count: 20 },
    { id: 2, date: new Date('2024-01-02'), exercise: 'squats', count: 30 },
  ];

  const mockDailyStats = [
    { date: '2024-01-01', burpees: 10, pushups: 20, squats: 30, total: 60 },
  ];

  const mockSettings = [
    { key: 'theme', value: 'dark' },
    { key: 'dailyGoal', value: 100 },
  ];

  const mockAnalytics = [
    { date: '2024-01-01', sessions: 3, exercises: 60, lastActivity: new Date() },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Reset mocks
    vi.mocked(db.workouts.orderBy).mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockWorkouts),
    });
    vi.mocked(db.dailyStats.orderBy).mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockDailyStats),
    });
    vi.mocked(db.settings.toArray).mockResolvedValue(mockSettings);
    vi.mocked(db.analytics.orderBy).mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockAnalytics),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getBackupSettings', () => {
    it('should return default settings when none are saved', () => {
      const settings = backupService.getBackupSettings();

      expect(settings).toEqual({
        autoBackupEnabled: true,
        backupFrequency: 'weekly',
        maxBackupFiles: 3,
        lastBackupDate: null,
      });
    });

    it('should return saved settings from localStorage', () => {
      const savedSettings: BackupSettings = {
        autoBackupEnabled: false,
        backupFrequency: 'daily',
        maxBackupFiles: 5,
        lastBackupDate: '2024-01-01',
      };

      localStorage.setItem('omni-fit-backup-settings', JSON.stringify(savedSettings));

      const settings = backupService.getBackupSettings();

      expect(settings).toEqual(savedSettings);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('omni-fit-backup-settings', 'invalid-json');

      const settings = backupService.getBackupSettings();

      expect(settings).toEqual({
        autoBackupEnabled: true,
        backupFrequency: 'weekly',
        maxBackupFiles: 3,
        lastBackupDate: null,
      });
    });
  });

  describe('saveBackupSettings', () => {
    it('should save settings to localStorage', () => {
      const settings: BackupSettings = {
        autoBackupEnabled: false,
        backupFrequency: 'monthly',
        maxBackupFiles: 10,
        lastBackupDate: '2024-01-15',
      };

      backupService.saveBackupSettings(settings);

      const saved = localStorage.getItem('omni-fit-backup-settings');
      expect(saved).toBe(JSON.stringify(settings));
    });
  });

  describe('createBackup', () => {
    it('should create a complete backup with all data', async () => {
      const { analytics } = await import('@/services/analytics');
      vi.mocked(analytics.getAnalytics).mockResolvedValue({
        totalSessions: 10,
        totalWorkouts: 100,
        currentStreak: 5,
        longestStreak: 15,
        averagePerDay: 50,
        lastActive: new Date('2024-01-02'),
      });

      const backup = await backupService.createBackup();

      expect(backup.version).toBe('1.0.0');
      expect(backup.data.workouts).toEqual(mockWorkouts);
      expect(backup.data.dailyStats).toEqual(mockDailyStats);
      expect(backup.data.settings).toEqual(mockSettings);
      expect(backup.data.analytics).toEqual(mockAnalytics);
      expect(backup.metadata.totalWorkouts).toBe(100);
      expect(backup.metadata.totalSessions).toBe(10);
      expect(backup.timestamp).toBeDefined();
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(db.workouts.orderBy).mockReturnValue({
        toArray: vi.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(backupService.createBackup()).rejects.toThrow('Failed to create backup');
    });
  });

  describe('restoreBackup', () => {
    const validBackup: BackupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      data: {
        workouts: mockWorkouts,
        dailyStats: mockDailyStats,
        settings: mockSettings,
        analytics: mockAnalytics,
      },
      metadata: {
        totalWorkouts: 50,
        totalSessions: 10,
        createdAt: new Date().toISOString(),
        deviceInfo: 'Test Device',
      },
    };

    it('should restore backup data successfully', async () => {
      await backupService.restoreBackup(validBackup);

      expect(db.workouts.clear).toHaveBeenCalled();
      expect(db.dailyStats.clear).toHaveBeenCalled();
      expect(db.settings.clear).toHaveBeenCalled();
      expect(db.analytics.clear).toHaveBeenCalled();

      expect(db.workouts.bulkAdd).toHaveBeenCalledWith(mockWorkouts);
      expect(db.dailyStats.bulkAdd).toHaveBeenCalledWith(mockDailyStats);
      expect(db.settings.bulkAdd).toHaveBeenCalledWith(mockSettings);
      expect(db.analytics.bulkAdd).toHaveBeenCalledWith(mockAnalytics);
    });

    it('should validate backup version', async () => {
      const invalidBackup = {
        ...validBackup,
        version: '2.0.0', // Unsupported version
      };

      await expect(backupService.restoreBackup(invalidBackup)).rejects.toThrow(
        'Unsupported backup version'
      );
    });

    it('should validate backup data structure', async () => {
      const invalidBackup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          // Missing required fields
          workouts: [],
        },
      } as any;

      await expect(backupService.restoreBackup(invalidBackup)).rejects.toThrow(
        'Invalid backup data structure'
      );
    });

    it('should handle restore errors gracefully', async () => {
      vi.mocked(db.workouts.clear).mockRejectedValue(new Error('Clear failed'));

      await expect(backupService.restoreBackup(validBackup)).rejects.toThrow(
        'Failed to restore backup'
      );
    });
  });

  describe('downloadBackup', () => {
    it('should trigger file download with backup data', async () => {
      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
        remove: vi.fn(),
      };
      
      const createElementSpy = vi.spyOn(document, 'createElement');
      createElementSpy.mockReturnValue(mockLink as any);

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      appendChildSpy.mockImplementation(() => mockLink as any);

      const { analytics } = await import('@/services/analytics');
      vi.mocked(analytics.getAnalytics).mockResolvedValue({
        totalSessions: 10,
        totalWorkouts: 100,
        currentStreak: 5,
        longestStreak: 15,
        averagePerDay: 50,
        lastActive: new Date(),
      });

      await backupService.downloadBackup();

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.download).toMatch(/omni-fit-backup-\d{4}-\d{2}-\d{2}\.json/);
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.remove).toHaveBeenCalled();

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
    });
  });

  describe('uploadBackup', () => {
    it('should process uploaded file and restore backup', async () => {
      const backupData: BackupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          workouts: mockWorkouts,
          dailyStats: mockDailyStats,
          settings: mockSettings,
          analytics: mockAnalytics,
        },
        metadata: {
          totalWorkouts: 50,
          totalSessions: 10,
          createdAt: new Date().toISOString(),
          deviceInfo: 'Test Device',
        },
      };

      const file = new File([JSON.stringify(backupData)], 'backup.json', {
        type: 'application/json',
      });

      await backupService.uploadBackup(file);

      expect(db.workouts.clear).toHaveBeenCalled();
      expect(db.workouts.bulkAdd).toHaveBeenCalledWith(mockWorkouts);
    });

    it('should reject non-JSON files', async () => {
      const file = new File(['not json'], 'backup.txt', {
        type: 'text/plain',
      });

      await expect(backupService.uploadBackup(file)).rejects.toThrow(
        'Invalid file type. Please select a JSON file.'
      );
    });

    it('should handle invalid JSON data', async () => {
      const file = new File(['invalid json'], 'backup.json', {
        type: 'application/json',
      });

      await expect(backupService.uploadBackup(file)).rejects.toThrow(
        'Invalid backup file format'
      );
    });
  });

  describe('autoBackup', () => {
    it('should perform auto backup when enabled and due', async () => {
      const settings: BackupSettings = {
        autoBackupEnabled: true,
        backupFrequency: 'daily',
        maxBackupFiles: 3,
        lastBackupDate: null, // Never backed up
      };

      localStorage.setItem('omni-fit-backup-settings', JSON.stringify(settings));

      const { analytics } = await import('@/services/analytics');
      vi.mocked(analytics.getAnalytics).mockResolvedValue({
        totalSessions: 10,
        totalWorkouts: 100,
        currentStreak: 5,
        longestStreak: 15,
        averagePerDay: 50,
        lastActive: new Date(),
      });

      await backupService.checkAndPerformAutoBackup();

      // Should save to localStorage
      const backups = Object.keys(localStorage).filter(key => 
        key.startsWith('omni-fit-backup-')
      );
      expect(backups.length).toBeGreaterThan(0);

      // Should update settings
      const updatedSettings = backupService.getBackupSettings();
      expect(updatedSettings.lastBackupDate).toBeDefined();
    });

    it('should not backup when disabled', async () => {
      const settings: BackupSettings = {
        autoBackupEnabled: false,
        backupFrequency: 'daily',
        maxBackupFiles: 3,
        lastBackupDate: null,
      };

      localStorage.setItem('omni-fit-backup-settings', JSON.stringify(settings));

      await backupService.checkAndPerformAutoBackup();

      const backups = Object.keys(localStorage).filter(key => 
        key.startsWith('omni-fit-backup-')
      );
      expect(backups.length).toBe(0);
    });

    it('should respect backup frequency', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const settings: BackupSettings = {
        autoBackupEnabled: true,
        backupFrequency: 'weekly',
        maxBackupFiles: 3,
        lastBackupDate: yesterday.toISOString(), // Backed up yesterday
      };

      localStorage.setItem('omni-fit-backup-settings', JSON.stringify(settings));

      await backupService.checkAndPerformAutoBackup();

      // Should not create new backup (weekly frequency)
      const backups = Object.keys(localStorage).filter(key => 
        key.startsWith('omni-fit-backup-')
      );
      expect(backups.length).toBe(0);
    });

    it('should clean up old backups when exceeding max files', async () => {
      // Create old backups
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        localStorage.setItem(
          `omni-fit-backup-${date.toISOString()}`,
          JSON.stringify({ test: true })
        );
      }

      const settings: BackupSettings = {
        autoBackupEnabled: true,
        backupFrequency: 'daily',
        maxBackupFiles: 3,
        lastBackupDate: null,
      };

      localStorage.setItem('omni-fit-backup-settings', JSON.stringify(settings));

      const { analytics } = await import('@/services/analytics');
      vi.mocked(analytics.getAnalytics).mockResolvedValue({
        totalSessions: 10,
        totalWorkouts: 100,
        currentStreak: 5,
        longestStreak: 15,
        averagePerDay: 50,
        lastActive: new Date(),
      });

      await backupService.checkAndPerformAutoBackup();

      const backups = Object.keys(localStorage).filter(key => 
        key.startsWith('omni-fit-backup-')
      );
      
      // Should keep only maxBackupFiles
      expect(backups.length).toBeLessThanOrEqual(3);
    });
  });
});