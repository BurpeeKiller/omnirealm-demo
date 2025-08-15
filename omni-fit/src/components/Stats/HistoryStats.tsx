import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { getAllTimeStats, getYearStats, exportToCSV, exportToJSON } from '@/db';
import type { DailyStats as DailyStatsType } from '@/types';
import { Download, Award, TrendingUp, FileJson } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/utils/logger';

// Lazy load chart components
const ChartComponents = lazy(() => import('./ChartComponents'));

export const HistoryStats = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState<'year' | 'all'>('year');
  const [allTimeStats, setAllTimeStats] = useState({ burpees: 0, pushups: 0, squats: 0, total: 0 });
  const [yearStats, setYearStats] = useState<DailyStatsType[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [selectedYear, selectedPeriod]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Load all-time stats
      const allTime = await getAllTimeStats();
      setAllTimeStats(allTime);

      // Load year stats if needed
      if (selectedPeriod === 'year') {
        const yearData = await getYearStats(selectedYear);
        setYearStats(yearData);

        // Group by month
        const monthlyTotals = Array.from({ length: 12 }, (_, i) => {
          const month = String(i + 1).padStart(2, '0');
          const monthStats = yearData.filter((s) => s.date.startsWith(`${selectedYear}-${month}`));
          const total = monthStats.reduce((sum, s) => sum + s.total, 0);
          return {
            month: format(new Date(selectedYear, i, 1), 'MMM', { locale: fr }),
            total,
          };
        });
        setMonthlyData(monthlyTotals);
      }
    } catch (error) {
      logger.error('Error loading history stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const csv = await exportToCSV();
      // Ajouter le BOM UTF-8 pour Excel
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `fitness-stats-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
    } catch (error) {
      logger.error('Error exporting CSV:', error);
    }
  };

  const handleExportJSON = async () => {
    try {
      const json = await exportToJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `fitness-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
      link.click();
    } catch (error) {
      logger.error('Error exporting JSON:', error);
    }
  };

  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Chart data
  const doughnutData = {
    labels: ['Burpees', 'Pompes', 'Squats'],
    datasets: [
      {
        data: [allTimeStats.burpees, allTimeStats.pushups, allTimeStats.squats],
        backgroundColor: [
          'rgba(249, 115, 22, 0.5)',
          'rgba(168, 85, 247, 0.5)',
          'rgba(59, 130, 246, 0.5)',
        ],
        borderColor: ['rgba(249, 115, 22, 1)', 'rgba(168, 85, 247, 1)', 'rgba(59, 130, 246, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: monthlyData.map((m) => m.month),
    datasets: [
      {
        label: `Total ${selectedYear}`,
        data: monthlyData.map((m) => m.total),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const [ChartsLoaded, setChartsLoaded] = useState<any>(null);

  // Load charts dynamically when needed
  useEffect(() => {
    import('./ChartComponents').then((module) => {
      setChartsLoaded(module);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === 'year'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Par année
          </button>
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Tout
          </button>
        </div>

        {selectedPeriod === 'year' && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <FileJson className="w-4 h-4" />
          Backup JSON
        </button>
      </div>

      {/* All-time Stats */}
      <motion.div
        className="bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Totaux depuis le début
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient">{allTimeStats.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{allTimeStats.burpees}</div>
            <div className="text-sm text-gray-400">Burpees 🔥</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{allTimeStats.pushups}</div>
            <div className="text-sm text-gray-400">Pompes 💪</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{allTimeStats.squats}</div>
            <div className="text-sm text-gray-400">Squats 🦵</div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <motion.div
          className="bg-gray-800 rounded-xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-lg font-semibold mb-4">Répartition par exercice</h4>
          <div className="h-64">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>}>
              {ChartsLoaded && (
                <ChartsLoaded.Doughnut data={doughnutData} options={ChartsLoaded.getDoughnutChartOptions()} />
              )}
            </Suspense>
          </div>
        </motion.div>

        {/* Line Chart for Year */}
        {selectedPeriod === 'year' && (
          <motion.div
            className="bg-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Évolution {selectedYear}</h4>
            <div className="h-64">
              <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div></div>}>
                {ChartsLoaded && (
                  <ChartsLoaded.Line data={lineData} options={ChartsLoaded.getLineChartOptions()} />
                )}
              </Suspense>
            </div>
          </motion.div>
        )}
      </div>

      {/* Year Summary */}
      {selectedPeriod === 'year' && (
        <motion.div
          className="bg-gray-800 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-lg font-semibold mb-4">Résumé mensuel {selectedYear}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {monthlyData.map((month, index) => (
              <motion.div
                key={month.month}
                className="bg-gray-700/50 rounded-lg p-3 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.02 }}
              >
                <div className="text-sm text-gray-400 mb-1">{month.month}</div>
                <div className="text-xl font-bold text-gradient">{month.total}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Records */}
      <motion.div
        className="bg-gray-800 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Statistiques avancées
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Moyenne quotidienne</span>
            <span className="font-medium">
              {yearStats.length > 0
                ? Math.round(yearStats.reduce((sum, s) => sum + s.total, 0) / yearStats.length)
                : 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Jours d'activité</span>
            <span className="font-medium">{yearStats.filter((s) => s.total > 0).length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Meilleur jour</span>
            <span className="font-medium">
              {yearStats.length > 0 ? Math.max(...yearStats.map((s) => s.total)) : 0}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
