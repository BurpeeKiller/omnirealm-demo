import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { analytics } from "@/services/analytics";
import type { InsightData, RecommendationData, PredictionData } from "@/services/analytics";

interface AnalyticsState {
  // Data State
  dailyMetrics: any | null;
  weeklyMetrics: any | null;
  insights: {
    insights: InsightData[];
    recommendations: RecommendationData[];
    predictions: PredictionData[];
    benchmarks: any;
  } | null;
  realTimeData: any | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Settings
  timeRange: "7d" | "30d" | "90d";
  autoRefresh: boolean;
  refreshInterval: number; // en secondes

  // Privacy
  isOptedOut: boolean;

  // Actions
  loadDailyMetrics: (date?: string) => Promise<void>;
  loadWeeklyMetrics: (weeks?: number) => Promise<void>;
  loadInsights: () => Promise<void>;
  loadRealTimeData: () => Promise<void>;
  refreshAllData: () => Promise<void>;

  // Settings Actions
  setTimeRange: (range: "7d" | "30d" | "90d") => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (seconds: number) => void;

  // Privacy Actions
  optOut: () => void;
  optIn: () => void;

  // Event Tracking Actions
  trackWorkoutStart: (data?: any) => Promise<void>;
  trackWorkoutComplete: (data: any) => Promise<void>;
  trackExerciseComplete: (data: any) => Promise<void>;
  trackEvent: (event: string, data?: any) => Promise<void>;

  // Export Actions
  exportData: (format: "csv" | "pdf", period?: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      // Initial State
      dailyMetrics: null,
      weeklyMetrics: null,
      insights: null,
      realTimeData: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      timeRange: "30d",
      autoRefresh: false,
      refreshInterval: 300, // 5 minutes
      isOptedOut: false,

      // Data Loading Actions
      loadDailyMetrics: async (date?: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await analytics.getDailyMetrics(date);
          set({ dailyMetrics: data, lastUpdated: new Date(), isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to load daily metrics",
            isLoading: false,
          });
        }
      },

      loadWeeklyMetrics: async (weeks?: number) => {
        const { timeRange } = get();
        const weeksToLoad = weeks || (timeRange === "7d" ? 1 : timeRange === "30d" ? 4 : 12);

        set({ isLoading: true, error: null });
        try {
          const data = await analytics.getWeeklyMetrics(weeksToLoad);
          set({ weeklyMetrics: data, lastUpdated: new Date(), isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to load weekly metrics",
            isLoading: false,
          });
        }
      },

      loadInsights: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await analytics.getInsights();
          set({ insights: data, lastUpdated: new Date(), isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to load insights",
            isLoading: false,
          });
        }
      },

      loadRealTimeData: async () => {
        try {
          const data = await analytics.getRealTimeStats();
          set({ realTimeData: data });
        } catch (error) {
          console.warn("Failed to load real-time data:", error);
          // Ne pas définir d'erreur pour les données temps réel car c'est non-critique
        }
      },

      refreshAllData: async () => {
        const { loadDailyMetrics, loadWeeklyMetrics, loadInsights, loadRealTimeData } = get();

        set({ isLoading: true, error: null });
        try {
          await Promise.all([
            loadDailyMetrics(),
            loadWeeklyMetrics(),
            loadInsights(),
            loadRealTimeData(),
          ]);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to refresh data",
            isLoading: false,
          });
        }
      },

      // Settings Actions
      setTimeRange: range => {
        set({ timeRange: range });
        // Recharger les données avec la nouvelle période
        const { loadWeeklyMetrics } = get();
        loadWeeklyMetrics();
      },

      setAutoRefresh: enabled => {
        set({ autoRefresh: enabled });
      },

      setRefreshInterval: seconds => {
        set({ refreshInterval: seconds });
      },

      // Privacy Actions
      optOut: () => {
        analytics.optOut();
        set({ isOptedOut: true });
      },

      optIn: () => {
        analytics.optIn();
        set({ isOptedOut: false });
      },

      // Event Tracking Actions
      trackWorkoutStart: async data => {
        if (get().isOptedOut) return;
        try {
          await analytics.trackWorkoutStart(data);
        } catch (error) {
          console.warn("Failed to track workout start:", error);
        }
      },

      trackWorkoutComplete: async data => {
        if (get().isOptedOut) return;
        try {
          await analytics.trackWorkoutComplete(data);
          // Recharger les métriques du jour après un workout
          get().loadDailyMetrics();
        } catch (error) {
          console.warn("Failed to track workout complete:", error);
        }
      },

      trackExerciseComplete: async data => {
        if (get().isOptedOut) return;
        try {
          await analytics.trackExerciseComplete(data);
        } catch (error) {
          console.warn("Failed to track exercise complete:", error);
        }
      },

      trackEvent: async (event, data) => {
        if (get().isOptedOut) return;
        try {
          await analytics.trackEvent(event, data);
        } catch (error) {
          console.warn("Failed to track event:", error);
        }
      },

      // Export Actions
      exportData: async (format, period) => {
        const { timeRange } = get();
        const periodDays = period || (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90);

        try {
          if (format === "csv") {
            await analytics.exportCSV(periodDays);
          } else {
            await analytics.exportPDF(periodDays);
          }

          // Track export event
          get().trackEvent("data_export", {
            format,
            period: periodDays,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Export failed" });
          throw error;
        }
      },
    }),
    {
      name: "omnifit-analytics-store",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // Persister seulement les préférences, pas les données
        timeRange: state.timeRange,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        isOptedOut: state.isOptedOut,
      }),
    }
  )
);

// Hook pour l'auto-refresh
export const useAnalyticsAutoRefresh = () => {
  const { autoRefresh, refreshInterval, refreshAllData, loadRealTimeData } = useAnalyticsStore();

  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshAllData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshAllData]);

  // Refresh temps réel plus fréquent (30s)
  React.useEffect(() => {
    const interval = setInterval(() => {
      loadRealTimeData();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadRealTimeData]);
};

// Hook pour les métriques rapides
export const useQuickMetrics = () => {
  const { dailyMetrics, weeklyMetrics } = useAnalyticsStore();

  return React.useMemo(() => {
    if (!dailyMetrics || !weeklyMetrics) return null;

    return {
      todayExercises: dailyMetrics.totalExercises || 0,
      todayCalories: dailyMetrics.caloriesBurned || 0,
      currentStreak: weeklyMetrics.trends?.currentStreak || 0,
      weeklyProgress: weeklyMetrics.trends?.weekOverWeekGrowth || 0,
      goalProgress: dailyMetrics.goalProgress || 0,
    };
  }, [dailyMetrics, weeklyMetrics]);
};

// Hook pour les insights prioritaires
export const usePriorityInsights = () => {
  const { insights } = useAnalyticsStore();

  return React.useMemo(() => {
    if (!insights) return null;

    const highImpactInsights = insights.insights.filter(i => i.impact === "high").slice(0, 3);
    const topRecommendations = insights.recommendations
      .filter(r => r.priority === "high")
      .slice(0, 2);
    const bestPrediction = insights.predictions.find(p => p.confidence > 0.7);

    return {
      insights: highImpactInsights,
      recommendations: topRecommendations,
      prediction: bestPrediction,
      hasData: highImpactInsights.length > 0 || topRecommendations.length > 0 || !!bestPrediction,
    };
  }, [insights]);
};

// Hook pour tracking simplifié dans les composants
export const useAnalyticsTracking = () => {
  const { trackEvent, trackWorkoutStart, trackWorkoutComplete, trackExerciseComplete } =
    useAnalyticsStore();

  const trackWithContext = React.useCallback(
    (event: string, data?: any) => {
      trackEvent(event, {
        ...data,
        page: typeof window !== "undefined" ? window.location.pathname : undefined,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent]
  );

  return {
    trackEvent: trackWithContext,
    trackWorkoutStart,
    trackWorkoutComplete,
    trackExerciseComplete,
  };
};

export default useAnalyticsStore;

// Import React for hooks
import React from "react";
