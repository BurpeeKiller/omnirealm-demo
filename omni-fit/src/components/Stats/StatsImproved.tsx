import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Calendar, BarChart3, History, Brain } from 'lucide-react';
import { DailyStats } from './DailyStats';
import { WeeklyStats } from './WeeklyStats';
import { HistoryStats } from './HistoryStats';
import { AnalyticsView } from '@/components/Analytics';

interface StatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsImproved = ({ isOpen, onClose }: StatsProps) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'history' | 'analytics'>('daily');

  const tabs = [
    { id: 'daily', label: 'Aujourd\'hui', icon: Calendar },
    { id: 'weekly', label: 'Semaine', icon: BarChart3 },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'analytics', label: 'Analyse', icon: Brain },
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
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal optimisé pour mobile */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] md:h-auto md:max-h-[90vh] md:inset-x-4 md:inset-y-auto md:top-[5%] md:bottom-[5%] md:max-w-4xl md:mx-auto bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <TrendingUp className="w-8 h-8" />
                  Statistiques
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
              <p className="text-purple-100">Suivez vos progrès et restez motivé</p>
            </div>

            {/* Tabs avec design moderne */}
            <div className="bg-gray-50 dark:bg-gray-800 px-2 py-2">
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                        font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content avec animations fluides */}
            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800">
              <AnimatePresence mode="wait">
                {activeTab === 'daily' && (
                  <motion.div
                    key="daily"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto"
                  >
                    <div className="modal-content">
                      <DailyStats />
                    </div>
                  </motion.div>
                )}
                {activeTab === 'weekly' && (
                  <motion.div
                    key="weekly"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto"
                  >
                    <div className="modal-content">
                      <WeeklyStats />
                    </div>
                  </motion.div>
                )}
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto"
                  >
                    <div className="modal-content">
                      <HistoryStats />
                    </div>
                  </motion.div>
                )}
                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto"
                  >
                    <div className="modal-content">
                      <AnalyticsView />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer avec résumé rapide */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Exercices aujourd'hui</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-green-600">7</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Jours consécutifs</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">84</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total cette semaine</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};