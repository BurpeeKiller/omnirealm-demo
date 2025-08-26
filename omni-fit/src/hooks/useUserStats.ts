"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UserStats {
  summary: {
    totalSessions: number;
    totalDuration: number;
    totalCalories: number;
    totalExercises: number;
    averageSessionDuration: number;
    averageCaloriesPerSession: number;
  };
  breakdown: {
    exercisesByCategory: { [key: string]: number };
    exercisesByDifficulty: { [key: string]: number };
  };
  dailyActivity: Array<{
    date: string;
    sessions: number;
    duration: number;
    calories: number;
  }>;
  achievements: string[];
  timeframe: string;
}

export function useUserStats(timeframe: "week" | "month" | "year" | "all" = "month") {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/stats?timeframe=${timeframe}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching user stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session?.user?.email, timeframe]);

  const refetch = () => {
    if (!session?.user?.email) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/stats?timeframe=${timeframe}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
}

// Helper hook for real-time stats updates
export function useRealtimeStats(timeframe: "week" | "month" | "year" | "all" = "month") {
  const { stats, loading, error, refetch } = useUserStats(timeframe);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
