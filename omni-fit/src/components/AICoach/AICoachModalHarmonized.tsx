import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, MessageSquare, Target, Lightbulb, Activity } from 'lucide-react';
import { AIChatLocal } from '@/components/AICoach/AIChatLocal';
import { useState, useEffect } from 'react';
import { useExercisesStore } from '@/stores/exercises.store';
import { analytics } from '@/services/analytics';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AICoachModalHarmonized({ isOpen, onClose }: AICoachModalProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'plans' | 'tips' | 'progress'>('chat');
  const [progressStats, setProgressStats] = useState({
    level: 'Débutant',
    forceProgress: 0,
    enduranceProgress: 0,
    flexibilityProgress: 0,
    weeklyAverage: 0,
    totalExercises: 0,
    currentStreak: 0
  });
  
  const { exercises } = useExercisesStore();

  useEffect(() => {
    const calculateProgress = async () => {
      const weeklyData = await analytics.getWeeklyData();
      const totalToday = exercises.reduce((sum, ex) => sum + ex.count, 0);
      const weeklyTotal = weeklyData.total;
      const dailyAvg = weeklyData.dailyAverage;
      
      // Calcul du niveau basé sur la moyenne quotidienne
      let level = 'Débutant';
      if (dailyAvg >= 300) level = 'Expert';
      else if (dailyAvg >= 200) level = 'Avancé';  
      else if (dailyAvg >= 100) level = 'Intermédiaire';
      
      // Calcul des progressions (comparaison avec semaine précédente)
      const previousWeekAvg = 80; // À implémenter : récupérer vraie moyenne semaine précédente
      const forceIncrease = weeklyData.exercises.pushups > previousWeekAvg ? 
        Math.round(((weeklyData.exercises.pushups - previousWeekAvg) / previousWeekAvg) * 100) : 0;
      const enduranceIncrease = weeklyData.exercises.burpees > previousWeekAvg ?
        Math.round(((weeklyData.exercises.burpees - previousWeekAvg) / previousWeekAvg) * 100) : 0;
      const flexibilityIncrease = weeklyData.exercises.squats > previousWeekAvg ?
        Math.round(((weeklyData.exercises.squats - previousWeekAvg) / previousWeekAvg) * 100) : 0;
      
      setProgressStats({
        level,
        forceProgress: forceIncrease,
        enduranceProgress: enduranceIncrease,
        flexibilityProgress: flexibilityIncrease,
        weeklyAverage: Math.round(dailyAvg),
        totalExercises: weeklyTotal,
        currentStreak: weeklyData.currentStreak
      });
    };
    
    if (isOpen && activeTab === 'progress') {
      calculateProgress();
    }
  }, [isOpen, activeTab, exercises]);

  const tabs = [
    { id: 'chat', label: 'Discussion', icon: MessageSquare },
    { id: 'plans', label: 'Plans', icon: Target },
    { id: 'tips', label: 'Conseils', icon: Lightbulb },
    { id: 'progress', label: 'Analyse', icon: Activity },
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

          {/* Modal comme Stats */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] md:h-auto md:max-h-[90vh] md:inset-x-4 md:inset-y-auto md:top-[5%] md:bottom-[5%] md:max-w-4xl md:mx-auto bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header avec gradient fuchsia */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Brain className="w-8 h-8" />
                  Coach AI
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
              <p className="text-fuchsia-100">Votre assistant fitness personnel</p>
            </div>

            {/* Tabs identiques à Stats */}
            <div className="bg-gray-50 dark:bg-gray-800 px-2 py-2">
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                        font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-white dark:bg-gray-900 text-fuchsia-600 dark:text-fuchsia-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }
                      `}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-fuchsia-600' : ''}`} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <AIChatLocal />
                  </motion.div>
                )}
                {activeTab === 'plans' && (
                  <motion.div
                    key="plans"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto p-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Plans d'entraînement</h3>
                      {[
                        { 
                          name: "Débutant - 2 semaines", 
                          level: "Facile", 
                          duration: "15 min/jour",
                          description: "Parfait pour commencer en douceur",
                          color: "green",
                          exercises: ["10 burpees", "15 pompes", "20 squats"]
                        },
                        { 
                          name: "Intermédiaire - 4 semaines", 
                          level: "Moyen", 
                          duration: "20 min/jour",
                          description: "Pour maintenir votre forme",
                          color: "blue",
                          exercises: ["15 burpees", "25 pompes", "30 squats"]
                        },
                        { 
                          name: "Avancé - 6 semaines", 
                          level: "Difficile", 
                          duration: "30 min/jour",
                          description: "Challenge intense pour experts",
                          color: "purple",
                          exercises: ["20 burpees", "35 pompes", "40 squats"]
                        }
                      ].map((plan, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            alert(`Plan ${plan.name} sélectionné ! Cette fonctionnalité sera bientôt disponible.`);
                          }}
                          className={`bg-white dark:bg-gray-900 p-5 rounded-xl border-2 cursor-pointer transition-all
                            ${plan.color === 'green' ? 'border-green-500 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' : ''}
                            ${plan.color === 'blue' ? 'border-blue-500 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' : ''}
                            ${plan.color === 'purple' ? 'border-purple-500 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20' : ''}
                          `}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{plan.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{plan.description}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium
                              ${plan.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : ''}
                              ${plan.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300' : ''}
                              ${plan.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300' : ''}
                            `}>
                              {plan.level}
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Programme :</span>
                              <ul className="text-xs mt-1 space-y-0.5">
                                {plan.exercises.map((ex, i) => (
                                  <li key={i} className="text-gray-600 dark:text-gray-400">• {ex}</li>
                                ))}
                              </ul>
                            </div>
                            <div className={`font-semibold text-right
                              ${plan.color === 'green' ? 'text-green-600 dark:text-green-400' : ''}
                              ${plan.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                              ${plan.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : ''}
                            `}>
                              {plan.duration}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'tips' && (
                  <motion.div
                    key="tips"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto p-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Conseils du jour</h3>
                      <div className="grid gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💧 Hydratation</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Buvez au moins 500ml d'eau avant et après chaque séance.
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🥗 Nutrition</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Mangez des protéines dans les 30 minutes après l'effort.
                          </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">😴 Récupération</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            7-9 heures de sommeil sont essentielles pour progresser.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'progress' && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto p-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Analyse de progression</h3>
                      <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                        <h4 className="font-medium mb-2">Votre niveau actuel</h4>
                        <div className="text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-2">
                          {progressStats.level}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Basé sur vos performances des 7 derniers jours
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Moyenne/jour :</span>
                            <span className="font-semibold ml-1">{progressStats.weeklyAverage} ex.</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Total semaine :</span>
                            <span className="font-semibold ml-1">{progressStats.totalExercises} ex.</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-600 dark:text-gray-400">Série actuelle :</span>
                            <span className="font-semibold ml-1 text-orange-600">{progressStats.currentStreak} jours 🔥</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl text-center">
                          <div className={`text-2xl font-bold ${progressStats.forceProgress > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {progressStats.forceProgress > 0 ? '+' : ''}{progressStats.forceProgress}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Force</div>
                          <div className="text-xs text-gray-500 mt-1">(Pompes)</div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl text-center">
                          <div className={`text-2xl font-bold ${progressStats.enduranceProgress > 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                            {progressStats.enduranceProgress > 0 ? '+' : ''}{progressStats.enduranceProgress}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Endurance</div>
                          <div className="text-xs text-gray-500 mt-1">(Burpees)</div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl text-center">
                          <div className={`text-2xl font-bold ${progressStats.flexibilityProgress > 0 ? 'text-purple-600' : 'text-gray-600'}`}>
                            {progressStats.flexibilityProgress > 0 ? '+' : ''}{progressStats.flexibilityProgress}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Flexibilité</div>
                          <div className="text-xs text-gray-500 mt-1">(Squats)</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer avec stats rapides */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-fuchsia-600">AI</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Coach personnel</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-green-600">24/7</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Disponible</p>
                </div>
                <div className="border-l border-gray-200 dark:border-gray-700"></div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">100%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Personnalisé</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}