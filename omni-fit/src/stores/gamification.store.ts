"use client";

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { StateCreator } from "zustand";

// Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "exercises" | "time" | "special" | "program";
  requirement: number;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  unlockedAt?: Date;
}

export interface UserStats {
  totalExercises: number;
  totalMinutes: number;
  bestStreak: number;
  currentStreak: number;
  totalWorkouts: number;
  programsCompleted: number;
  personalRecords: Record<string, number>;
}

export interface UserProgress {
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  achievements: Achievement[];
  badges: Badge[];
  stats: UserStats;
  weeklyGoals: {
    exercisesTarget: number;
    minutesTarget: number;
    currentExercises: number;
    currentMinutes: number;
  };
}

export interface LevelInfo {
  level: number;
  title: string;
  requiredPoints: number;
  nextLevel?: {
    level: number;
    title: string;
    requiredPoints: number;
  };
}

export interface NotificationItem {
  id: string;
  type: "achievement" | "badge" | "level" | "streak" | "goal";
  title: string;
  description: string;
  icon: string;
  color: string;
  timestamp: Date;
  points?: number;
  seen: boolean;
}

// Store State Interface
interface GamificationState {
  // Core State
  userProgress: UserProgress;
  availableAchievements: Achievement[];
  availableBadges: Badge[];
  levelSystem: LevelInfo[];

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;

  // UI State
  loading: boolean;
  error: string | null;
  showCelebration: boolean;
  celebrationData: NotificationItem | null;

  // Actions - Points & Levels
  addPoints: (points: number, reason?: string) => Promise<void>;
  checkLevelUp: () => void;

  // Actions - Achievements
  checkAchievements: (stats: UserStats) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  unlockBadge: (badgeId: string) => Promise<void>;

  // Actions - Stats Recording
  recordExercise: (exerciseType: string, count: number) => void;
  recordWorkout: (duration: number) => void;
  recordProgramCompletion: (programId: string) => void;
  updateStreak: (currentStreak: number) => void;
  setPersonalRecord: (exerciseType: string, value: number) => void;

  // Actions - Goals
  setWeeklyGoals: (exercisesTarget: number, minutesTarget: number) => void;
  updateWeeklyProgress: (exercises: number, minutes: number) => void;
  resetWeeklyGoals: () => void;

  // Actions - Notifications
  addNotification: (notification: Omit<NotificationItem, "id" | "timestamp" | "seen">) => void;
  markNotificationSeen: (notificationId: string) => void;
  markAllNotificationsSeen: () => void;
  clearNotifications: () => void;

  // Actions - UI
  showCelebrationModal: (data: NotificationItem) => void;
  hideCelebrationModal: () => void;
  clearError: () => void;

  // Actions - Data Management
  reset: () => void;
  exportProgress: () => UserProgress;
  importProgress: (progress: UserProgress) => void;
}

// Constants
const LEVEL_SYSTEM: LevelInfo[] = [
  { level: 1, title: "Débutant", requiredPoints: 0 },
  { level: 2, title: "Novice", requiredPoints: 100 },
  { level: 5, title: "Apprenti", requiredPoints: 500 },
  { level: 10, title: "Intermédiaire", requiredPoints: 1500 },
  { level: 15, title: "Confirmé", requiredPoints: 3000 },
  { level: 20, title: "Expert", requiredPoints: 5000 },
  { level: 25, title: "Maître", requiredPoints: 8000 },
  { level: 30, title: "Champion", requiredPoints: 12000 },
  { level: 40, title: "Légende", requiredPoints: 20000 },
  { level: 50, title: "Divinité Fitness", requiredPoints: 35000 },
].map((level, index, array) => ({
  ...level,
  nextLevel: array[index + 1],
}));

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: "streak_3",
    name: "Régularité",
    description: "3 jours consécutifs",
    icon: "🔥",
    category: "streak",
    requirement: 3,
    points: 50,
    rarity: "common",
  },
  {
    id: "streak_7",
    name: "Persévérant",
    description: "7 jours consécutifs",
    icon: "🔥",
    category: "streak",
    requirement: 7,
    points: 150,
    rarity: "rare",
  },
  {
    id: "streak_30",
    name: "Machine à Fitness",
    description: "30 jours consécutifs",
    icon: "🔥",
    category: "streak",
    requirement: 30,
    points: 1000,
    rarity: "legendary",
  },

  // Exercise Count Achievements
  {
    id: "exercises_100",
    name: "Centurion",
    description: "100 exercices au total",
    icon: "💯",
    category: "exercises",
    requirement: 100,
    points: 100,
    rarity: "common",
  },
  {
    id: "exercises_1000",
    name: "Millénaire",
    description: "1000 exercices au total",
    icon: "🏆",
    category: "exercises",
    requirement: 1000,
    points: 500,
    rarity: "epic",
  },

  // Time Achievements
  {
    id: "time_60",
    name: "Marathonien",
    description: "60 minutes au total",
    icon: "⏱️",
    category: "time",
    requirement: 60,
    points: 200,
    rarity: "rare",
  },

  // Special Achievements
  {
    id: "early_bird",
    name: "Lève-tôt",
    description: "Exercice avant 7h",
    icon: "🌅",
    category: "special",
    requirement: 1,
    points: 100,
    rarity: "rare",
  },
  {
    id: "night_owl",
    name: "Couche-tard",
    description: "Exercice après 22h",
    icon: "🌙",
    category: "special",
    requirement: 1,
    points: 100,
    rarity: "rare",
  },

  // Program Achievements
  {
    id: "program_first",
    name: "Premier Programme",
    description: "Compléter son premier programme",
    icon: "🎯",
    category: "program",
    requirement: 1,
    points: 200,
    rarity: "common",
  },
  {
    id: "program_10",
    name: "Organisé",
    description: "10 programmes complétés",
    icon: "📚",
    category: "program",
    requirement: 10,
    points: 800,
    rarity: "epic",
  },
];

const DEFAULT_BADGES: Badge[] = [
  {
    id: "beginner",
    name: "Débutant",
    description: "Bienvenue dans OmniFit !",
    icon: "🎉",
    color: "#10B981",
    requirement: "Première connexion",
  },
  {
    id: "intermediate",
    name: "Intermédiaire",
    description: "Niveau 10 atteint",
    icon: "💪",
    color: "#3B82F6",
    requirement: "Atteindre le niveau 10",
  },
  {
    id: "advanced",
    name: "Avancé",
    description: "Niveau 25 atteint",
    icon: "🏋️",
    color: "#8B5CF6",
    requirement: "Atteindre le niveau 25",
  },
  {
    id: "elite",
    name: "Élite",
    description: "Niveau 50 atteint",
    icon: "👑",
    color: "#F59E0B",
    requirement: "Atteindre le niveau 50",
  },
  {
    id: "consistency",
    name: "Consistance",
    description: "7 jours consécutifs",
    icon: "⚡",
    color: "#EF4444",
    requirement: "7 jours de streak",
  },
  {
    id: "dedication",
    name: "Dévouement",
    description: "30 jours consécutifs",
    icon: "🔥",
    color: "#DC2626",
    requirement: "30 jours de streak",
  },
];

const initialUserProgress: UserProgress = {
  totalPoints: 0,
  currentLevel: 1,
  pointsToNextLevel: 100,
  achievements: [],
  badges: [],
  stats: {
    totalExercises: 0,
    totalMinutes: 0,
    bestStreak: 0,
    currentStreak: 0,
    totalWorkouts: 0,
    programsCompleted: 0,
    personalRecords: {},
  },
  weeklyGoals: {
    exercisesTarget: 50,
    minutesTarget: 150,
    currentExercises: 0,
    currentMinutes: 0,
  },
};

// Store Implementation
const createGamificationStore: StateCreator<
  GamificationState,
  [["zustand/subscribeWithSelector", never], ["zustand/persist", unknown], ["zustand/immer", never]]
> = (set, get) => ({
  // Initial State
  userProgress: initialUserProgress,
  availableAchievements: DEFAULT_ACHIEVEMENTS,
  availableBadges: DEFAULT_BADGES,
  levelSystem: LEVEL_SYSTEM,

  notifications: [],
  unreadCount: 0,

  loading: false,
  error: null,
  showCelebration: false,
  celebrationData: null,

  // Points & Levels
  addPoints: async (points: number, reason?: string) => {
    if (points <= 0) return;

    set(draft => {
      draft.userProgress.totalPoints += points;

      // Create notification
      const notification: NotificationItem = {
        id: crypto.randomUUID(),
        type: "achievement",
        title: `+${points} points`,
        description: reason || "Points gagnés !",
        icon: "⭐",
        color: "#F59E0B",
        timestamp: new Date(),
        points,
        seen: false,
      };

      draft.notifications.unshift(notification);
      draft.unreadCount += 1;
    });

    // Check for level up
    await get().checkLevelUp();
  },

  checkLevelUp: async () => {
    const { userProgress, levelSystem } = get();
    const currentLevelInfo = levelSystem.find(l => l.level === userProgress.currentLevel);
    const nextLevelInfo = currentLevelInfo?.nextLevel;

    if (nextLevelInfo && userProgress.totalPoints >= nextLevelInfo.requiredPoints) {
      const levelAfterNext = levelSystem.find(l => l.level > nextLevelInfo.level);

      set(draft => {
        draft.userProgress.currentLevel = nextLevelInfo.level;
        draft.userProgress.pointsToNextLevel = levelAfterNext
          ? levelAfterNext.requiredPoints - userProgress.totalPoints
          : 0;
      });

      // Create level up notification
      const notification: NotificationItem = {
        id: crypto.randomUUID(),
        type: "level",
        title: "NIVEAU SUPÉRIEUR !",
        description: `Niveau ${nextLevelInfo.level} - ${nextLevelInfo.title}`,
        icon: "🆙",
        color: "#8B5CF6",
        timestamp: new Date(),
        seen: false,
      };

      set(draft => {
        draft.notifications.unshift(notification);
        draft.unreadCount += 1;
      });

      // Show celebration
      get().showCelebrationModal(notification);

      // Check for level-based badges
      if (nextLevelInfo.level === 10) await get().unlockBadge("intermediate");
      if (nextLevelInfo.level === 25) await get().unlockBadge("advanced");
      if (nextLevelInfo.level === 50) await get().unlockBadge("elite");

      // Track analytics
      trackLevelUpEvent(nextLevelInfo.level, nextLevelInfo.title);
    }
  },

  // Achievements
  checkAchievements: async (stats: UserStats) => {
    const { availableAchievements, userProgress } = get();
    const unlockedIds = userProgress.achievements.map(a => a.id);

    for (const achievement of availableAchievements) {
      if (unlockedIds.includes(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.category) {
        case "streak":
          shouldUnlock = stats.currentStreak >= achievement.requirement;
          break;
        case "exercises":
          shouldUnlock = stats.totalExercises >= achievement.requirement;
          break;
        case "time":
          shouldUnlock = stats.totalMinutes >= achievement.requirement;
          break;
        case "program":
          shouldUnlock = stats.programsCompleted >= achievement.requirement;
          break;
        case "special":
          shouldUnlock = await checkSpecialAchievement(achievement.id);
          break;
      }

      if (shouldUnlock) {
        await get().unlockAchievement(achievement.id);
      }
    }
  },

  unlockAchievement: async (achievementId: string) => {
    const { availableAchievements, userProgress } = get();
    const achievement = availableAchievements.find(a => a.id === achievementId);

    if (!achievement || userProgress.achievements.some(a => a.id === achievementId)) {
      return;
    }

    const unlockedAchievement = { ...achievement, unlockedAt: new Date() };

    set(draft => {
      draft.userProgress.achievements.push(unlockedAchievement);
    });

    // Award points
    await get().addPoints(achievement.points, `Achievement: ${achievement.name}`);

    // Create notification
    const notification: NotificationItem = {
      id: crypto.randomUUID(),
      type: "achievement",
      title: "OBJECTIF ATTEINT !",
      description: achievement.name,
      icon: achievement.icon,
      color: getRarityColor(achievement.rarity),
      timestamp: new Date(),
      points: achievement.points,
      seen: false,
    };

    set(draft => {
      draft.notifications.unshift(notification);
      draft.unreadCount += 1;
    });

    // Show celebration for rare+ achievements
    if (["rare", "epic", "legendary"].includes(achievement.rarity)) {
      get().showCelebrationModal(notification);
    }

    // Track analytics
    trackAchievementEvent(achievement.id, achievement.name, achievement.rarity);
  },

  unlockBadge: async (badgeId: string) => {
    const { availableBadges, userProgress } = get();
    const badge = availableBadges.find(b => b.id === badgeId);

    if (!badge || userProgress.badges.some(b => b.id === badgeId)) {
      return;
    }

    const unlockedBadge = { ...badge, unlockedAt: new Date() };

    set(draft => {
      draft.userProgress.badges.push(unlockedBadge);
    });

    // Create notification
    const notification: NotificationItem = {
      id: crypto.randomUUID(),
      type: "badge",
      title: "BADGE DÉBLOQUÉ !",
      description: badge.name,
      icon: badge.icon,
      color: badge.color,
      timestamp: new Date(),
      seen: false,
    };

    set(draft => {
      draft.notifications.unshift(notification);
      draft.unreadCount += 1;
    });

    // Show celebration
    get().showCelebrationModal(notification);

    // Track analytics
    trackBadgeEvent(badge.id, badge.name);
  },

  // Stats Recording
  recordExercise: (exerciseType: string, count: number) => {
    set(draft => {
      draft.userProgress.stats.totalExercises += count;

      // Update personal record
      const currentRecord = draft.userProgress.stats.personalRecords[exerciseType] || 0;
      if (count > currentRecord) {
        draft.userProgress.stats.personalRecords[exerciseType] = count;

        // Create PR notification
        const notification: NotificationItem = {
          id: crypto.randomUUID(),
          type: "achievement",
          title: "RECORD PERSONNEL !",
          description: `${exerciseType}: ${count}`,
          icon: "🏆",
          color: "#F59E0B",
          timestamp: new Date(),
          seen: false,
        };

        draft.notifications.unshift(notification);
        draft.unreadCount += 1;
      }
    });

    // Check achievements
    get().checkAchievements(get().userProgress.stats);
  },

  recordWorkout: (duration: number) => {
    set(draft => {
      draft.userProgress.stats.totalWorkouts += 1;
      draft.userProgress.stats.totalMinutes += duration;
      draft.userProgress.weeklyGoals.currentMinutes += duration;
    });

    // Award points for workout
    get().addPoints(calculateWorkoutPoints(duration), "Workout completed");

    // Check achievements
    get().checkAchievements(get().userProgress.stats);
  },

  recordProgramCompletion: (programId: string) => {
    set(draft => {
      draft.userProgress.stats.programsCompleted += 1;
    });

    // Award bonus points
    get().addPoints(100, "Program completed");

    // Check achievements
    get().checkAchievements(get().userProgress.stats);
  },

  updateStreak: (currentStreak: number) => {
    set(draft => {
      draft.userProgress.stats.currentStreak = currentStreak;
      draft.userProgress.stats.bestStreak = Math.max(
        draft.userProgress.stats.bestStreak,
        currentStreak
      );
    });

    // Award streak points
    if (currentStreak > 0) {
      get().addPoints(calculateStreakPoints(currentStreak), `Streak: ${currentStreak} jours`);
    }

    // Check for streak badges
    if (currentStreak === 7) get().unlockBadge("consistency");
    if (currentStreak === 30) get().unlockBadge("dedication");

    // Check achievements
    get().checkAchievements(get().userProgress.stats);
  },

  setPersonalRecord: (exerciseType: string, value: number) => {
    const currentRecord = get().userProgress.stats.personalRecords[exerciseType] || 0;

    if (value > currentRecord) {
      set(draft => {
        draft.userProgress.stats.personalRecords[exerciseType] = value;
      });

      get().addPoints(50, `Personal Record: ${exerciseType}`);
    }
  },

  // Goals
  setWeeklyGoals: (exercisesTarget: number, minutesTarget: number) => {
    set(draft => {
      draft.userProgress.weeklyGoals.exercisesTarget = exercisesTarget;
      draft.userProgress.weeklyGoals.minutesTarget = minutesTarget;
    });
  },

  updateWeeklyProgress: (exercises: number, minutes: number) => {
    set(draft => {
      draft.userProgress.weeklyGoals.currentExercises = exercises;
      draft.userProgress.weeklyGoals.currentMinutes = minutes;
    });

    // Check if goals are met
    const { weeklyGoals } = get().userProgress;
    if (exercises >= weeklyGoals.exercisesTarget && minutes >= weeklyGoals.minutesTarget) {
      const notification: NotificationItem = {
        id: crypto.randomUUID(),
        type: "goal",
        title: "OBJECTIFS HEBDOMADAIRES ATTEINTS !",
        description: "Bravo, continuez comme ça !",
        icon: "🎯",
        color: "#10B981",
        timestamp: new Date(),
        seen: false,
      };

      set(draft => {
        draft.notifications.unshift(notification);
        draft.unreadCount += 1;
      });

      get().addPoints(200, "Weekly goals achieved");
    }
  },

  resetWeeklyGoals: () => {
    set(draft => {
      draft.userProgress.weeklyGoals.currentExercises = 0;
      draft.userProgress.weeklyGoals.currentMinutes = 0;
    });
  },

  // Notifications
  addNotification: notification => {
    set(draft => {
      const fullNotification: NotificationItem = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        seen: false,
      };
      draft.notifications.unshift(fullNotification);
      draft.unreadCount += 1;
    });
  },

  markNotificationSeen: (notificationId: string) => {
    set(draft => {
      const notification = draft.notifications.find(n => n.id === notificationId);
      if (notification && !notification.seen) {
        notification.seen = true;
        draft.unreadCount = Math.max(0, draft.unreadCount - 1);
      }
    });
  },

  markAllNotificationsSeen: () => {
    set(draft => {
      draft.notifications.forEach(n => {
        n.seen = true;
      });
      draft.unreadCount = 0;
    });
  },

  clearNotifications: () => {
    set(draft => {
      draft.notifications = [];
      draft.unreadCount = 0;
    });
  },

  // UI Actions
  showCelebrationModal: (data: NotificationItem) => {
    set(draft => {
      draft.showCelebration = true;
      draft.celebrationData = data;
    });
  },

  hideCelebrationModal: () => {
    set(draft => {
      draft.showCelebration = false;
      draft.celebrationData = null;
    });
  },

  clearError: () => {
    set(draft => {
      draft.error = null;
    });
  },

  // Data Management
  reset: () => {
    set(draft => {
      draft.userProgress = initialUserProgress;
      draft.notifications = [];
      draft.unreadCount = 0;
      draft.showCelebration = false;
      draft.celebrationData = null;
      draft.error = null;
    });
  },

  exportProgress: () => {
    return get().userProgress;
  },

  importProgress: (progress: UserProgress) => {
    set(draft => {
      draft.userProgress = progress;
    });
  },
});

// Create store with middleware
export const useGamificationStore = create<GamificationState>()(
  subscribeWithSelector(
    persist(immer(createGamificationStore), {
      name: "omnifit-gamification",
      version: 1,
      partialize: state => ({
        userProgress: state.userProgress,
        notifications: state.notifications.slice(0, 50), // Keep only 50 latest
      }),
    })
  )
);

// Helper functions
function getRarityColor(rarity: Achievement["rarity"]): string {
  switch (rarity) {
    case "common":
      return "#10B981";
    case "rare":
      return "#3B82F6";
    case "epic":
      return "#8B5CF6";
    case "legendary":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
}

function calculateWorkoutPoints(duration: number): number {
  return Math.min(Math.floor(duration / 5) * 10, 100); // Max 100 points per workout
}

function calculateStreakPoints(streak: number): number {
  if (streak <= 3) return 10;
  if (streak <= 7) return 25;
  if (streak <= 14) return 50;
  if (streak <= 30) return 100;
  return 200;
}

async function checkSpecialAchievement(achievementId: string): Promise<boolean> {
  const hour = new Date().getHours();

  switch (achievementId) {
    case "early_bird":
      return hour < 7;
    case "night_owl":
      return hour >= 22;
    default:
      return false;
  }
}

// Analytics functions (placeholder)
async function trackLevelUpEvent(level: number, title: string): Promise<void> {
  console.log("Level up:", level, title);
}

async function trackAchievementEvent(id: string, name: string, rarity: string): Promise<void> {
  console.log("Achievement unlocked:", id, name, rarity);
}

async function trackBadgeEvent(id: string, name: string): Promise<void> {
  console.log("Badge unlocked:", id, name);
}

// Selectors for optimized re-renders
export const useUserProgress = () => useGamificationStore(state => state.userProgress);
export const useUnreadNotifications = () => useGamificationStore(state => state.unreadCount);
export const useNotifications = () => useGamificationStore(state => state.notifications);
export const useShowCelebration = () => useGamificationStore(state => state.showCelebration);
export const useCelebrationData = () => useGamificationStore(state => state.celebrationData);
export const useCurrentLevel = () => useGamificationStore(state => state.userProgress.currentLevel);
export const useTotalPoints = () => useGamificationStore(state => state.userProgress.totalPoints);
export const useCurrentStreak = () =>
  useGamificationStore(state => state.userProgress.stats.currentStreak);
export const useWeeklyGoals = () => useGamificationStore(state => state.userProgress.weeklyGoals);
