"use client";

// Store exports
export * from "./exercises.store";
export * from "./gamification.store";
export * from "./auth.store";
export * from "./settings.store";
export * from "./session.store";

// Store instances for global access
export { useExercisesStore } from "./exercises.store";
export { useGamificationStore } from "./gamification.store";
export { useAuthStore } from "./auth.store";
export { useSettingsStore } from "./settings.store";
export { useSessionStore } from "./session.store";

// Export types from individual stores
export type { DailyStats, WeeklyStats } from "./exercises.store";

export type {
  Achievement,
  Badge,
  UserStats,
  UserProgress,
  LevelInfo,
  NotificationItem,
} from "./gamification.store";

export type { UserProfile, Subscription, PremiumFeature, UsageLimits } from "./auth.store";

export type {
  NotificationSettings,
  ReminderSettings,
  AppearanceSettings,
  ExerciseSettings,
} from "./settings.store";

export type { ExerciseType, ExerciseCounter, CompletedSession } from "./session.store";
