"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Plus, Lock, Info, Trophy, Zap, Target } from "lucide-react";
import { ExerciseDefinition } from "@/data/exercises";
import { useExercisesStore } from "@/stores/exercises.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useSessionStore } from "@/stores/session.store";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: ExerciseDefinition;
  index: number;
  onExerciseStart?: (exerciseId: string) => void;
  variant?: "default" | "compact" | "hero";
  showDetails?: boolean;
  className?: string;
}

// Particules de célébration
const ParticleEffect = ({ trigger }: { trigger: boolean }) => {
  return (
    <AnimatePresence>
      {trigger && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                scale: 0,
                x: "50%",
                y: "50%",
                rotate: 0,
              }}
              animate={{
                opacity: 0,
                scale: Math.random() * 0.8 + 0.4,
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              className={cn(
                "absolute w-2 h-2 rounded-full",
                i % 3 === 0 ? "bg-yellow-400" : i % 3 === 1 ? "bg-green-400" : "bg-blue-400"
              )}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Effet glow premium
const PremiumGlow = ({ isPremium, isLocked }: { isPremium: boolean; isLocked: boolean }) => {
  if (!isPremium) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <div
        className={cn(
          "absolute inset-0 rounded-2xl blur-xl opacity-20 transition-opacity duration-500",
          isLocked ? "bg-gray-500" : "bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-2xl blur-sm opacity-10 transition-opacity duration-500",
          isLocked ? "bg-gray-400" : "bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400"
        )}
      />
    </div>
  );
};

// Composant principal
export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  onExerciseStart,
  variant = "default",
  showDetails = false,
  className,
}) => {
  const { incrementExercise } = useSessionStore();
  // Valeurs par défaut en attendant les corrections du store settings
  const soundEnabled = true;
  const vibrationEnabled = true;
  const user = null;

  // Mapping des IDs d'exercice vers les types de session
  const mapExerciseIdToType = (id: string) => {
    if (id.includes("pushup") || id.includes("pompe")) return "pushups";
    if (id.includes("squat")) return "squats";
    if (id.includes("burpee")) return "burpees";
    if (id.includes("plank") || id.includes("planche")) return "plank";
    if (id.includes("jumping")) return "jumping-jacks";
    if (id.includes("lunge") || id.includes("fente")) return "lunges";
    return "pushups"; // default
  };

  // États locaux
  const [showParticles, setShowParticles] = useState(false);
  const [showIncrement, setShowIncrement] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Animations
  const cardControls = useAnimation();
  const countControls = useAnimation();
  const buttonControls = useAnimation();

  // Vérification premium
  const isPremium = exercise.isPremium;
  const hasAccess = !isPremium || false; // TODO: intégrer user premium check
  const isLocked = isPremium && !hasAccess;

  // Récupération du count depuis le store de session
  useEffect(() => {
    const sessionStore = useSessionStore.getState();
    const exerciseType = mapExerciseIdToType(exercise.id);
    const exerciseCounter = sessionStore.exerciseCounters[exerciseType];
    setCurrentCount(exerciseCounter?.count || 0);
  }, [exercise.id, mapExerciseIdToType]);

  // Feedback audio (simulation)
  const playSound = useCallback(
    (type: "increment" | "complete" | "locked") => {
      if (!soundEnabled) return;

      // Simulation - en réalité vous utiliseriez Web Audio API ou une librairie
      const frequencies: Record<string, number> = {
        increment: 800,
        complete: 1200,
        locked: 300,
      };

      // Ici vous implémenteriez le vrai son
      console.log(`🔊 Playing ${type} sound at ${frequencies[type]}Hz`);
    },
    [soundEnabled]
  );

  // Feedback haptique
  const triggerVibration = useCallback(
    (pattern: number[]) => {
      if (!vibrationEnabled || !navigator.vibrate) return;
      navigator.vibrate(pattern);
    },
    [vibrationEnabled]
  );

  // Animation d'entrée
  useEffect(() => {
    cardControls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      },
    });
  }, [cardControls, index]);

  // Gestionnaire de clic principal
  const handleExerciseClick = useCallback(async () => {
    if (isLocked) {
      if (isLocked) {
        playSound("locked");
        triggerVibration([100, 50, 100]);
        // Trigger upgrade modal
        const event = new CustomEvent("show-upgrade-prompt", {
          detail: { reason: "exercise_locked", feature: exercise.name },
        });
        window.dispatchEvent(event);
      }
      return;
    }

    try {
      // Animations de feedback immédiat
      setShowIncrement(true);
      setShowParticles(true);

      // Animations séquentielles
      await Promise.all([
        cardControls.start({
          scale: [1, 0.95, 1.02, 1],
          transition: { duration: 0.6 },
        }),
        countControls.start({
          scale: [1, 1.3, 1],
          color: ["#ffffff", "#00D9B1", "#ffffff"],
          transition: { duration: 0.8 },
        }),
        buttonControls.start({
          scale: [1, 0.9, 1.1, 1],
          transition: { duration: 0.5 },
        }),
      ]);

      // Mise à jour du store
      incrementExercise(mapExerciseIdToType(exercise.id));

      // Feedback sensoriel
      playSound("increment");
      triggerVibration([50, 30, 100]);

      // Reset des effets visuels
      setTimeout(() => {
        setShowIncrement(false);
        setShowParticles(false);
      }, 1200);

      // Callback optionnel
      onExerciseStart?.(exercise.id);
    } catch (error) {
      console.error("Error incrementing exercise:", error);
      playSound("locked");
    }
  }, [
    isLocked,
    exercise,
    incrementExercise,
    onExerciseStart,
    playSound,
    triggerVibration,
    cardControls,
    countControls,
    buttonControls,
  ]);

  // Styles dynamiques
  const cardStyles = {
    default: "p-6 h-auto",
    compact: "p-4 h-32",
    hero: "p-8 h-auto",
  };

  const emojiStyles = {
    default: "text-4xl lg:text-5xl",
    compact: "text-2xl",
    hero: "text-6xl lg:text-7xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={cardControls}
      className={cn(
        "relative group cursor-pointer select-none",
        "bg-gradient-to-br from-gray-800/50 to-gray-900/70",
        "border border-gray-700/50 rounded-2xl backdrop-blur-sm",
        "hover:border-gray-600 transition-all duration-300",
        "transform hover:translate-y-[-4px]",
        isLocked && "opacity-75 cursor-not-allowed",
        cardStyles[variant],
        className
      )}
      onClick={handleExerciseClick}
      whileHover={
        !isLocked
          ? {
              scale: 1.02,
              boxShadow: `0 8px 32px #00D9B120`,
            }
          : {}
      }
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      {/* Glow effect pour premium */}
      <PremiumGlow isPremium={isPremium} isLocked={isLocked} />

      {/* Particules de célébration */}
      <ParticleEffect trigger={showParticles} />

      {/* Badge Premium */}
      {isPremium && (
        <div className="absolute -top-2 -right-2 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
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
          </motion.div>
        </div>
      )}

      {/* Info button */}
      {showDetails && (
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          onClick={e => {
            e.stopPropagation();
            setShowInfo(true);
          }}
        >
          <Info className="w-4 h-4" />
        </button>
      )}

      {/* Contenu principal */}
      <div className="flex flex-col items-center relative z-10">
        {/* Emoji avec animation personnalisée */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={cn(emojiStyles[variant], "mb-3 select-none")}
        >
          {exercise.icon}
        </motion.div>

        {/* Nom et description */}
        <div className="text-center mb-4">
          <h3
            className={cn(
              "font-semibold text-gray-200 mb-2",
              variant === "hero" ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl"
            )}
          >
            {exercise.name}
            {isLocked && <Lock className="w-4 h-4 inline-block ml-2 opacity-70" />}
          </h3>

          {variant !== "compact" && (
            <p className="text-sm text-gray-400 max-w-xs">{exercise.description}</p>
          )}
        </div>

        {/* Compteur avec animations */}
        <motion.div animate={countControls} className="relative mb-5">
          <div
            className={cn(
              "font-bold text-gradient mb-2",
              variant === "hero" ? "text-5xl lg:text-6xl" : "text-3xl lg:text-4xl"
            )}
            style={{
              background: `linear-gradient(135deg, #00D9B1, #00D9B180)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {currentCount}
          </div>

          {/* Feedback d'incrément */}
          <AnimatePresence>
            {showIncrement && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -25, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="flex items-center gap-1 text-2xl lg:text-3xl font-bold text-green-400">
                  <Plus className="w-6 h-6" />
                  <span>+1</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bouton d'action */}
        <motion.button
          animate={buttonControls}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
            "text-sm lg:text-base font-medium",
            isLocked
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : `bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg`,
            variant === "compact" && "px-3 py-1.5 text-sm"
          )}
          disabled={isLocked}
          whileHover={!isLocked ? { scale: 1.05 } : {}}
          whileTap={!isLocked ? { scale: 0.95 } : {}}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              <span>Premium</span>
            </>
          ) : false ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>+1</span>
            </>
          )}
        </motion.button>

        {/* Indicateurs additionnels pour variant hero */}
        {variant === "hero" && (
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>{exercise.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{exercise.difficulty}</span>
            </div>
            {exercise.calories && exercise.calories > 0 && (
              <div className="flex items-center gap-1">
                <span>🔥</span>
                <span>{exercise.calories} cal</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Effet de survol premium */}
      {isPremium && !isLocked && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Modal d'informations détaillées */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{exercise.icon}</div>
                <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                <p className="text-gray-400 text-sm">{exercise.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Instructions</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {exercise.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Bénéfices</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {exercise.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Muscles</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {exercise.muscles.map((muscle, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5">•</span>
                        <span>{muscle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="w-full mt-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Composant wrapper pour plusieurs cartes
export const ExerciseGrid: React.FC<{
  exercises: ExerciseDefinition[];
  variant?: "default" | "compact" | "hero";
  columns?: number;
  showDetails?: boolean;
  className?: string;
}> = ({ exercises, variant = "default", columns = 3, showDetails = false, className }) => {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index}
          variant={variant}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
};

export default ExerciseCard;
