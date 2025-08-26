"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { ActivityChart } from "./ActivityChart";
import { ExerciseBreakdown } from "./ExerciseBreakdown";
import { AchievementsBadges } from "./AchievementsBadges";
import { useUserStats } from "@/hooks/useUserStats";
import { useSession } from "next-auth/react";

type TimeFrame = "week" | "month" | "year" | "all";

export function AnalyticsDashboardNew() {
  const { data: session } = useSession();
  const [timeframe, setTimeframe] = useState<TimeFrame>("month");
  const { stats, loading, error } = useUserStats(timeframe);

  if (!session?.user) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Connectez-vous pour voir vos statistiques</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
            <p className="text-gray-600">Chargement de vos statistiques...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">Erreur lors du chargement des statistiques</p>
        <p className="text-gray-600">{error}</p>
      </Card>
    );
  }

  const timeframeLabels = {
    week: "Cette semaine",
    month: "Ce mois",
    year: "Cette année",
    all: "Tout le temps",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
          <p className="text-gray-600">Suivez vos progrès et performances</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={e => setTimeframe(e.target.value as TimeFrame)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {Object.entries(timeframeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Sessions Total"
          value={stats.summary.totalSessions}
          subtitle={`${stats.summary.averageSessionDuration}min en moyenne`}
          icon="🎯"
          color="blue"
        />
        <MetricsCard
          title="Calories Brûlées"
          value={stats.summary.totalCalories.toLocaleString()}
          subtitle={`${stats.summary.averageCaloriesPerSession}cal par session`}
          icon="🔥"
          color="orange"
        />
        <MetricsCard
          title="Temps Total"
          value={`${Math.floor(stats.summary.totalDuration / 3600)}h ${Math.floor(
            (stats.summary.totalDuration % 3600) / 60
          )}m`}
          subtitle={`${stats.summary.totalExercises} exercices`}
          icon="⏰"
          color="green"
        />
        <MetricsCard
          title="Achievements"
          value={stats.achievements.length}
          subtitle="succès débloqués"
          icon="🏆"
          color="purple"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart
          data={stats.dailyActivity}
          type="line"
          metric="sessions"
          title="Sessions par Jour"
          color="#00D9B1"
        />
        <ActivityChart
          data={stats.dailyActivity}
          type="bar"
          metric="calories"
          title="Calories par Jour"
          color="#FF6B6B"
        />
      </div>

      {/* Répartitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExerciseBreakdown
          data={stats.breakdown.exercisesByCategory}
          title="Répartition par Catégorie"
          type="category"
        />
        <ExerciseBreakdown
          data={stats.breakdown.exercisesByDifficulty}
          title="Répartition par Difficulté"
          type="difficulty"
        />
      </div>

      {/* Achievements */}
      <AchievementsBadges achievements={stats.achievements} stats={stats.summary} />
    </div>
  );
}
