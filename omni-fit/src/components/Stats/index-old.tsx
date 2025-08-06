import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { DailyStats } from './DailyStats';
import { WeeklyStats } from './WeeklyStats';
import { HistoryStats } from './HistoryStats';
import { AnalyticsView } from '@/components/Analytics';

interface StatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Stats = ({ isOpen, onClose }: StatsProps) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'history' | 'analytics'>('daily');

  const tabs = [
    { id: 'daily', label: 'Jour', icon: '📅' },
    { id: 'weekly', label: 'Semaine', icon: '📊' },
    { id: 'history', label: 'Historique', icon: '📈' },
    { id: 'analytics', label: 'Analytics', icon: '🔍' },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-16 bottom-4 md:inset-x-auto md:inset-y-[5%] md:left-1/2 md:right-auto md:w-full md:max-w-3xl md:-translate-x-1/2 bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[calc(100vh-5rem)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-gradient flex items-center gap-2">
                <TrendingUp className="w-7 h-7" />
                Statistiques
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-primary-400 border-b-2 border-primary-400 bg-gray-700/30'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'daily' && (
                  <motion.div
                    key="daily"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <DailyStats />
                  </motion.div>
                )}
                {activeTab === 'weekly' && (
                  <motion.div
                    key="weekly"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <WeeklyStats />
                  </motion.div>
                )}
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <HistoryStats />
                  </motion.div>
                )}
                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6"
                  >
                    <AnalyticsView />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
