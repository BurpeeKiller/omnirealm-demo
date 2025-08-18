import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { getWeekStats } from '@/db';
import type { DailyStats as DailyStatsType } from '@/types';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/utils/logger';

// Lazy loading des composants Chart.js
const Line = lazy(() => import('./ChartComponents').then(module => ({ default: module.Line })));
const Bar = lazy(() => import('./ChartComponents').then(module => ({ default: module.Bar })));

export const WeeklyStats = () => {
  const [weekStats, setWeekStats] = useState<DailyStatsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeekStats();
  }, []);

  const loadWeekStats = async () => {
    setLoading(true);
    try {
      const stats = await getWeekStats();
      setWeekStats(stats);
    } catch (error) {
      logger.error('Error loading week stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Prepare data for charts
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dayData = days.map((day, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    const dateStr = format(date, 'yyyy-MM-dd');
    const stat = weekStats.find((s) => s.date === dateStr);

    return {
      day,
      date: dateStr,
      burpees: stat?.burpees || 0,
      pushups: stat?.pushups || 0,
      squats: stat?.squats || 0,
      total: stat?.total || 0,
    };
  });

  const weekTotal = dayData.reduce((sum, day) => sum + day.total, 0);
  const weekAverage = Math.round(weekTotal / 7);
  const bestDay = dayData.reduce((best, day) => (day.total > best.total ? day : best));

  const chartData = {
    labels: days,
    datasets: [
      {
        label: 'Burpees',
        data: dayData.map((d) => d.burpees),
        borderColor: '#f97316',
        backgroundColor: '#f9731633',
        tension: 0.3,
      },
      {
        label: 'Pompes',
        data: dayData.map((d) => d.pushups),
        borderColor: '#a855f7',
        backgroundColor: '#a855f733',
        tension: 0.3,
      },
      {
        label: 'Squats',
        data: dayData.map((d) => d.squats),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f633',
        tension: 0.3,
      },
    ],
  };

  const totalChartData = {
    labels: days,
    datasets: [
      {
        label: 'Total',
        data: dayData.map((d) => d.total),
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#e5e7eb',
        bodyColor: '#e5e7eb',
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
      y: {
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <div className="text-center mb-4">
        <h3 className="text-lg text-gray-400">
          {format(weekStart, 'dd MMMM', { locale: fr })} -{' '}
          {format(weekEnd, 'dd MMMM yyyy', { locale: fr })}
        </h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="stat-card text-center transition-all duration-200 hover:shadow-lg hover:border-gray-600 hover:translate-y-[-2px] cursor-default"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-3xl font-bold text-gradient mb-1">{weekTotal}</div>
          <div className="text-sm text-gray-400">Total semaine</div>
        </motion.div>

        <motion.div
          className="stat-card text-center transition-all duration-200 hover:shadow-lg hover:border-gray-600 hover:translate-y-[-2px] cursor-default"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-3xl font-bold text-gradient mb-1">{weekAverage}</div>
          <div className="text-sm text-gray-400">Moyenne/jour</div>
        </motion.div>

        <motion.div
          className="stat-card text-center transition-all duration-200 hover:shadow-lg hover:border-gray-600 hover:translate-y-[-2px] cursor-default"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-3xl font-bold text-gradient mb-1">{bestDay.day}</div>
          <div className="text-sm text-gray-400">Meilleur jour</div>
        </motion.div>
      </div>

      {/* Line Chart - Exercise Evolution */}
      <Suspense
        fallback={
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-gray-700 rounded mb-4"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        }
      >
        <motion.div
          className="bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:border-gray-600 border border-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-lg font-semibold mb-4">Évolution par exercice</h4>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>
      </Suspense>

      {/* Bar Chart - Daily Totals */}
      <Suspense
        fallback={
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-gray-700 rounded mb-4"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        }
      >
        <motion.div
          className="bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:border-gray-600 border border-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-lg font-semibold mb-4">Total par jour</h4>
          <div className="h-64">
            <Bar data={totalChartData} options={chartOptions} />
          </div>
        </motion.div>
      </Suspense>

      {/* Daily Breakdown */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="text-lg font-semibold mb-4">Détail par jour</h4>
        {dayData.map((day, index) => (
          <motion.div
            key={day.date}
            className="bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:border-gray-600 border border-transparent cursor-default"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-lg">{day.day}</span>
              <span className="text-2xl font-bold text-gradient">{day.total}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <span className="text-gray-400">🔥</span>
                <span className="ml-1">{day.burpees}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400">💪</span>
                <span className="ml-1">{day.pushups}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400">🦵</span>
                <span className="ml-1">{day.squats}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
