"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  Target,
  Trophy,
  Star,
  Lock,
  ArrowLeft,
  Filter,
  Search,
  Zap,
  Heart,
} from "lucide-react";
import {
  ProgramDefinition,
  ALL_PROGRAMS,
  ProgramCategory,
  canAccessProgram,
} from "@/data/programs";
import { WorkoutTimer } from "./WorkoutTimer";
import { useSettingsStore } from "@/stores/settings.store";
import { cn } from "@/lib/utils";

type ViewMode = "programs" | "workout" | "complete";

interface WorkoutViewProps {
  onBack?: () => void;
  className?: string;
}

interface WorkoutStats {
  totalTime: number;
  exercisesCompleted: number;
  totalExercises: number;
  caloriesBurned: number;
  completionPercentage: number;
}

// Composant carte de programme
const ProgramCard: React.FC<{
  program: ProgramDefinition;
  onSelect: (program: ProgramDefinition) => void;
  userLevel?: number;
  completedPrograms?: string[];
  totalWorkouts?: number;
}> = ({ program, onSelect, userLevel = 1, completedPrograms = [], totalWorkouts = 0 }) => {
  // TODO: Intégrer le système utilisateur
  const user = null;
  const hasAccess = !program.isPremium || false;
  const canAccess = canAccessProgram(program, userLevel, completedPrograms, totalWorkouts);
  const isLocked = program.isPremium && !hasAccess;
  const isRestricted = !canAccess;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "text-blue-400";
      case "moderate":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "extreme":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isLocked && !isRestricted ? { scale: 1.02, y: -4 } : {}}
      className={cn(
        "relative bg-white/80 backdrop-blur-md",
        "border border-gray-200 shadow-sm rounded-2xl p-6 cursor-pointer",
        "hover:shadow-md transition-all duration-300",
        (isLocked || isRestricted) && "opacity-70 cursor-not-allowed"
      )}
      onClick={() => {
        if (!isLocked && !isRestricted) {
          onSelect(program);
        } else if (isLocked) {
          // Trigger upgrade modal
          const event = new CustomEvent("show-upgrade-prompt", {
            detail: { reason: "program_locked", feature: program.name },
          });
          window.dispatchEvent(event);
        }
      }}
    >
      {/* Badge Premium */}
      {program.isPremium && (
        <div className="absolute -top-2 -right-2 z-10">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              isLocked ? "bg-gray-600" : "bg-gradient-to-r from-yellow-400 to-orange-500"
            )}
          >
            {isLocked ? (
              <Lock className="w-4 h-4 text-white" />
            ) : (
              <Trophy className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
      )}

      {/* Glow effect pour premium */}
      {program.isPremium && !isLocked && (
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-orange-500/10 blur-xl" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-3xl mb-2">{program.emoji}</div>
          <h3 className="text-lg font-bold text-white mb-1">{program.name}</h3>
          <p className="text-sm text-blue-400 font-medium">{program.tagline}</p>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < Math.floor(program.averageRating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-600"
              )}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({program.reviewCount})</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{program.description}</p>

      {/* Métadonnées */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">{program.estimatedMinutes} min</span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className={cn("w-4 h-4", getIntensityColor(program.intensity))} />
          <span className="text-gray-300 capitalize">{program.intensity}</span>
        </div>

        <div className="flex items-center gap-2">
          <Target className={cn("w-4 h-4", getDifficultyColor(program.difficulty))} />
          <span className="text-gray-300 capitalize">{program.difficulty}</span>
        </div>

        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-gray-300">{program.totalCalories} cal</span>
        </div>
      </div>

      {/* Barre de progression de succès */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Taux de réussite</span>
          <span>{program.successRate}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full"
            style={{ width: `${program.successRate}%` }}
          />
        </div>
      </div>

      {/* Bouton d'action */}
      <button
        className={cn(
          "w-full py-3 rounded-xl font-medium transition-all duration-200",
          "flex items-center justify-center gap-2",
          isLocked
            ? "bg-gray-700 text-gray-400"
            : isRestricted
              ? "bg-gray-700 text-gray-400"
              : `bg-gradient-to-r ${program.gradient} text-white hover:shadow-lg`
        )}
        disabled={isLocked || isRestricted}
      >
        {isLocked ? (
          <>
            <Lock className="w-4 h-4" />
            <span>Premium requis</span>
          </>
        ) : isRestricted ? (
          <>
            <Target className="w-4 h-4" />
            <span>Niveau {program.unlockRequirements?.minLevel || 1} requis</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Commencer</span>
          </>
        )}
      </button>

      {/* Objectifs débloquables */}
      {program.unlockRequirements && !isRestricted && (
        <div className="mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Débloque: {program.completionBadge}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Composant principal
export const WorkoutView: React.FC<WorkoutViewProps> = ({ onBack, className }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("programs");
  const [selectedProgram, setSelectedProgram] = useState<ProgramDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory | "all">("all");
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);

  // Filtrage des programmes
  const filteredPrograms = ALL_PROGRAMS.filter(program => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Gestionnaires d'événements
  const handleProgramSelect = useCallback((program: ProgramDefinition) => {
    setSelectedProgram(program);
    setViewMode("workout");
  }, []);

  const handleWorkoutComplete = useCallback((stats: WorkoutStats) => {
    setWorkoutStats(stats);
    setViewMode("complete");

    // Ici on pourrait enregistrer les stats dans le store
    console.log("Workout completed:", stats);
  }, []);

  const handleWorkoutExit = useCallback(() => {
    setSelectedProgram(null);
    setViewMode("programs");
  }, []);

  const handleCompleteClose = useCallback(() => {
    setWorkoutStats(null);
    setSelectedProgram(null);
    setViewMode("programs");
  }, []);

  const categories: Array<{ value: ProgramCategory | "all"; label: string; emoji: string }> = [
    { value: "all", label: "Tous", emoji: "🌟" },
    { value: "beginner", label: "Débutant", emoji: "🌱" },
    { value: "strength", label: "Force", emoji: "💪" },
    { value: "cardio", label: "Cardio", emoji: "❤️" },
    { value: "flexibility", label: "Souplesse", emoji: "🧘‍♂️" },
    { value: "hiit", label: "HIIT", emoji: "🔥" },
    { value: "endurance", label: "Endurance", emoji: "🏃‍♂️" },
    { value: "recovery", label: "Récupération", emoji: "🌙" },
  ];

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {/* Vue des programmes */}
        {viewMode === "programs" && (
          <motion.div
            key="programs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="container mx-auto px-4 py-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Programmes d'Entraînement</h1>
                <p className="text-gray-400">
                  Choisis ton programme et commence ton transformation
                </p>
              </div>

              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
              )}
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Barre de recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un programme..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Filtre par catégorie */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all",
                      selectedCategory === category.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    )}
                  >
                    <span>{category.emoji}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">{filteredPrograms.length}</div>
                <div className="text-sm text-gray-400">Programmes</div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">
                  {filteredPrograms.filter(p => !p.isPremium).length}
                </div>
                <div className="text-sm text-gray-400">Gratuits</div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {filteredPrograms.filter(p => p.isPremium).length}
                </div>
                <div className="text-sm text-gray-400">Premium</div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(
                    (filteredPrograms.reduce((acc, p) => acc + p.averageRating, 0) /
                      filteredPrograms.length) *
                      10
                  ) / 10 || 0}
                </div>
                <div className="text-sm text-gray-400">Note moy.</div>
              </div>
            </div>

            {/* Grille des programmes */}
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProgramCard
                      program={program}
                      onSelect={handleProgramSelect}
                      userLevel={1} // À récupérer depuis le store
                      completedPrograms={[]} // À récupérer depuis le store
                      totalWorkouts={0} // À récupérer depuis le store
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Aucun programme trouvé</h3>
                <p className="text-gray-400">Essaie de modifier tes critères de recherche</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Vue workout */}
        {viewMode === "workout" && selectedProgram && (
          <motion.div
            key="workout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <WorkoutTimer
              program={selectedProgram}
              onComplete={handleWorkoutComplete}
              onExit={handleWorkoutExit}
              autoStart={true}
            />
          </motion.div>
        )}

        {/* Vue de completion */}
        {viewMode === "complete" && workoutStats && selectedProgram && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center justify-center min-h-screen p-4"
          >
            <div className="max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-8xl mb-6"
              >
                🏆
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">Bravo Champion !</h2>

              <p className="text-gray-300 mb-8">
                Tu as terminé "
                <span className="font-semibold text-blue-400">{selectedProgram.name}</span>" avec
                brio !
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(workoutStats.totalTime)}m
                  </div>
                  <div className="text-sm text-gray-400">Durée</div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-yellow-400">
                    {workoutStats.caloriesBurned}
                  </div>
                  <div className="text-sm text-gray-400">Calories</div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {workoutStats.exercisesCompleted}
                  </div>
                  <div className="text-sm text-gray-400">Exercices</div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedProgram.basePoints}
                  </div>
                  <div className="text-sm text-gray-400">Points</div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCompleteClose}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white font-medium hover:shadow-lg transition-all"
                >
                  Continuer
                </button>

                <button
                  onClick={() => handleProgramSelect(selectedProgram)}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-all"
                >
                  Recommencer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutView;
