"use client";

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { StateCreator } from "zustand";
import type { ExerciseType } from "./session.store";

// Types
export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  reminders: boolean;
  achievements: boolean;
  dailyGoals: boolean;
  weeklyReports: boolean;
  marketing: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  frequency: number; // minutes
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  activeDays: (
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  )[];
  message: string;
  snoozeTime: number; // minutes
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
  reduceAnimations: boolean;
  compactMode: boolean;
}

export interface ExerciseSettings {
  exercisesPerReminder: Record<ExerciseType, number>;
  defaultRest: number; // seconds
  countdownSound: boolean;
  autoStartNext: boolean;
  vibrationOnComplete: boolean;
  confirmBeforeSkip: boolean;
}

export interface GoalsSettings {
  dailyExerciseGoal: number;
  dailyTimeGoal: number; // minutes
  weeklyExerciseGoal: number;
  weeklyTimeGoal: number; // minutes
  streakGoal: number;
  autoAdjustGoals: boolean;
}

export interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  dataSync: boolean;
  shareUsageStats: boolean;
  personalizedAds: boolean;
}

export interface AccessibilitySettings {
  screenReader: boolean;
  largeText: boolean;
  highContrast: boolean;
  colorBlindFriendly: boolean;
  reducedMotion: boolean;
  voiceCommands: boolean;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  includePersonalData: boolean;
  cloudSync: boolean;
  localBackupsCount: number;
}

export interface IntegrationsSettings {
  googleFit: {
    enabled: boolean;
    syncExercises: boolean;
    syncWeight: boolean;
  };
  appleHealth: {
    enabled: boolean;
    syncExercises: boolean;
    syncWeight: boolean;
  };
  strava: {
    enabled: boolean;
    autoPost: boolean;
  };
  fitbit: {
    enabled: boolean;
    syncExercises: boolean;
  };
}

// Store State Interface
interface SettingsState {
  // Settings Categories
  notifications: NotificationSettings;
  reminders: ReminderSettings;
  appearance: AppearanceSettings;
  exercises: ExerciseSettings;
  goals: GoalsSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  backup: BackupSettings;
  integrations: IntegrationsSettings;

  // App Meta Settings
  language: "fr" | "en";
  region: string;
  firstDayOfWeek: "sunday" | "monday";
  timeFormat: "12h" | "24h";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  units: "metric" | "imperial";

  // UI State
  loading: boolean;
  error: string | null;
  unsavedChanges: boolean;
  lastSaved: Date | null;

  // Actions - General
  updateSettings: <T extends keyof SettingsState>(
    category: T,
    updates: T extends
      | "notifications"
      | "reminders"
      | "appearance"
      | "exercises"
      | "goals"
      | "privacy"
      | "accessibility"
      | "backup"
      | "integrations"
      ? Partial<SettingsState[T]>
      : SettingsState[T]
  ) => void;
  updateSettingsDebounced: <T extends keyof SettingsState>(
    category: T,
    updates: T extends
      | "notifications"
      | "reminders"
      | "appearance"
      | "exercises"
      | "goals"
      | "privacy"
      | "accessibility"
      | "backup"
      | "integrations"
      ? Partial<SettingsState[T]>
      : SettingsState[T]
  ) => void;

  // Actions - Notifications
  toggleNotifications: () => void;
  toggleNotificationSound: () => void;
  toggleNotificationVibration: () => void;
  updateNotificationPreferences: (preferences: Partial<NotificationSettings>) => void;

  // Actions - Reminders
  toggleReminders: () => void;
  setReminderFrequency: (frequency: number) => void;
  setReminderSchedule: (startTime: string, endTime: string) => void;
  setActiveDays: (days: ReminderSettings["activeDays"]) => void;
  setReminderMessage: (message: string) => void;

  // Actions - Appearance
  setTheme: (theme: AppearanceSettings["theme"]) => void;
  setAccentColor: (color: string) => void;
  setFontSize: (size: AppearanceSettings["fontSize"]) => void;
  toggleHighContrast: () => void;
  toggleCompactMode: () => void;

  // Actions - Exercises
  setExerciseIncrement: (exerciseType: ExerciseType, increment: number) => void;
  setDefaultRest: (seconds: number) => void;
  toggleAutoStartNext: () => void;
  toggleCountdownSound: () => void;

  // Actions - Goals
  setDailyGoals: (exerciseGoal: number, timeGoal: number) => void;
  setWeeklyGoals: (exerciseGoal: number, timeGoal: number) => void;
  setStreakGoal: (goal: number) => void;
  toggleAutoAdjustGoals: () => void;

  // Actions - Privacy
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  toggleAnalytics: () => void;
  toggleDataSync: () => void;

  // Actions - Accessibility
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  toggleScreenReader: () => void;
  toggleLargeText: () => void;

  // Actions - Backup
  updateBackupSettings: (settings: Partial<BackupSettings>) => void;
  toggleAutoBackup: () => void;
  triggerManualBackup: () => Promise<void>;
  restoreFromBackup: (backupId: string) => Promise<void>;

  // Actions - Integrations
  toggleIntegration: (service: keyof IntegrationsSettings, enabled: boolean) => Promise<void>;
  syncWithIntegration: (service: keyof IntegrationsSettings) => Promise<void>;
  disconnectIntegration: (service: keyof IntegrationsSettings) => Promise<void>;

  // Actions - Import/Export
  exportSettings: () => string;
  importSettings: (settingsJson: string) => Promise<void>;
  resetToDefaults: () => void;
  resetCategory: (category: keyof SettingsState) => void;

  // Actions - Validation
  validateSettings: () => boolean;
  saveSettings: () => Promise<void>;
  discardChanges: () => void;
  clearError: () => void;
}

// Default Settings
const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  enabled: true,
  sound: true,
  vibration: true,
  reminders: true,
  achievements: true,
  dailyGoals: true,
  weeklyReports: false,
  marketing: false,
};

const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: true,
  frequency: 30, // every 30 minutes
  startTime: "09:00",
  endTime: "18:00",
  activeDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  message: "C'est l'heure de bouger ! 💪",
  snoozeTime: 5,
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "system",
  accentColor: "#3B82F6",
  fontSize: "medium",
  highContrast: false,
  reduceAnimations: false,
  compactMode: false,
};

const DEFAULT_EXERCISES: ExerciseSettings = {
  exercisesPerReminder: {
    burpees: 10,
    pushups: 10,
    squats: 15,
    plank: 30,
    "jumping-jacks": 20,
    lunges: 12,
  },
  defaultRest: 30,
  countdownSound: true,
  autoStartNext: false,
  vibrationOnComplete: true,
  confirmBeforeSkip: true,
};

const DEFAULT_GOALS: GoalsSettings = {
  dailyExerciseGoal: 50,
  dailyTimeGoal: 15,
  weeklyExerciseGoal: 300,
  weeklyTimeGoal: 120,
  streakGoal: 7,
  autoAdjustGoals: false,
};

const DEFAULT_PRIVACY: PrivacySettings = {
  analytics: true,
  crashReports: true,
  dataSync: true,
  shareUsageStats: false,
  personalizedAds: false,
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  screenReader: false,
  largeText: false,
  highContrast: false,
  colorBlindFriendly: false,
  reducedMotion: false,
  voiceCommands: false,
};

const DEFAULT_BACKUP: BackupSettings = {
  autoBackup: true,
  backupFrequency: "weekly",
  includePersonalData: true,
  cloudSync: true,
  localBackupsCount: 5,
};

const DEFAULT_INTEGRATIONS: IntegrationsSettings = {
  googleFit: {
    enabled: false,
    syncExercises: true,
    syncWeight: false,
  },
  appleHealth: {
    enabled: false,
    syncExercises: true,
    syncWeight: false,
  },
  strava: {
    enabled: false,
    autoPost: false,
  },
  fitbit: {
    enabled: false,
    syncExercises: true,
  },
};

// Debounce utility
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Store Implementation
const createSettingsStore: StateCreator<
  SettingsState,
  [["zustand/subscribeWithSelector", never], ["zustand/persist", unknown], ["zustand/immer", never]]
> = (set, get) => {
  const updateSettingsImmediate = <T extends keyof SettingsState>(category: T, updates: any) => {
    set(draft => {
      if (typeof draft[category] === "object" && draft[category] !== null) {
        Object.assign(draft[category] as any, updates);
      } else {
        (draft as any)[category] = updates;
      }
      draft.unsavedChanges = true;
    });
  };

  const updateSettingsDebounced = debounce(updateSettingsImmediate, 500);

  return {
    // Initial State
    notifications: DEFAULT_NOTIFICATIONS,
    reminders: DEFAULT_REMINDERS,
    appearance: DEFAULT_APPEARANCE,
    exercises: DEFAULT_EXERCISES,
    goals: DEFAULT_GOALS,
    privacy: DEFAULT_PRIVACY,
    accessibility: DEFAULT_ACCESSIBILITY,
    backup: DEFAULT_BACKUP,
    integrations: DEFAULT_INTEGRATIONS,

    language: "fr",
    region: "FR",
    firstDayOfWeek: "monday",
    timeFormat: "24h",
    dateFormat: "DD/MM/YYYY",
    units: "metric",

    loading: false,
    error: null,
    unsavedChanges: false,
    lastSaved: null,

    // General Actions
    updateSettings: updateSettingsImmediate,
    updateSettingsDebounced,

    // Notifications
    toggleNotifications: () => {
      set(draft => {
        draft.notifications.enabled = !draft.notifications.enabled;
        draft.unsavedChanges = true;
      });
    },

    toggleNotificationSound: () => {
      set(draft => {
        draft.notifications.sound = !draft.notifications.sound;
        draft.unsavedChanges = true;
      });
    },

    toggleNotificationVibration: () => {
      set(draft => {
        draft.notifications.vibration = !draft.notifications.vibration;
        draft.unsavedChanges = true;
      });
    },

    updateNotificationPreferences: (preferences: Partial<NotificationSettings>) => {
      set(draft => {
        Object.assign(draft.notifications, preferences);
        draft.unsavedChanges = true;
      });
    },

    // Reminders
    toggleReminders: () => {
      set(draft => {
        draft.reminders.enabled = !draft.reminders.enabled;
        draft.unsavedChanges = true;
      });

      // Update reminder service
      updateReminderService(get().reminders);
    },

    setReminderFrequency: (frequency: number) => {
      if (frequency < 5 || frequency > 240) return; // 5 min to 4 hours

      set(draft => {
        draft.reminders.frequency = frequency;
        draft.unsavedChanges = true;
      });

      updateReminderService(get().reminders);
    },

    setReminderSchedule: (startTime: string, endTime: string) => {
      set(draft => {
        draft.reminders.startTime = startTime;
        draft.reminders.endTime = endTime;
        draft.unsavedChanges = true;
      });

      updateReminderService(get().reminders);
    },

    setActiveDays: (days: ReminderSettings["activeDays"]) => {
      set(draft => {
        draft.reminders.activeDays = days;
        draft.unsavedChanges = true;
      });

      updateReminderService(get().reminders);
    },

    setReminderMessage: (message: string) => {
      set(draft => {
        draft.reminders.message = message.trim();
        draft.unsavedChanges = true;
      });
    },

    // Appearance
    setTheme: (theme: AppearanceSettings["theme"]) => {
      set(draft => {
        draft.appearance.theme = theme;
        draft.unsavedChanges = true;
      });

      // Apply theme immediately
      applyTheme(theme);
    },

    setAccentColor: (color: string) => {
      set(draft => {
        draft.appearance.accentColor = color;
        draft.unsavedChanges = true;
      });

      // Apply color immediately
      applyAccentColor(color);
    },

    setFontSize: (size: AppearanceSettings["fontSize"]) => {
      set(draft => {
        draft.appearance.fontSize = size;
        draft.unsavedChanges = true;
      });

      // Apply font size immediately
      applyFontSize(size);
    },

    toggleHighContrast: () => {
      set(draft => {
        draft.appearance.highContrast = !draft.appearance.highContrast;
        draft.unsavedChanges = true;
      });

      // Apply contrast immediately
      applyHighContrast(get().appearance.highContrast);
    },

    toggleCompactMode: () => {
      set(draft => {
        draft.appearance.compactMode = !draft.appearance.compactMode;
        draft.unsavedChanges = true;
      });
    },

    // Exercises
    setExerciseIncrement: (exerciseType: ExerciseType, increment: number) => {
      if (increment < 1 || increment > 100) return;

      set(draft => {
        draft.exercises.exercisesPerReminder[exerciseType] = increment;
        draft.unsavedChanges = true;
      });
    },

    setDefaultRest: (seconds: number) => {
      if (seconds < 0 || seconds > 300) return; // Max 5 minutes

      set(draft => {
        draft.exercises.defaultRest = seconds;
        draft.unsavedChanges = true;
      });
    },

    toggleAutoStartNext: () => {
      set(draft => {
        draft.exercises.autoStartNext = !draft.exercises.autoStartNext;
        draft.unsavedChanges = true;
      });
    },

    toggleCountdownSound: () => {
      set(draft => {
        draft.exercises.countdownSound = !draft.exercises.countdownSound;
        draft.unsavedChanges = true;
      });
    },

    // Goals
    setDailyGoals: (exerciseGoal: number, timeGoal: number) => {
      if (exerciseGoal < 0 || timeGoal < 0) return;

      set(draft => {
        draft.goals.dailyExerciseGoal = exerciseGoal;
        draft.goals.dailyTimeGoal = timeGoal;
        draft.unsavedChanges = true;
      });
    },

    setWeeklyGoals: (exerciseGoal: number, timeGoal: number) => {
      if (exerciseGoal < 0 || timeGoal < 0) return;

      set(draft => {
        draft.goals.weeklyExerciseGoal = exerciseGoal;
        draft.goals.weeklyTimeGoal = timeGoal;
        draft.unsavedChanges = true;
      });
    },

    setStreakGoal: (goal: number) => {
      if (goal < 1) return;

      set(draft => {
        draft.goals.streakGoal = goal;
        draft.unsavedChanges = true;
      });
    },

    toggleAutoAdjustGoals: () => {
      set(draft => {
        draft.goals.autoAdjustGoals = !draft.goals.autoAdjustGoals;
        draft.unsavedChanges = true;
      });
    },

    // Privacy
    updatePrivacySettings: (settings: Partial<PrivacySettings>) => {
      set(draft => {
        Object.assign(draft.privacy, settings);
        draft.unsavedChanges = true;
      });

      // Apply privacy settings
      applyPrivacySettings(get().privacy);
    },

    toggleAnalytics: () => {
      set(draft => {
        draft.privacy.analytics = !draft.privacy.analytics;
        draft.unsavedChanges = true;
      });

      // Update analytics service
      updateAnalyticsConsent(get().privacy.analytics);
    },

    toggleDataSync: () => {
      set(draft => {
        draft.privacy.dataSync = !draft.privacy.dataSync;
        draft.unsavedChanges = true;
      });
    },

    // Accessibility
    updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => {
      set(draft => {
        Object.assign(draft.accessibility, settings);
        draft.unsavedChanges = true;
      });

      // Apply accessibility settings
      applyAccessibilitySettings(get().accessibility);
    },

    toggleScreenReader: () => {
      set(draft => {
        draft.accessibility.screenReader = !draft.accessibility.screenReader;
        draft.unsavedChanges = true;
      });
    },

    toggleLargeText: () => {
      set(draft => {
        draft.accessibility.largeText = !draft.accessibility.largeText;
        draft.unsavedChanges = true;
      });

      // Apply large text
      applyLargeText(get().accessibility.largeText);
    },

    // Backup
    updateBackupSettings: (settings: Partial<BackupSettings>) => {
      set(draft => {
        Object.assign(draft.backup, settings);
        draft.unsavedChanges = true;
      });
    },

    toggleAutoBackup: () => {
      set(draft => {
        draft.backup.autoBackup = !draft.backup.autoBackup;
        draft.unsavedChanges = true;
      });

      // Update backup service
      updateBackupService(get().backup);
    },

    triggerManualBackup: async () => {
      set(draft => {
        draft.loading = true;
        draft.error = null;
      });

      try {
        await createManualBackup(get().backup);

        set(draft => {
          draft.loading = false;
        });

        // Show success notification
        showNotification("Sauvegarde créée avec succès", "success");
      } catch (error) {
        console.error("Error creating backup:", error);
        set(draft => {
          draft.error = "Failed to create backup";
          draft.loading = false;
        });
      }
    },

    restoreFromBackup: async (backupId: string) => {
      set(draft => {
        draft.loading = true;
        draft.error = null;
      });

      try {
        await restoreBackup(backupId);

        set(draft => {
          draft.loading = false;
        });

        // Show success notification
        showNotification("Données restaurées avec succès", "success");
      } catch (error) {
        console.error("Error restoring backup:", error);
        set(draft => {
          draft.error = "Failed to restore backup";
          draft.loading = false;
        });
      }
    },

    // Integrations
    toggleIntegration: async (service: keyof IntegrationsSettings, enabled: boolean) => {
      set(draft => {
        draft.loading = true;
        draft.error = null;
      });

      try {
        if (enabled) {
          await connectIntegration(service);
        } else {
          await disconnectIntegration(service);
        }

        set(draft => {
          (draft.integrations[service] as any).enabled = enabled;
          draft.unsavedChanges = true;
          draft.loading = false;
        });
      } catch (error) {
        console.error(`Error ${enabled ? "connecting" : "disconnecting"} ${service}:`, error);
        set(draft => {
          draft.error = `Failed to ${enabled ? "connect" : "disconnect"} ${service}`;
          draft.loading = false;
        });
      }
    },

    syncWithIntegration: async (service: keyof IntegrationsSettings) => {
      set(draft => {
        draft.loading = true;
        draft.error = null;
      });

      try {
        await syncIntegrationData(service);

        set(draft => {
          draft.loading = false;
        });

        showNotification(`Synchronisation ${service} réussie`, "success");
      } catch (error) {
        console.error(`Error syncing with ${service}:`, error);
        set(draft => {
          draft.error = `Failed to sync with ${service}`;
          draft.loading = false;
        });
      }
    },

    disconnectIntegration: async (service: keyof IntegrationsSettings) => {
      await get().toggleIntegration(service, false);
    },

    // Import/Export
    exportSettings: (): string => {
      const state = get();
      const exportData = {
        notifications: state.notifications,
        reminders: state.reminders,
        appearance: state.appearance,
        exercises: state.exercises,
        goals: state.goals,
        privacy: state.privacy,
        accessibility: state.accessibility,
        backup: state.backup,
        integrations: state.integrations,
        language: state.language,
        region: state.region,
        firstDayOfWeek: state.firstDayOfWeek,
        timeFormat: state.timeFormat,
        dateFormat: state.dateFormat,
        units: state.units,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      };

      return JSON.stringify(exportData, null, 2);
    },

    importSettings: async (settingsJson: string) => {
      set(draft => {
        draft.loading = true;
        draft.error = null;
      });

      try {
        const importData = JSON.parse(settingsJson);

        // Validate settings structure
        if (!validateImportedSettings(importData)) {
          throw new Error("Invalid settings format");
        }

        set(draft => {
          // Import all valid settings
          if (importData.notifications) draft.notifications = importData.notifications;
          if (importData.reminders) draft.reminders = importData.reminders;
          if (importData.appearance) draft.appearance = importData.appearance;
          if (importData.exercises) draft.exercises = importData.exercises;
          if (importData.goals) draft.goals = importData.goals;
          if (importData.privacy) draft.privacy = importData.privacy;
          if (importData.accessibility) draft.accessibility = importData.accessibility;
          if (importData.backup) draft.backup = importData.backup;
          if (importData.integrations) draft.integrations = importData.integrations;

          if (importData.language) draft.language = importData.language;
          if (importData.region) draft.region = importData.region;
          if (importData.firstDayOfWeek) draft.firstDayOfWeek = importData.firstDayOfWeek;
          if (importData.timeFormat) draft.timeFormat = importData.timeFormat;
          if (importData.dateFormat) draft.dateFormat = importData.dateFormat;
          if (importData.units) draft.units = importData.units;

          draft.unsavedChanges = true;
          draft.loading = false;
        });

        // Apply imported settings
        applyAllSettings(get());

        showNotification("Paramètres importés avec succès", "success");
      } catch (error) {
        console.error("Error importing settings:", error);
        set(draft => {
          draft.error = "Failed to import settings";
          draft.loading = false;
        });
      }
    },

    resetToDefaults: () => {
      set(draft => {
        draft.notifications = DEFAULT_NOTIFICATIONS;
        draft.reminders = DEFAULT_REMINDERS;
        draft.appearance = DEFAULT_APPEARANCE;
        draft.exercises = DEFAULT_EXERCISES;
        draft.goals = DEFAULT_GOALS;
        draft.privacy = DEFAULT_PRIVACY;
        draft.accessibility = DEFAULT_ACCESSIBILITY;
        draft.backup = DEFAULT_BACKUP;
        draft.integrations = DEFAULT_INTEGRATIONS;

        draft.language = "fr";
        draft.region = "FR";
        draft.firstDayOfWeek = "monday";
        draft.timeFormat = "24h";
        draft.dateFormat = "DD/MM/YYYY";
        draft.units = "metric";

        draft.unsavedChanges = true;
      });

      // Apply default settings
      applyAllSettings(get());
    },

    resetCategory: (category: keyof SettingsState) => {
      const defaults = {
        notifications: DEFAULT_NOTIFICATIONS,
        reminders: DEFAULT_REMINDERS,
        appearance: DEFAULT_APPEARANCE,
        exercises: DEFAULT_EXERCISES,
        goals: DEFAULT_GOALS,
        privacy: DEFAULT_PRIVACY,
        accessibility: DEFAULT_ACCESSIBILITY,
        backup: DEFAULT_BACKUP,
        integrations: DEFAULT_INTEGRATIONS,
      };

      if (category in defaults) {
        set(draft => {
          (draft as any)[category] = (defaults as any)[category];
          draft.unsavedChanges = true;
        });
      }
    },

    // Validation & Saving
    validateSettings: (): boolean => {
      const state = get();

      // Validate reminder times
      if (state.reminders.frequency < 5 || state.reminders.frequency > 240) return false;

      // Validate goals
      if (state.goals.dailyExerciseGoal < 0 || state.goals.dailyTimeGoal < 0) return false;
      if (state.goals.weeklyExerciseGoal < 0 || state.goals.weeklyTimeGoal < 0) return false;

      // Add more validations as needed

      return true;
    },

    saveSettings: async () => {
      if (!get().validateSettings()) {
        set(draft => {
          draft.error = "Invalid settings detected";
        });
        return;
      }

      set(draft => {
        draft.loading = true;
        draft.error = null;
      });

      try {
        await saveSettingsToServer(get());

        set(draft => {
          draft.unsavedChanges = false;
          draft.lastSaved = new Date();
          draft.loading = false;
        });
      } catch (error) {
        console.error("Error saving settings:", error);
        set(draft => {
          draft.error = "Failed to save settings";
          draft.loading = false;
        });
      }
    },

    discardChanges: () => {
      // Reload settings from server/storage
      set(draft => {
        draft.unsavedChanges = false;
      });
    },

    clearError: () => {
      set(draft => {
        draft.error = null;
      });
    },
  };
};

// Create store with middleware
export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector(
    persist(immer(createSettingsStore), {
      name: "omnifit-settings",
      version: 1,
      partialize: state => ({
        notifications: state.notifications,
        reminders: state.reminders,
        appearance: state.appearance,
        exercises: state.exercises,
        goals: state.goals,
        privacy: state.privacy,
        accessibility: state.accessibility,
        backup: state.backup,
        integrations: state.integrations,
        language: state.language,
        region: state.region,
        firstDayOfWeek: state.firstDayOfWeek,
        timeFormat: state.timeFormat,
        dateFormat: state.dateFormat,
        units: state.units,
        lastSaved: state.lastSaved,
      }),
    })
  )
);

// Helper functions (placeholder implementations)
function applyTheme(theme: AppearanceSettings["theme"]): void {
  // Apply theme to document
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function applyAccentColor(color: string): void {
  // Apply accent color
  if (typeof window !== "undefined") {
    document.documentElement.style.setProperty("--accent-color", color);
  }
}

function applyFontSize(size: AppearanceSettings["fontSize"]): void {
  // Apply font size
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-font-size", size);
  }
}

function applyHighContrast(enabled: boolean): void {
  // Apply high contrast
  if (typeof window !== "undefined") {
    document.documentElement.toggleAttribute("data-high-contrast", enabled);
  }
}

function applyLargeText(enabled: boolean): void {
  // Apply large text
  if (typeof window !== "undefined") {
    document.documentElement.toggleAttribute("data-large-text", enabled);
  }
}

function applyPrivacySettings(settings: PrivacySettings): void {
  console.log("Applying privacy settings:", settings);
}

function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  console.log("Applying accessibility settings:", settings);
}

function applyAllSettings(settings: SettingsState): void {
  applyTheme(settings.appearance.theme);
  applyAccentColor(settings.appearance.accentColor);
  applyFontSize(settings.appearance.fontSize);
  applyHighContrast(settings.appearance.highContrast);
  applyLargeText(settings.accessibility.largeText);
  applyPrivacySettings(settings.privacy);
  applyAccessibilitySettings(settings.accessibility);
}

function updateReminderService(settings: ReminderSettings): void {
  console.log("Updating reminder service:", settings);
}

function updateAnalyticsConsent(enabled: boolean): void {
  console.log("Analytics consent:", enabled);
}

function updateBackupService(settings: BackupSettings): void {
  console.log("Updating backup service:", settings);
}

function validateImportedSettings(data: any): boolean {
  // Basic validation
  return typeof data === "object" && data !== null;
}

async function saveSettingsToServer(settings: SettingsState): Promise<void> {
  console.log("Saving settings to server");
}

async function createManualBackup(settings: BackupSettings): Promise<void> {
  console.log("Creating manual backup");
}

async function restoreBackup(backupId: string): Promise<void> {
  console.log("Restoring backup:", backupId);
}

async function connectIntegration(service: string): Promise<void> {
  console.log("Connecting to:", service);
}

async function disconnectIntegration(service: string): Promise<void> {
  console.log("Disconnecting from:", service);
}

async function syncIntegrationData(service: string): Promise<void> {
  console.log("Syncing with:", service);
}

function showNotification(message: string, type: "success" | "error"): void {
  console.log(`${type.toUpperCase()}: ${message}`);
}

// Selectors for optimized re-renders
export const useNotificationSettings = () => useSettingsStore(state => state.notifications);
export const useReminderSettings = () => useSettingsStore(state => state.reminders);
export const useAppearanceSettings = () => useSettingsStore(state => state.appearance);
export const useExerciseSettings = () => useSettingsStore(state => state.exercises);
export const useGoalsSettings = () => useSettingsStore(state => state.goals);
export const usePrivacySettings = () => useSettingsStore(state => state.privacy);
export const useAccessibilitySettings = () => useSettingsStore(state => state.accessibility);
export const useBackupSettings = () => useSettingsStore(state => state.backup);
export const useIntegrationsSettings = () => useSettingsStore(state => state.integrations);
export const useSettingsLoading = () => useSettingsStore(state => state.loading);
export const useSettingsError = () => useSettingsStore(state => state.error);
export const useUnsavedChanges = () => useSettingsStore(state => state.unsavedChanges);
