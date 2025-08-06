import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Calendar,
  Database,
  AlertTriangle,
  CheckCircle,
  Settings,
} from 'lucide-react';
import type { BackupSettings } from '@/services/backup';
import { backupService } from '@/services/backup';

export const BackupManager = () => {
  const [settings, setSettings] = useState<BackupSettings>(backupService.getBackupSettings());
  const [localBackups, setLocalBackups] = useState(backupService.getLocalBackups());
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const refreshBackupList = () => {
    setLocalBackups(backupService.getLocalBackups());
  };

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus(type);
    setStatusMessage(message);
    setTimeout(() => {
      setStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  const handleDownloadBackup = async () => {
    setIsLoading(true);
    try {
      await backupService.downloadBackup();
      showStatus('success', 'Backup téléchargé avec succès !');
      refreshBackupList();
    } catch (error) {
      showStatus('error', 'Erreur lors du téléchargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      await backupService.restoreFromFile(file);
      showStatus('success', 'Backup restauré avec succès !');
      // Recharger la page pour refléter les changements
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      showStatus('error', 'Erreur lors de la restauration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSave = async () => {
    setIsLoading(true);
    try {
      await backupService.autoSaveBackup();
      showStatus('success', 'Backup automatique créé !');
      refreshBackupList();
    } catch (error) {
      showStatus('error', 'Erreur lors du backup automatique');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = (backupKey: string) => {
    try {
      localStorage.removeItem(backupKey);
      showStatus('success', 'Backup supprimé');
      refreshBackupList();
    } catch (error) {
      showStatus('error', 'Erreur lors de la suppression');
    }
  };

  const handleSettingsChange = (newSettings: Partial<BackupSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    backupService.saveBackupSettings(updatedSettings);
  };

  const getLastBackupInfo = () => {
    if (!settings.lastBackupDate) {
      return 'Aucun backup automatique';
    }
    const date = new Date(settings.lastBackupDate);
    return `Dernier backup : ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const shouldShowWarning = () => {
    return (
      !settings.lastBackupDate ||
      Date.now() - new Date(settings.lastBackupDate).getTime() > 7 * 24 * 60 * 60 * 1000
    );
  };

  return (
    <div className="space-y-6">
      {/* Status */}
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-center gap-2 p-4 rounded-lg ${
            status === 'success' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span>{statusMessage}</span>
        </motion.div>
      )}

      {/* Avertissement */}
      {shouldShowWarning() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-400/20 border border-orange-400/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-orange-400">Backup recommandé</h3>
          </div>
          <p className="text-sm text-orange-300">
            Vos données ne sont pas sauvegardées récemment. Créez un backup pour sécuriser votre
            progression.
          </p>
        </motion.div>
      )}

      {/* Actions principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleDownloadBackup}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 p-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          {isLoading ? 'Création...' : 'Télécharger backup'}
        </button>

        <label className="flex items-center justify-center gap-3 p-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          Restaurer backup
          <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Paramètres de backup automatique */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-400" />
          Backup automatique
        </h3>

        <div className="space-y-4">
          {/* Activation */}
          <label className="flex items-center justify-between">
            <span>Activer le backup automatique</span>
            <input
              type="checkbox"
              checked={settings.autoBackupEnabled}
              onChange={(e) => handleSettingsChange({ autoBackupEnabled: e.target.checked })}
              className="w-5 h-5 text-primary-500 bg-gray-600 border-gray-500 rounded focus:ring-primary-500"
            />
          </label>

          {/* Fréquence */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Fréquence</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingsChange({ backupFrequency: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>

          {/* Nombre max de backups */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Nombre maximum de backups locaux ({settings.maxBackupFiles})
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={settings.maxBackupFiles}
              onChange={(e) => handleSettingsChange({ maxBackupFiles: Number(e.target.value) })}
              className="w-full accent-primary-500"
            />
          </div>

          {/* Info dernier backup */}
          <div className="text-sm text-gray-400 bg-gray-700/50 p-3 rounded-lg">
            <Calendar className="w-4 h-4 inline mr-2" />
            {getLastBackupInfo()}
          </div>
        </div>
      </div>

      {/* Backups locaux */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-400" />
            Backups locaux ({localBackups.length})
          </h3>
          <button
            onClick={handleAutoSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Créer maintenant
          </button>
        </div>

        {localBackups.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun backup local</p>
            <p className="text-sm">Créez votre premier backup automatique</p>
          </div>
        ) : (
          <div className="space-y-3">
            {localBackups.map((backup) => (
              <div
                key={backup.key}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{backup.date}</div>
                  <div className="text-sm text-gray-400">{backup.size}</div>
                </div>
                <button
                  onClick={() => handleDeleteBackup(backup.key)}
                  className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info technique */}
      <div className="text-xs text-gray-500 bg-gray-800/50 p-3 rounded-lg">
        <p className="mb-1">
          🔒 <strong>Sécurité :</strong> Tous les backups restent sur votre appareil (localStorage)
        </p>
        <p>
          💾 <strong>Format :</strong> JSON avec données chiffrées et métadonnées
        </p>
      </div>
    </div>
  );
};
