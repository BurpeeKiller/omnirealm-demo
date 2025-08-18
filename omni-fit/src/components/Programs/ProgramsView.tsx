import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Trophy, Flame, Heart, Timer, Calendar,
  ChevronRight, Lock, Play, Check
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useExercisesStore } from '@/stores/exercises.store';
import { analytics } from '@/services/analytics';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  icon: typeof Zap;
  color: string;
  exercises: Array<{
    type: string;
    sets: number;
    reps: number;
    rest: number;
  }>;
  benefits: string[];
  isPremium: boolean;
}

const programs: Program[] = [
  {
    id: 'quick-burn',
    name: 'Brûleur Express',
    description: 'Entraînement intensif pour brûler des calories rapidement',
    duration: '7 min',
    difficulty: 'débutant',
    icon: Flame,
    color: 'from-orange-500 to-red-500',
    exercises: [
      { type: 'jumping-jacks', sets: 3, reps: 20, rest: 15 },
      { type: 'push-ups', sets: 3, reps: 10, rest: 20 },
      { type: 'squats', sets: 3, reps: 15, rest: 15 }
    ],
    benefits: ['Brûle des calories', 'Améliore le cardio', 'Tonifie le corps'],
    isPremium: false
  },
  {
    id: 'strength-builder',
    name: 'Force & Muscle',
    description: 'Développez votre force et votre masse musculaire',
    duration: '15 min',
    difficulty: 'intermédiaire',
    icon: Trophy,
    color: 'from-purple-500 to-indigo-500',
    exercises: [
      { type: 'push-ups', sets: 4, reps: 15, rest: 30 },
      { type: 'plank', sets: 3, reps: 45, rest: 20 },
      { type: 'lunges', sets: 4, reps: 12, rest: 25 },
      { type: 'push-ups', sets: 3, reps: 12, rest: 30 }
    ],
    benefits: ['Augmente la force', 'Développe les muscles', 'Améliore la posture'],
    isPremium: true
  },
  {
    id: 'cardio-blast',
    name: 'Cardio Intense',
    description: 'Boostez votre endurance cardiovasculaire',
    duration: '20 min',
    difficulty: 'avancé',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    exercises: [
      { type: 'jumping-jacks', sets: 5, reps: 30, rest: 15 },
      { type: 'squats', sets: 4, reps: 20, rest: 20 },
      { type: 'lunges', sets: 4, reps: 15, rest: 20 },
      { type: 'jumping-jacks', sets: 3, reps: 25, rest: 15 }
    ],
    benefits: ['Améliore l\'endurance', 'Renforce le cœur', 'Brûle les graisses'],
    isPremium: true
  },
  {
    id: 'morning-routine',
    name: 'Routine Matinale',
    description: 'Réveillez votre corps en douceur',
    duration: '10 min',
    difficulty: 'débutant',
    icon: Zap,
    color: 'from-yellow-400 to-orange-400',
    exercises: [
      { type: 'squats', sets: 2, reps: 10, rest: 20 },
      { type: 'plank', sets: 2, reps: 30, rest: 15 },
      { type: 'lunges', sets: 2, reps: 8, rest: 20 }
    ],
    benefits: ['Réveille le corps', 'Améliore la flexibilité', 'Boost d\'énergie'],
    isPremium: true
  },
  {
    id: 'hiit-challenge',
    name: 'HIIT Challenge',
    description: 'Entraînement par intervalles haute intensité',
    duration: '25 min',
    difficulty: 'avancé',
    icon: Timer,
    color: 'from-green-500 to-teal-500',
    exercises: [
      { type: 'jumping-jacks', sets: 6, reps: 40, rest: 10 },
      { type: 'push-ups', sets: 5, reps: 20, rest: 15 },
      { type: 'squats', sets: 5, reps: 25, rest: 10 },
      { type: 'plank', sets: 4, reps: 60, rest: 20 }
    ],
    benefits: ['Maximise la combustion', 'Augmente le métabolisme', 'Résultats rapides'],
    isPremium: true
  }
];

export function ProgramsView() {
  const { isPremium } = useSubscription();
  const { startProgram, activeProgram } = useExercisesStore();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleStartProgram = (program: Program) => {
    if (program.isPremium && !isPremium) {
      // Ne rien faire, le bouton est désactivé
      return;
    }

    analytics.trackEvent('program_started', {
      program_id: program.id,
      program_name: program.name,
      difficulty: program.difficulty
    });

    startProgram({
      id: program.id,
      name: program.name,
      exercises: program.exercises
    });
    
    setSelectedProgram(program);
  };

  const getDifficultyColor = (difficulty: Program['difficulty']) => {
    switch (difficulty) {
      case 'débutant': return 'text-green-400 bg-green-900/30';
      case 'intermédiaire': return 'text-yellow-400 bg-yellow-900/30';
      case 'avancé': return 'text-red-400 bg-red-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Programmes d'Entraînement
        </h2>
        <p className="text-gray-400">
          Suivez des programmes structurés pour atteindre vos objectifs
        </p>
      </div>

      {/* Programme actif */}
      {activeProgram && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-700/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Play className="w-5 h-5" />
                Programme en cours
              </h3>
              <p className="text-purple-300">{activeProgram.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Progression</p>
              <p className="text-xl font-bold text-white">
                {activeProgram.completedExercises}/{activeProgram.exercises.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Liste des programmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((program, index) => {
          const Icon = program.icon;
          const isLocked = program.isPremium && !isPremium;
          
          return (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative bg-gray-800 rounded-lg p-6 
                ${isLocked ? 'opacity-70' : 'hover:bg-gray-750 cursor-pointer'}
                transition-all duration-200
              `}
              onClick={() => !isLocked && setSelectedProgram(program)}
            >
              {/* Badge Premium */}
              {isLocked && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-5 h-5 text-yellow-500" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${program.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {program.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {program.description}
                  </p>
                </div>
              </div>

              {/* Infos */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">{program.duration}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
                  {program.difficulty}
                </div>
              </div>

              {/* Bénéfices */}
              <div className="space-y-1 mb-4">
                {program.benefits.slice(0, 2).map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-gray-400">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartProgram(program);
                }}
                disabled={isLocked}
                className={`
                  w-full py-2 rounded-lg font-medium transition-all duration-200
                  ${isLocked 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r ' + program.color + ' text-white hover:opacity-90'
                  }
                `}
              >
                {isLocked ? 'Premium requis' : 'Commencer'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Modal détails programme */}
      <AnimatePresence>
        {selectedProgram && !activeProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {selectedProgram.name}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Exercices</h4>
                  <div className="space-y-2">
                    {selectedProgram.exercises.map((exercise, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 capitalize">
                          {exercise.type.replace('-', ' ')}
                        </span>
                        <span className="text-gray-500">
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Bénéfices</h4>
                  <ul className="space-y-1">
                    {selectedProgram.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleStartProgram(selectedProgram);
                    setSelectedProgram(null);
                  }}
                  className={`flex-1 py-3 bg-gradient-to-r ${selectedProgram.color} text-white rounded-lg font-medium`}
                >
                  Démarrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}