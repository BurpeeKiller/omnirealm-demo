import { useState } from 'react';
import { Download, Upload, FileJson, AlertCircle, CheckCircle, Settings, Clock } from 'lucide-react';
import { exportToJSON, importFromJSON } from '@/db/queries';
import { backupService } from '@/services/backup';

export default function DataManagement() {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [backupSettings, setBackupSettings] = useState(() => backupService.getBackupSettings());

  const handleExportJSON = async () => {
    try {
      const jsonData = await exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitness-reminder-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Export JSON réussi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur export JSON:', error);
      setMessage({ type: 'error', text: "Erreur lors de l'export" });
    }
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const result = await importFromJSON(text);

      setMessage({
        type: 'success',
        text: `Import réussi! ${result.imported.workouts} exercices et ${result.imported.dailyStats} jours importés.`,
      });

      // Reload page to refresh data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Erreur import JSON:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : "Erreur lors de l'import",
      });
    } finally {
      setImporting(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleBackupDownload = async () => {
    try {
      await backupService.downloadBackup();
      setMessage({ type: 'success', text: 'Backup téléchargé avec succès!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur backup:', error);
      setMessage({ type: 'error', text: "Erreur lors du backup" });
    }
  };

  const handleBackupSettingsChange = (newSettings: typeof backupSettings) => {
    setBackupSettings(newSettings);
    backupService.saveBackupSettings(newSettings);
    
    if (newSettings.autoBackupEnabled) {
      setMessage({ 
        type: 'success', 
        text: `Auto-backup ${newSettings.backupFrequency} activé !` 
      });
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Auto-backup désactivé' 
      });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileJson className="w-5 h-5" />
        Gestion des données
      </h3>

      {/* Auto-backup Settings */}
      <div className="space-y-3 p-3 bg-white dark:bg-gray-700 rounded-lg border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <h4 className="font-medium">Auto-backup</h4>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Activer l'auto-backup</span>
          <input
            type="checkbox"
            checked={backupSettings.autoBackupEnabled}
            onChange={(e) => handleBackupSettingsChange({
              ...backupSettings,
              autoBackupEnabled: e.target.checked
            })}
            className="w-4 h-4 text-purple-600"
          />
        </div>

        {backupSettings.autoBackupEnabled && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm">Fréquence</span>
              <select
                value={backupSettings.backupFrequency}
                onChange={(e) => handleBackupSettingsChange({
                  ...backupSettings,
                  backupFrequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                })}
                className="px-2 py-1 text-sm rounded border dark:bg-gray-600 dark:border-gray-500"
              >
                <option value="weekly">Hebdomadaire</option>
                <option value="daily">Quotidien</option>
                <option value="monthly">Mensuel</option>
              </select>
            </div>

            {backupSettings.lastBackupDate && (
              <div className="text-xs text-gray-500">
                Dernier backup: {new Date(backupSettings.lastBackupDate).toLocaleString('fr-FR')}
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Backup Download */}
        <button
          onClick={handleBackupDownload}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Backup Complet
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExportJSON}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>

        {/* Import JSON */}
        <label className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            disabled={importing}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {importing ? 'Import en cours...' : 'Importer JSON'}
          </div>
        </label>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <p className="text-xs text-gray-600 dark:text-gray-400">
        • <strong>Auto-backup:</strong> Sauvegarde automatique selon la fréquence choisie
        <br />• <strong>Backup Complet:</strong> Télécharge un fichier JSON avec métadonnées
        <br />• <strong>Export JSON:</strong> Format léger pour migration rapide
        <br />• <strong>Import:</strong> Restaure vos données depuis une sauvegarde
      </p>
    </div>
  );
}
