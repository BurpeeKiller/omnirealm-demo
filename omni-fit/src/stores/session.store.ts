"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateCreator } from "zustand";

// Types d'exercices basés sur les settings par défaut
export type ExerciseType = "burpees" | "pushups" | "squats" | "plank" | "jumping-jacks" | "lunges";

// Interface pour un compteur d'exercice de session
export interface ExerciseCounter {
  type: ExerciseType;
  name: string;
  emoji: string;
  count: number;
  target: number;
}

// Interface pour une session complétée
export interface CompletedSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // en secondes
  exercises: {
    type: ExerciseType;
    name: string;
    count: number;
    target: number;
  }[];
  totalCalories: number;
  notes?: string;
}

// État du store de session
interface SessionState {
  // Données de la session actuelle
  sessionStartTime: Date | null;
  exerciseCounters: Record<ExerciseType, ExerciseCounter>;
  isSessionActive: boolean;
  notes: string;

  // Historique des sessions
  completedSessions: CompletedSession[];

  // Actions
  startSession: () => void;
  endSession: () => Promise<void>;
  saveSessionToAPI: (session: CompletedSession) => Promise<void>;
  incrementExercise: (type: ExerciseType) => void;
  decrementExercise: (type: ExerciseType) => void;
  resetExerciseCounter: (type: ExerciseType) => void;
  resetAllCounters: () => void;
  updateTarget: (type: ExerciseType, target: number) => void;
  updateNotes: (notes: string) => void;

  // Statistiques en temps réel
  getTotalExercises: () => number;
  getEstimatedCalories: () => number;
  getSessionDuration: () => number;
}

// Exercices par défaut avec leurs informations d'affichage
const DEFAULT_EXERCISES: Record<ExerciseType, Omit<ExerciseCounter, "count">> = {
  burpees: {
    type: "burpees",
    name: "Burpees",
    emoji: "🏃",
    target: 10,
  },
  pushups: {
    type: "pushups",
    name: "Pompes",
    emoji: "💪",
    target: 10,
  },
  squats: {
    type: "squats",
    name: "Squats",
    emoji: "🦵",
    target: 15,
  },
  plank: {
    type: "plank",
    name: "Planche",
    emoji: "🧘",
    target: 30,
  },
  "jumping-jacks": {
    type: "jumping-jacks",
    name: "Jumping Jacks",
    emoji: "🤸",
    target: 20,
  },
  lunges: {
    type: "lunges",
    name: "Fentes",
    emoji: "🤺",
    target: 12,
  },
};

// Créer les compteurs initiaux
const createInitialCounters = (): Record<ExerciseType, ExerciseCounter> => {
  const counters = {} as Record<ExerciseType, ExerciseCounter>;

  for (const [type, exercise] of Object.entries(DEFAULT_EXERCISES)) {
    counters[type as ExerciseType] = {
      ...exercise,
      count: 0,
    };
  }

  return counters;
};

// Calcul des calories par type d'exercice (approximatif)
const CALORIES_PER_EXERCISE: Record<ExerciseType, number> = {
  burpees: 1.2,
  pushups: 0.5,
  squats: 0.4,
  plank: 0.2, // par seconde
  "jumping-jacks": 0.8,
  lunges: 0.6,
};

// Implémentation du store
const createSessionStore: StateCreator<
  SessionState,
  [["zustand/persist", unknown], ["zustand/immer", never]]
> = (set, get) => ({
  // État initial
  sessionStartTime: null,
  exerciseCounters: createInitialCounters(),
  isSessionActive: false,
  notes: "",
  completedSessions: [],

  // Actions
  startSession: () => {
    console.log("🏋️ Session: Starting new session");
    set(draft => {
      draft.sessionStartTime = new Date();
      draft.isSessionActive = true;
      draft.notes = "";
      // Réinitialiser tous les compteurs
      draft.exerciseCounters = createInitialCounters();
    });
  },

  endSession: async () => {
    const state = get();
    if (!state.sessionStartTime || !state.isSessionActive) {
      console.log("🏋️ Session: No active session to end");
      return;
    }

    console.log("🏋️ Session: Ending current session");
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - state.sessionStartTime.getTime()) / 1000);

    // Créer l'objet session
    const completedSession: CompletedSession = {
      id: `session-${Date.now()}`,
      startTime: state.sessionStartTime,
      endTime,
      duration,
      exercises: Object.values(state.exerciseCounters).map(counter => ({
        type: counter.type,
        name: counter.name,
        count: counter.count,
        target: counter.target,
      })),
      totalCalories: state.getEstimatedCalories(),
      notes: state.notes,
    };

    // Sauvegarder localement
    set(draft => {
      draft.completedSessions.push(completedSession);
      draft.sessionStartTime = null;
      draft.isSessionActive = false;
      draft.notes = "";
    });

    // Tenter de sauvegarder en API
    try {
      await state.saveSessionToAPI(completedSession);
      console.log("✅ Session saved to API successfully");
    } catch (error) {
      console.error("❌ Failed to save session to API:", error);
      // La session reste sauvegardée localement même si l'API échoue
    }
  },

  saveSessionToAPI: async (session: CompletedSession) => {
    const exercises = session.exercises.map(ex => ({
      exerciseId: `template-${ex.type}`, // Approximation - il faudrait mapper vers de vrais IDs
      actualSets: 1,
      actualReps: ex.count,
      actualDuration: Math.floor(session.duration / session.exercises.length),
      notes: `${ex.name}: ${ex.count}/${ex.target}`,
      pointsEarned: ex.count * 2,
    }));

    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exercises,
        totalDuration: session.duration,
        caloriesBurned: session.totalCalories,
        notes: session.notes,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save session to API");
    }

    return response.json();
  },

  incrementExercise: (type: ExerciseType) => {
    console.log(`🏋️ Session: Incrementing ${type}`);
    set(draft => {
      if (!draft.isSessionActive) {
        // Auto-start session si pas encore démarrée
        draft.sessionStartTime = new Date();
        draft.isSessionActive = true;
      }
      draft.exerciseCounters[type].count += 1;
    });
  },

  decrementExercise: (type: ExerciseType) => {
    console.log(`🏋️ Session: Decrementing ${type}`);
    set(draft => {
      const currentCount = draft.exerciseCounters[type].count;
      if (currentCount > 0) {
        draft.exerciseCounters[type].count = currentCount - 1;
      }
    });
  },

  resetExerciseCounter: (type: ExerciseType) => {
    console.log(`🏋️ Session: Resetting ${type}`);
    set(draft => {
      draft.exerciseCounters[type].count = 0;
    });
  },

  resetAllCounters: () => {
    console.log("🏋️ Session: Resetting all counters");
    set(draft => {
      draft.exerciseCounters = createInitialCounters();
    });
  },

  updateTarget: (type: ExerciseType, target: number) => {
    console.log(`🏋️ Session: Updating ${type} target to ${target}`);
    set(draft => {
      draft.exerciseCounters[type].target = target;
    });
  },

  updateNotes: (notes: string) => {
    set(draft => {
      draft.notes = notes;
    });
  },

  // Statistiques en temps réel
  getTotalExercises: () => {
    const state = get();
    return Object.values(state.exerciseCounters).reduce(
      (total, counter) => total + counter.count,
      0
    );
  },

  getEstimatedCalories: () => {
    const state = get();
    return Math.round(
      Object.values(state.exerciseCounters).reduce((total, counter) => {
        const caloriesPerUnit = CALORIES_PER_EXERCISE[counter.type];
        return total + counter.count * caloriesPerUnit;
      }, 0)
    );
  },

  getSessionDuration: () => {
    const state = get();
    if (!state.sessionStartTime || !state.isSessionActive) return 0;
    return Math.floor((Date.now() - state.sessionStartTime.getTime()) / 1000);
  },
});

// Export du hook avec persistance
export const useSessionStore = create<SessionState>()(
  persist(immer(createSessionStore), {
    name: "omnifit-session-storage",
    storage: createJSONStorage(() => localStorage),
    partialize: state => ({
      // Sauvegarder seulement les données nécessaires
      exerciseCounters: state.exerciseCounters,
      completedSessions: state.completedSessions,
      // Ne pas sauvegarder la session active pour éviter les sessions fantômes
    }),
  })
);

// Sélecteurs optimisés pour éviter les re-renders inutiles
export const useExerciseCounters = () => useSessionStore(state => state.exerciseCounters);
export const useSessionActive = () => useSessionStore(state => state.isSessionActive);
export const useSessionStartTime = () => useSessionStore(state => state.sessionStartTime);
