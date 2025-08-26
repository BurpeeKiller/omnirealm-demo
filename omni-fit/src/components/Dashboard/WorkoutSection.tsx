"use client";

import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer, Activity, Trophy, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExerciseCard } from "@/components/Exercise/ExerciseCard-Simple";

// Mock data pour les exercices de la séance
const mockWorkoutExercises = [
  {
    id: "1",
    name: "Pompes",
    emoji: "💪",
    description: "Exercice de force pour le haut du corps",
    category: "strength",
    difficulty: "medium",
    targetArea: "chest",
    isPremium: false,
    duration: 45,
    restDuration: 15,
    sets: 3,
    reps: 12,
    instructions: [
      "Position de planche",
      "Descendre jusqu'à toucher le sol",
      "Remonter en poussant",
    ],
    tips: ["Gardez le dos droit", "Contrôlez la descente"],
    benefits: ["Renforce les pectoraux", "Améliore la stabilité"],
    muscles: ["Pectoraux", "Triceps", "Deltoïdes"],
    equipment: [],
    basePoints: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Squats",
    emoji: "🦵",
    description: "Exercice fondamental pour les jambes",
    category: "strength",
    difficulty: "easy",
    targetArea: "legs",
    isPremium: false,
    duration: 60,
    restDuration: 20,
    sets: 3,
    reps: 15,
    instructions: [
      "Pieds écartés largeur épaules",
      "Descendre comme pour s'asseoir",
      "Remonter en poussant sur les talons",
    ],
    tips: ["Genoux dans l'axe des pieds", "Regardez devant vous"],
    benefits: ["Renforce les quadriceps", "Améliore l'équilibre"],
    muscles: ["Quadriceps", "Fessiers", "Mollets"],
    equipment: [],
    basePoints: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Planche",
    emoji: "🏋️",
    description: "Exercice de gainage statique",
    category: "strength",
    difficulty: "medium",
    targetArea: "core",
    isPremium: false,
    duration: 30,
    restDuration: 30,
    sets: 3,
    reps: null,
    instructions: [
      "Position pompe mais sur les avant-bras",
      "Corps aligné tête-pieds",
      "Tenir la position",
    ],
    tips: ["Ne pas cambrer le dos", "Serrer les abdos"],
    benefits: ["Renforce le core", "Améliore la posture"],
    muscles: ["Abdominaux", "Dos", "Épaules"],
    equipment: [],
    basePoints: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const WorkoutSection = () => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(mockWorkoutExercises[0]?.duration || 45);
  const [isRestMode, setIsRestMode] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedExercises, setCompletedExercises] = useState(0);

  const totalExercises = mockWorkoutExercises.length;
  const progressPercent = (completedExercises / totalExercises) * 100;

  // Timer logique
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isPlaying) {
      // Temps écoulé
      if (isRestMode) {
        // Fin du repos, passer à l'exercice suivant ou série suivante
        setIsRestMode(false);
        const exercise = mockWorkoutExercises[currentExercise];

        if (currentSet < exercise.sets) {
          // Nouvelle série du même exercice
          setCurrentSet(prev => prev + 1);
          setTimeRemaining(exercise.duration);
        } else {
          // Exercice terminé, passer au suivant
          if (currentExercise < totalExercises - 1) {
            setCompletedExercises(prev => prev + 1);
            setCurrentExercise(prev => prev + 1);
            setCurrentSet(1);
            setTimeRemaining(mockWorkoutExercises[currentExercise + 1].duration);
          } else {
            // Séance terminée
            setIsPlaying(false);
            setCompletedExercises(totalExercises);
          }
        }
      } else {
        // Fin de l'exercice, commencer le repos
        setIsRestMode(true);
        setTimeRemaining(mockWorkoutExercises[currentExercise].restDuration);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining, isRestMode, currentExercise, currentSet, totalExercises]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentExercise(0);
    setCurrentSet(1);
    setIsRestMode(false);
    setTimeRemaining(mockWorkoutExercises[0]?.duration || 45);
    setCompletedExercises(0);
  };

  const handleSkipExercise = () => {
    if (currentExercise < totalExercises - 1) {
      setCompletedExercises(prev => prev + 1);
      setCurrentExercise(prev => prev + 1);
      setCurrentSet(1);
      setIsRestMode(false);
      setTimeRemaining(mockWorkoutExercises[currentExercise + 1].duration);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentExerciseData = mockWorkoutExercises[currentExercise];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2D3436]">Séance d'entraînement</h2>
        <div className="text-sm text-[#636E72]">
          {completedExercises}/{totalExercises} exercices
        </div>
      </div>

      {/* Progress général */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-[#FDCB6E]" />
          <h3 className="text-lg font-semibold text-[#2D3436]">Progression de la séance</h3>
        </div>

        <div className="bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F]"
          />
        </div>

        <div className="flex justify-between text-xs text-[#636E72]">
          <span>{completedExercises} terminés</span>
          <span>{totalExercises - completedExercises} restants</span>
        </div>
      </motion.div>

      {/* Timer principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${
          isRestMode
            ? "bg-gradient-to-r from-[#FFE8CC] to-[#FFF5D6]"
            : "bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF]"
        } rounded-xl p-8 border ${
          isRestMode ? "border-[#FDCB6E]/20" : "border-[#00D9B1]/20"
        } shadow-sm text-center`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Timer className={`w-6 h-6 ${isRestMode ? "text-[#FDCB6E]" : "text-[#00D9B1]"}`} />
          <h3 className="text-lg font-semibold text-[#2D3436]">
            {isRestMode ? "Repos" : currentExerciseData?.name}
          </h3>
        </div>

        <div
          className={`text-6xl font-bold mb-4 ${isRestMode ? "text-[#FDCB6E]" : "text-[#00D9B1]"}`}
        >
          {formatTime(timeRemaining)}
        </div>

        {!isRestMode && (
          <div className="text-sm text-[#636E72] mb-4">
            Série {currentSet}/{currentExerciseData?.sets} •{" "}
            {currentExerciseData?.reps
              ? `${currentExerciseData.reps} répétitions`
              : "Maintenir la position"}
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handlePlayPause}
            size="lg"
            className={`${
              isRestMode
                ? "bg-gradient-to-r from-[#FDCB6E] to-[#E84393] hover:from-[#FDCB6E]/90 hover:to-[#E84393]/90"
                : "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890]"
            } text-white border-0`}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="border-gray-300 text-[#636E72] bg-white hover:bg-gray-50"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>

          {currentExercise < totalExercises - 1 && (
            <Button
              onClick={handleSkipExercise}
              variant="outline"
              size="lg"
              className="border-gray-300 text-[#636E72] bg-white hover:bg-gray-50"
            >
              Suivant
            </Button>
          )}
        </div>
      </motion.div>

      {/* Exercice actuel détails */}
      {!isRestMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-[#74B9FF]" />
            <h3 className="text-lg font-semibold text-[#2D3436]">Instructions</h3>
          </div>

          <div className="space-y-3">
            {currentExerciseData?.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#00D9B1] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-[#2D3436]">{instruction}</p>
              </div>
            ))}
          </div>

          {currentExerciseData?.tips.length > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF] rounded-lg border border-[#00D9B1]/20">
              <h4 className="text-sm font-semibold text-[#2D3436] mb-2">💡 Conseils</h4>
              <div className="space-y-1">
                {currentExerciseData.tips.map((tip, index) => (
                  <p key={index} className="text-xs text-[#636E72]">
                    • {tip}
                  </p>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Liste des exercices à venir */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-[#E17055]" />
          <h3 className="text-lg font-semibold text-[#2D3436]">Programme de la séance</h3>
        </div>

        <div className="space-y-2">
          {mockWorkoutExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                index === currentExercise
                  ? "bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF] border border-[#00D9B1]/30"
                  : index < currentExercise
                    ? "bg-gray-100 opacity-60"
                    : "bg-gray-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index < currentExercise
                    ? "bg-[#00D9B1] text-white"
                    : index === currentExercise
                      ? "bg-[#74B9FF] text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {index < currentExercise ? "✓" : index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{exercise.emoji}</span>
                  <span className="font-medium text-[#2D3436]">{exercise.name}</span>
                  {index === currentExercise && (
                    <span className="text-xs bg-[#00D9B1] text-white px-2 py-0.5 rounded-full">
                      En cours
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#636E72]">
                  {exercise.sets} × {exercise.reps || `${exercise.duration}s`} •{" "}
                  {exercise.duration + exercise.restDuration}s total
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Séance terminée */}
      {completedExercises === totalExercises && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#E6FFF9] to-[#F0F8FF] rounded-xl p-8 border border-[#00D9B1]/20 shadow-sm text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-[#2D3436] mb-2">Séance terminée !</h3>
          <p className="text-[#636E72] mb-6">
            Félicitations ! Vous avez terminé tous les exercices de cette séance.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#00D9B1]">{totalExercises}</div>
              <div className="text-xs text-[#636E72]">Exercices</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#74B9FF]">~15min</div>
              <div className="text-xs text-[#636E72]">Durée</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-[#FDCB6E]">+50</div>
              <div className="text-xs text-[#636E72]">Points</div>
            </div>
          </div>

          <Button
            onClick={handleReset}
            className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white border-0"
          >
            Nouvelle séance
          </Button>
        </motion.div>
      )}
    </div>
  );
};
