import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AnalyticsData } from '@/services/analytics';
import { analytics } from '@/services/analytics';
import { TrendingUp, Target, Award, BarChart3, Download } from 'lucide-react';

interface AnalyticsViewProps {
  onExport?: () => void;
}

export const AnalyticsView = ({ onExport }: AnalyticsViewProps) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const analyticsData = await analytics.getAnalytics();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const csvData = await analytics.exportAnalytics();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitness-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onExport?.();
    } catch (error) {
      console.error('Failed to export analytics:', error);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Chargement des analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Impossible de charger les analytics</div>
      </div>
    );
  }

  const metrics = [
    {
      icon: BarChart3,
      label: 'Total Exercices',
      value: data.totalExercises.toString(),
      subtitle: `${data.totalSessions} sessions`,
    },
    {
      icon: TrendingUp,
      label: 'Série Actuelle',
      value: `${data.currentStreak} jours`,
      subtitle: `Record: ${data.longestStreak} jours`,
    },
    {
      icon: Target,
      label: 'Objectif Quotidien',
      value: data.dailyGoalAchieved ? '✅ Atteint' : '⏳ En cours',
      subtitle: '10 exercices/jour',
    },
    {
      icon: Award,
      label: 'Exercice Favori',
      value: data.favoriteExercise,
      subtitle: `${data.exerciseDistribution[data.favoriteExercise as keyof typeof data.exerciseDistribution]} fois`,
    },
  ];

  const weeklyMetrics = [
    {
      label: 'Cette semaine',
      value: data.thisWeekTotal,
      change: data.weekOverWeekGrowth,
      isPositive: data.weekOverWeekGrowth >= 0,
    },
    {
      label: 'Semaine dernière',
      value: data.lastWeekTotal,
      change: null,
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header avec export */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-200">Analytics</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="bg-gray-800 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <metric.icon className="w-5 h-5 text-primary-400" />
              <span className="text-sm text-gray-400">{metric.label}</span>
            </div>
            <div className="text-lg font-bold text-gray-200">{metric.value}</div>
            <div className="text-xs text-gray-500">{metric.subtitle}</div>
          </motion.div>
        ))}
      </div>

      {/* Métriques hebdomadaires */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Tendance Hebdomadaire</h3>
        <div className="grid grid-cols-2 gap-4">
          {weeklyMetrics.map((metric, index) => (
            <div key={metric.label} className="text-center">
              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-gray-200 mb-1">{metric.value}</div>
              {metric.change !== null && (
                <div className={`text-xs ${metric.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.isPositive ? '+' : ''}
                  {metric.change.toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Répartition des exercices */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Répartition des Exercices</h3>
        <div className="space-y-3">
          {Object.entries(data.exerciseDistribution).map(([exercise, count]) => {
            const percentage = data.totalExercises > 0 ? (count / data.totalExercises) * 100 : 0;
            return (
              <div key={exercise} className="flex items-center justify-between">
                <span className="text-gray-400 capitalize">{exercise}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 w-12 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progression de l'objectif hebdomadaire */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Objectif Hebdomadaire</span>
          <span className="text-sm text-gray-300">{data.thisWeekTotal}/70 exercices</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-400 to-secondary-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${data.weeklyGoalProgress}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">
          {data.weeklyGoalProgress.toFixed(1)}% complété
        </div>
      </div>

      {/* Stats supplémentaires */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div>
          <span className="block">Moyenne/jour</span>
          <span className="text-gray-200 font-semibold">
            {data.averageExercisesPerDay.toFixed(1)}
          </span>
        </div>
        <div>
          <span className="block">Jours actifs</span>
          <span className="text-gray-200 font-semibold">{data.activeDays}</span>
        </div>
      </div>
    </div>
  );
};
