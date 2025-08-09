import { db } from '@/db';
import { analytics } from './analytics';

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    workouts: any[];
    dailyStats: any[];
    settings: any[];
    analytics: any[];
  };
  metadata: {
    totalWorkouts: number;
    totalSessions: number;
    createdAt: string;
    deviceInfo: string;
  };
}

export interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  maxBackupFiles: number;
  lastBackupDate: string | null;
}

const BACKUP_STORAGE_KEY = 'omni-fit-backup-settings';
const BACKUP_PREFIX = 'omni-fit-backup-';

export class BackupService {
  private static instance: BackupService;

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  // Obtenir les paramètres de backup
  getBackupSettings(): BackupSettings {
    try {
      const saved = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load backup settings:', error);
    }

    return {
      autoBackupEnabled: true, // ✅ ACTIVÉ par défaut pour l'Option B
      backupFrequency: 'weekly',
      maxBackupFiles: 3, // Réduit de 5 à 3
      lastBackupDate: null,
    };
  }

  // Sauvegarder les paramètres de backup
  saveBackupSettings(settings: BackupSettings): void {
    try {
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save backup settings:', error);
    }
  }

  // Créer un backup complet
  async createBackup(): Promise<BackupData> {
    try {
      const [workouts, dailyStats, settings, analyticsData] = await Promise.all([
        db.workouts.orderBy('date').toArray(),
        db.dailyStats.orderBy('date').toArray(),
        db.settings.toArray(),
        db.analytics.orderBy('date').toArray(),
      ]);

      const analyticsInfo = await analytics.getAnalytics();

      const backup: BackupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          workouts,
          dailyStats,
          settings,
          analytics: analyticsData,
        },
        metadata: {
          totalWorkouts: workouts.length,
          totalSessions: analyticsInfo.totalSessions,
          createdAt: new Date().toISOString(),
          deviceInfo: `${navigator.platform} - ${navigator.userAgent.split(' ')[0]}`,
        },
      };

      return backup;
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }

  // Télécharger un backup
  async downloadBackup(): Promise<void> {
    try {
      const backup = await this.createBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omni-fit-backup-${new Date().toLocaleDateString('fr-CA')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Mettre à jour la date du dernier backup
      const settings = this.getBackupSettings();
      settings.lastBackupDate = new Date().toISOString();
      this.saveBackupSettings(settings);
    } catch (error) {
      console.error('Failed to download backup:', error);
      throw error;
    }
  }

  // Sauvegarder automatiquement dans localStorage
  async autoSaveBackup(): Promise<void> {
    try {
      const backup = await this.createBackup();
      const backupKey = `${BACKUP_PREFIX}${Date.now()}`;

      // Sauvegarder le nouveau backup
      localStorage.setItem(backupKey, JSON.stringify(backup));

      // Nettoyer les anciens backups
      this.cleanupOldBackups();

      // Mettre à jour les settings
      const settings = this.getBackupSettings();
      settings.lastBackupDate = new Date().toISOString();
      this.saveBackupSettings(settings);
    } catch (error) {
      console.warn('Failed to auto-save backup:', error);
    }
  }

  // Nettoyer les anciens backups
  private cleanupOldBackups(): void {
    try {
      const settings = this.getBackupSettings();
      const backupKeys: { key: string; timestamp: number }[] = [];

      // Trouver tous les backups
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(BACKUP_PREFIX)) {
          const timestamp = parseInt(key.replace(BACKUP_PREFIX, ''));
          if (!isNaN(timestamp)) {
            backupKeys.push({ key, timestamp });
          }
        }
      }

      // Trier par timestamp (plus récent en premier)
      backupKeys.sort((a, b) => b.timestamp - a.timestamp);

      // Supprimer les anciens backups
      if (backupKeys.length > settings.maxBackupFiles) {
        const toDelete = backupKeys.slice(settings.maxBackupFiles);
        toDelete.forEach(({ key }) => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.warn('Failed to cleanup old backups:', error);
    }
  }

  // Obtenir la liste des backups locaux
  getLocalBackups(): Array<{ key: string; date: string; size: string }> {
    const backups: Array<{ key: string; date: string; size: string }> = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(BACKUP_PREFIX)) {
          const timestamp = parseInt(key.replace(BACKUP_PREFIX, ''));
          if (!isNaN(timestamp)) {
            const data = localStorage.getItem(key);
            const size = data ? `${Math.round(data.length / 1024)} KB` : '0 KB';
            backups.push({
              key,
              date: new Date(timestamp).toLocaleString('fr-FR'),
              size,
            });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get local backups:', error);
    }

    return backups.sort((a, b) => b.key.localeCompare(a.key));
  }

  // Restaurer depuis un backup
  async restoreFromBackup(backupData: BackupData): Promise<void> {
    try {
      // Vérifier la version du backup
      if (!backupData.version || !backupData.data) {
        throw new Error('Format de backup invalide');
      }

      // Vider les tables existantes
      await Promise.all([
        db.workouts.clear(),
        db.dailyStats.clear(),
        db.settings.clear(),
        db.analytics.clear(),
      ]);

      // Restaurer les données
      await Promise.all([
        db.workouts.bulkAdd(backupData.data.workouts),
        db.dailyStats.bulkAdd(backupData.data.dailyStats),
        db.settings.bulkAdd(backupData.data.settings),
        db.analytics.bulkAdd(backupData.data.analytics),
      ]);
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  }

  // Restaurer depuis un fichier
  async restoreFromFile(file: File): Promise<void> {
    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);
      await this.restoreFromBackup(backupData);
    } catch (error) {
      console.error('Failed to restore from file:', error);
      throw error;
    }
  }

  // Vérifier si un backup automatique est nécessaire
  shouldAutoBackup(): boolean {
    const settings = this.getBackupSettings();

    if (!settings.autoBackupEnabled) {
      return false;
    }

    if (!settings.lastBackupDate) {
      return true;
    }

    const lastBackup = new Date(settings.lastBackupDate);
    const now = new Date();
    const diffMs = now.getTime() - lastBackup.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    switch (settings.backupFrequency) {
      case 'daily':
        return diffDays >= 1;
      case 'weekly':
        return diffDays >= 7;
      case 'monthly':
        return diffDays >= 30;
      default:
        return false;
    }
  }

  // Démarrer la surveillance automatique
  startAutoBackup(): void {
    // Vérifier toutes les 24 heures au lieu de toutes les heures
    setInterval(
      () => {
        if (this.shouldAutoBackup()) {
          this.autoSaveBackup();
        }
      },
      24 * 60 * 60 * 1000,
    ); // 24 heures

    // Vérification immédiate uniquement si activé
    const settings = this.getBackupSettings();
    if (settings.autoBackupEnabled && this.shouldAutoBackup()) {
      setTimeout(() => this.autoSaveBackup(), 5000); // 5 secondes après le démarrage
    }
  }

  // Exporter vers le cloud (placeholder pour futures intégrations)
  async exportToCloud(): Promise<void> {
    throw new Error('Cloud export not implemented yet');
  }
}

// Instance singleton
export const backupService = BackupService.getInstance();
