"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StateCreator } from "zustand";
import type { ExerciseTemplate } from "@prisma/client";

// --- TYPES ---

export interface DailyStats {
  date: string;
  totalCount: number;
  exercisesCompleted: number;
  timeSpent: number; // minutes
  streak: number;
}

export interface WeeklyStats {
  week: string;
  totalCount: number;
  average: number;
  daysActive: number;
  totalTime: number;
}

// --- STORE STATE INTERFACE ---

interface ExercisesState {
  // Data State
  exerciseTemplates: ExerciseTemplate[];
  dailyStats: DailyStats | null;
  weeklyStats: WeeklyStats | null;

  // UI State
  isLoadingTemplates: boolean;
  isLoadingStats: boolean;
  error: string | null;

  // Actions
  loadExerciseTemplates: () => Promise<void>;
  loadDailyStats: (date?: string) => Promise<void>;
  loadWeeklyStats: (weekStart?: string) => Promise<void>;
  clearError: () => void;
}

// --- STORE IMPLEMENTATION ---

const createExercisesStore: StateCreator<ExercisesState, [["zustand/persist", unknown]]> = (
  set,
  get
) => ({
  // Initial State
  exerciseTemplates: [],
  dailyStats: null,
  weeklyStats: null,

  isLoadingTemplates: false,
  isLoadingStats: false,
  error: null,

  // --- ACTIONS ---

  loadExerciseTemplates: async () => {
    if (get().exerciseTemplates.length > 0) return; // Already loaded

    set({ isLoadingTemplates: true, error: null });
    try {
      const response = await fetch("/api/exercises");
      if (!response.ok) {
        throw new Error("Failed to fetch exercise templates");
      }
      const templates: ExerciseTemplate[] = await response.json();
      set({ exerciseTemplates: templates, isLoadingTemplates: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error loading exercise templates:", errorMessage);
      set({ error: errorMessage, isLoadingTemplates: false });
    }
  },

  loadDailyStats: async (date?: string) => {
    set({ isLoadingStats: true, error: null });
    try {
      // TODO: Remplacer par un véritable appel API
      const mockStats: DailyStats = {
        date: date || new Date().toISOString().split("T")[0],
        totalCount: 120,
        exercisesCompleted: 3,
        timeSpent: 15,
        streak: 5,
      };
      await new Promise(resolve => setTimeout(resolve, 500)); // Simuler une latence réseau
      set({ dailyStats: mockStats, isLoadingStats: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error loading daily stats:", errorMessage);
      set({ error: errorMessage, isLoadingStats: false });
    }
  },

  loadWeeklyStats: async (weekStart?: string) => {
    set({ isLoadingStats: true, error: null });
    try {
      // TODO: Remplacer par un véritable appel API
      const mockStats: WeeklyStats = {
        week: weekStart || new Date().toISOString().split("T")[0],
        totalCount: 840,
        average: 120,
        daysActive: 7,
        totalTime: 105,
      };
      await new Promise(resolve => setTimeout(resolve, 500)); // Simuler une latence réseau
      set({ weeklyStats: mockStats, isLoadingStats: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error loading weekly stats:", errorMessage);
      set({ error: errorMessage, isLoadingStats: false });
    }
  },

  clearError: () => set({ error: null }),
});

// --- HOOK EXPORT ---

export const useExercisesStore = create<ExercisesState>()(
  persist(createExercisesStore, {
    name: "omnifit-exercises-v2", // Nouveau nom pour éviter les conflits avec l'ancienne version
    version: 1,
    // On ne persiste que les templates pour éviter de les recharger à chaque visite
    partialize: state => ({
      exerciseTemplates: state.exerciseTemplates,
    }),
  })
);
