import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, BarChart3, History, Brain, Lock } from 'lucide-react';
import { DailyStats } from './DailyStats';
import { WeeklyStats } from './WeeklyStats';
import { HistoryStats } from './HistoryStats';
import { AnalyticsView } from '@/components/Analytics';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { lazy, Suspense } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@/components/ui/adaptive-dialog';
import { DialogTabs } from '@/components/ui/dialog-tabs';

const UpgradePrompt = lazy(() => import('@/components/Premium').then(module => ({ default: module.UpgradePrompt })));

interface StatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Stats = ({ isOpen, onClose }: StatsProps) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'history' | 'analytics'>('daily');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { isPremium } = useSubscription();
  const { isPremium: isPremiumAuth } = useAuth();
  const isReallyPremium = isPremium || isPremiumAuth;

  const tabs = [
    { id: 'daily', label: 'Aujourd\'hui', icon: Calendar, premium: false },
    { id: 'weekly', label: 'Semaine', icon: BarChart3, premium: false },
    { id: 'history', label: 'Historique', icon: History, premium: false },
    { id: 'analytics', label: 'Analyse', icon: Brain, premium: true },
  ] as const;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent hideCloseButton>
          <DialogHeader
            gradient="from-purple-600 to-pink-600"
            icon={<TrendingUp className="w-8 h-8 text-white" />}
            subtitle="Suivez vos progrès et restez motivé"
          >
            Statistiques
          </DialogHeader>

          <DialogTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => {
              const tabInfo = tabs.find(t => t.id === tab);
              if (tabInfo?.premium && !isReallyPremium) {
                setShowUpgradePrompt(true);
              } else {
                setActiveTab(tab as any);
              }
            }}
            isPremium={isReallyPremium}
            activeColor="purple"
          />

          <DialogBody>
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
          </DialogBody>

          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upgrade Prompt Modal */}
      <Suspense fallback={null}>
        <UpgradePrompt 
          isOpen={showUpgradePrompt} 
          onClose={() => setShowUpgradePrompt(false)}
          feature="les analytics avancées"
        />
      </Suspense>
    </>
  );
};