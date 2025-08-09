// Capacitor imports commented out - PWA mode only
// import { Preferences } from '@capacitor/preferences';
// import { Capacitor } from '@capacitor/core';

// Types pour les préférences
export interface UserPreferences {
  startHour: number;
  endHour: number;
  intervalMinutes: number;
  exercises: {
    burpees: { enabled: boolean; count: number };
    pushups: { enabled: boolean; count: number };
    squats: { enabled: boolean; count: number };
  };
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

const PREFS_KEY = 'omni-fit-prefs';

/**
 * Sauvegarde les préférences utilisateur
 */
export async function savePreferences(prefs: UserPreferences): Promise<void> {
  // PWA mode only - use localStorage
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

/**
 * Charge les préférences utilisateur
 */
export async function loadPreferences(): Promise<UserPreferences | null> {
  // PWA mode only - use localStorage
  const stored = localStorage.getItem(PREFS_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Efface toutes les préférences
 */
export async function clearPreferences(): Promise<void> {
  // PWA mode only - use localStorage
  localStorage.removeItem(PREFS_KEY);
}

/**
 * Sauvegarde les statistiques d'entraînement
 */
export async function saveWorkoutStats(stats: any): Promise<void> {
  const key = `workout-stats-${new Date().toLocaleDateString('fr-CA')}`;
  // PWA mode only - use localStorage
  localStorage.setItem(key, JSON.stringify(stats));
}

/**
 * Charge les statistiques d'entraînement pour une date
 */
export async function loadWorkoutStats(date: Date): Promise<any | null> {
  const key = `workout-stats-${date.toLocaleDateString('fr-CA')}`;
  // PWA mode only - use localStorage
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Migration des données depuis IndexedDB vers Preferences (pour Capacitor)
 */
export async function migrateDataToNative(): Promise<void> {
  // PWA mode only - no migration needed
  return;
}

/**
 * Exporte toutes les données pour backup
 */
export async function exportAllData(): Promise<string> {
  const data = {
    preferences: await loadPreferences(),
    workouts: [],
    exportDate: new Date().toISOString(),
  };

  // TODO: Ajouter l'export des workouts depuis la base de données

  return JSON.stringify(data, null, 2);
}

/**
 * Importe les données depuis un backup
 */
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);

    if (data.preferences) {
      await savePreferences(data.preferences);
    }

    // TODO: Importer les workouts dans la base de données
  } catch (error) {
    console.error("Erreur lors de l'import des données:", error);
    throw new Error('Format de données invalide');
  }
}
