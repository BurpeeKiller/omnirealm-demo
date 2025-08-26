"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  Trophy,
  Heart,
  Timer,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";
import { ProgramDefinition, ProgramExercise } from "@/data/programs";
import { getExerciseById } from "@/data/exercises";
import { cn } from "@/lib/utils";

type TimerState = "idle" | "running" | "paused" | "rest" | "completed";
type WorkoutPhase = "warmup" | "workout" | "cooldown" | "finished";

interface WorkoutTimerProps {
  program: ProgramDefinition;
  onComplete?: (stats: WorkoutStats) => void;
  onExit?: () => void;
  autoStart?: boolean;
  className?: string;
}

interface WorkoutStats {
  totalTime: number;
  exercisesCompleted: number;
  totalExercises: number;
  caloriesBurned: number;
  averageHeartRate?: number;
  completionPercentage: number;
}

interface TimerSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  voiceCountdown: boolean;
  autoRest: boolean;
  customRestTime?: number;
}

// Composant cercle de progression Apple Watch style
const CircularProgress: React.FC<{
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}> = ({ progress, size, strokeWidth, color, backgroundColor = "#374151", children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
};

// Hook pour la gestion du timer
const useWorkoutTimer = (initialTime: number, onComplete?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    }
  }, [isRunning, timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  }, [initialTime]);

  const skip = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, onComplete]);

  const progress = initialTime > 0 ? (initialTime - timeLeft) / initialTime : 0;

  return {
    timeLeft,
    isRunning,
    progress,
    start,
    pause,
    reset,
    skip,
  };
};

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  program,
  onComplete,
  onExit,
  autoStart = false,
  className,
}) => {
  // États principaux
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [workoutPhase, setWorkoutPhase] = useState<WorkoutPhase>("workout");
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [settings, setSettings] = useState<TimerSettings>({
    soundEnabled: true,
    vibrationEnabled: true,
    voiceCountdown: false,
    autoRest: true,
  });

  // Statistiques du workout
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    totalTime: 0,
    exercisesCompleted: 0,
    totalExercises: program.exercises.length,
    caloriesBurned: 0,
    completionPercentage: 0,
  });

  const [startTime, setStartTime] = useState<Date | null>(null);

  // Exercice courant
  const currentProgramExercise = program.exercises[currentExerciseIndex];
  const currentExercise = currentProgramExercise
    ? getExerciseById(currentProgramExercise.exerciseId)
    : null;

  // Calcul du temps pour le timer
  const getTimerDuration = (): number => {
    if (timerState === "rest") {
      return currentSetIndex < (currentProgramExercise?.sets || 1) - 1
        ? currentProgramExercise?.restBetweenSets || 30
        : currentProgramExercise?.restAfterExercise || 45;
    }

    return currentProgramExercise?.duration || 30;
  };

  // Timer principal
  const timer = useWorkoutTimer(getTimerDuration(), () => {
    handleTimerComplete();
  });

  // Gestion de l'autostart
  useEffect(() => {
    if (autoStart && timerState === "idle") {
      setStartTime(new Date());
      setTimerState("running");
      timer.start();
    }
  }, [autoStart, timerState, timer]);

  // Calcul des statistiques en temps réel
  useEffect(() => {
    if (startTime) {
      const elapsed = (new Date().getTime() - startTime.getTime()) / 1000 / 60; // minutes
      const progress = currentExerciseIndex / program.exercises.length;
      const estimatedCalories = elapsed * (program.totalCalories / program.estimatedMinutes);

      setWorkoutStats(prev => ({
        ...prev,
        totalTime: elapsed,
        caloriesBurned: Math.round(estimatedCalories),
        completionPercentage: Math.round(progress * 100),
      }));
    }
  }, [currentExerciseIndex, startTime, program]);

  // Gestion de la completion du timer
  const handleTimerComplete = useCallback(() => {
    playSound("complete");
    triggerVibration([100, 50, 100]);

    if (timerState === "rest") {
      // Fin du repos, passer à l'exercice suivant ou la série suivante
      setTimerState("running");
      timer.reset();
      timer.start();
    } else {
      // Fin d'une série
      if (currentSetIndex < (currentProgramExercise?.sets || 1) - 1) {
        // Encore des séries à faire
        setCurrentSetIndex(prev => prev + 1);
        setTimerState("rest");
        timer.reset();
        if (settings.autoRest) {
          timer.start();
        }
      } else {
        // Exercice terminé
        setWorkoutStats(prev => ({
          ...prev,
          exercisesCompleted: prev.exercisesCompleted + 1,
        }));

        if (currentExerciseIndex < program.exercises.length - 1) {
          // Passer à l'exercice suivant
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSetIndex(0);
          setTimerState("rest");
          timer.reset();
          if (settings.autoRest) {
            timer.start();
          }
        } else {
          // Workout terminé !
          handleWorkoutComplete();
        }
      }
    }
  }, [
    timerState,
    currentSetIndex,
    currentExerciseIndex,
    currentProgramExercise,
    program.exercises.length,
    settings.autoRest,
    timer,
  ]);

  // Finalisation du workout
  const handleWorkoutComplete = () => {
    setTimerState("completed");
    setWorkoutPhase("finished");

    const finalStats: WorkoutStats = {
      ...workoutStats,
      totalTime: startTime ? (new Date().getTime() - startTime.getTime()) / 1000 / 60 : 0,
      completionPercentage: 100,
    };

    playSound("victory");
    triggerVibration([100, 100, 100, 100, 200]);
    onComplete?.(finalStats);
  };

  // Contrôles du timer
  const handlePlay = () => {
    if (timerState === "idle" || timerState === "paused") {
      if (!startTime) setStartTime(new Date());
      setTimerState("running");
      timer.start();
      playSound("start");
    }
  };

  const handlePause = () => {
    setTimerState("paused");
    timer.pause();
    playSound("pause");
  };

  const handleReset = () => {
    setTimerState("idle");
    setCurrentExerciseIndex(0);
    setCurrentSetIndex(0);
    setStartTime(null);
    timer.reset();
  };

  const handleSkip = () => {
    timer.skip();
    triggerVibration([50]);
  };

  // Feedback audio et haptique
  const playSound = (type: "start" | "pause" | "complete" | "victory") => {
    if (!settings.soundEnabled) return;
    // Implémentation des sons
    console.log(`🔊 Playing ${type} sound`);
  };

  const triggerVibration = (pattern: number[]) => {
    if (!settings.vibrationEnabled || !navigator.vibrate) return;
    navigator.vibrate(pattern);
  };

  // Interface de formatage du temps
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 mb-2">❌</div>
          <p className="text-gray-400">Exercice introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
        "border border-gray-700 rounded-3xl p-6 lg:p-8",
        "max-w-md mx-auto",
        className
      )}
    >
      {/* Header avec infos du programme */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">{program.name}</h2>
          <p className="text-sm text-gray-400">
            {currentExerciseIndex + 1} / {program.exercises.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
            >
              <Square className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Exercice actuel */}
      <div className="text-center mb-8">
        <motion.div
          key={currentExercise.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl mb-4 select-none"
        >
          {currentExercise.icon}
        </motion.div>

        <h3 className="text-xl font-semibold text-white mb-2">{currentExercise.name}</h3>

        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            Série {currentSetIndex + 1}/{currentProgramExercise.sets}
          </span>

          {timerState === "rest" && (
            <span className="flex items-center gap-1 text-blue-400">
              <Timer className="w-3 h-3" />
              Repos
            </span>
          )}
        </div>
      </div>

      {/* Timer circulaire principal */}
      <div className="flex justify-center mb-8">
        <CircularProgress
          progress={timer.progress}
          size={240}
          strokeWidth={12}
          color={timerState === "rest" ? "#3B82F6" : program.color}
          backgroundColor="#374151"
        >
          <div className="text-center">
            <motion.div
              key={timer.timeLeft}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={cn(
                "text-4xl font-mono font-bold",
                timerState === "rest" ? "text-blue-400" : "text-white"
              )}
            >
              {formatTime(timer.timeLeft)}
            </motion.div>

            <div className="text-sm text-gray-400 mt-2">
              {timerState === "rest"
                ? "Repos"
                : currentProgramExercise.reps
                  ? `${currentProgramExercise.reps} reps`
                  : "Temps"}
            </div>
          </div>
        </CircularProgress>
      </div>

      {/* Contrôles principaux */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {timerState === "running" ? (
          <motion.button
            onClick={handlePause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-16 h-16 bg-orange-500 hover:bg-orange-400 rounded-full text-white"
          >
            <Pause className="w-8 h-8" />
          </motion.button>
        ) : (
          <motion.button
            onClick={handlePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full text-white"
          >
            <Play className="w-8 h-8 ml-1" />
          </motion.button>
        )}

        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          onClick={handleSkip}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
        >
          <SkipForward className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{workoutStats.exercisesCompleted}</div>
          <div className="text-xs text-gray-400">Exercices</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(workoutStats.totalTime)}m
          </div>
          <div className="text-xs text-gray-400">Temps</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{workoutStats.caloriesBurned}</div>
          <div className="text-xs text-gray-400">Cal</div>
        </div>
      </div>

      {/* Indicateur de progression général */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Progression</span>
          <span>{workoutStats.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${workoutStats.completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Modal de fin de workout */}
      <AnimatePresence>
        {timerState === "completed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 rounded-3xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-white p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>

              <h3 className="text-2xl font-bold mb-4">Félicitations !</h3>

              <p className="text-gray-300 mb-6">Tu as terminé "{program.name}" !</p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {Math.round(workoutStats.totalTime)}m
                  </div>
                  <div className="text-xs text-gray-400">Durée</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">
                    {workoutStats.caloriesBurned}
                  </div>
                  <div className="text-xs text-gray-400">Calories</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{program.basePoints}</div>
                  <div className="text-xs text-gray-400">Points</div>
                </div>
              </div>

              <button
                onClick={() => onExit?.()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-white font-medium hover:shadow-lg transition-all"
              >
                Continuer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutTimer;
