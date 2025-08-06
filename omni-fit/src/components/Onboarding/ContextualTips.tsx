import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Timer, Target, TrendingUp } from 'lucide-react';
import { useProgressiveOnboarding } from '@/hooks/useProgressiveOnboarding';

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  trigger: 'firstExercise' | 'afterMinute' | 'threeExercises' | 'firstStreak';
  color: string;
}

const tips: Tip[] = [
  {
    id: 'first-exercise',
    title: 'Bien joué !',
    description: 'Votre premier exercice est terminé. Continuez comme ça !',
    icon: <Target className="w-5 h-5" />,
    trigger: 'firstExercise',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'consistency',
    title: 'Restez régulier',
    description:
      "Faire quelques exercices chaque heure est plus efficace qu'une session intensive.",
    icon: <Timer className="w-5 h-5" />,
    trigger: 'afterMinute',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'progress',
    title: 'Suivi des progrès',
    description: "Vos statistiques se trouvent en bas de l'écran. Consultez-les régulièrement !",
    icon: <TrendingUp className="w-5 h-5" />,
    trigger: 'threeExercises',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'streak',
    title: 'Série en cours !',
    description: 'Excellent ! Vous avez commencé une série. Essayez de la maintenir.',
    icon: <Lightbulb className="w-5 h-5" />,
    trigger: 'firstStreak',
    color: 'from-orange-500 to-orange-600',
  },
];

export const ContextualTips = () => {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [shownTips, setShownTips] = useState<string[]>([]);
  const { hasCompletedStep } = useProgressiveOnboarding();

  // Charger les tips déjà montrés
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fitness-reminder-tips');
      if (saved) {
        setShownTips(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load tips state:', error);
    }
  }, []);

  const showTip = (tipId: string) => {
    const tip = tips.find((t) => t.id === tipId);
    if (tip && !shownTips.includes(tipId)) {
      setCurrentTip(tip);
      // Marquer comme montré
      const newShownTips = [...shownTips, tipId];
      setShownTips(newShownTips);
      localStorage.setItem('fitness-reminder-tips', JSON.stringify(newShownTips));
    }
  };

  const closeTip = () => {
    setCurrentTip(null);
  };

  // Exposer la fonction pour l'utiliser depuis l'extérieur
  useEffect(() => {
    // @ts-ignore
    window.showContextualTip = showTip;
  }, [shownTips]);

  // Auto-close après 5 secondes
  useEffect(() => {
    if (currentTip) {
      const timer = setTimeout(() => {
        closeTip();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentTip]);

  return (
    <AnimatePresence>
      {currentTip && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-20 left-4 right-4 z-30 mx-auto max-w-sm"
        >
          <div
            className={`bg-gradient-to-r ${currentTip.color} p-4 rounded-lg shadow-lg text-white relative`}
          >
            {/* Bouton fermer */}
            <button
              onClick={closeTip}
              className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Contenu */}
            <div className="flex items-start gap-3 pr-8">
              <div className="flex-shrink-0 mt-0.5">{currentTip.icon}</div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{currentTip.title}</h3>
                <p className="text-sm opacity-90">{currentTip.description}</p>
              </div>
            </div>

            {/* Barre de progression auto-close */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
