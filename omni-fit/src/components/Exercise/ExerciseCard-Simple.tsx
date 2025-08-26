"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Lock, Trophy } from "lucide-react";
import { useState } from "react";
import type { ExerciseTemplate } from "@prisma/client";

interface ExerciseCardProps {
  exercise: ExerciseTemplate;
  index: number;
  variant?: "default" | "compact" | "hero";
  showDetails?: boolean;
}

export function ExerciseCard({
  exercise,
  index,
  variant = "default",
  showDetails = true,
}: ExerciseCardProps) {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleIncrement = () => {
    if (exercise.isPremium && !true) {
      // TODO: Check premium status
      // Show upgrade prompt
      return;
    }

    // Note: L'incrément est géré par le store maintenant, cette logique est juste pour l'UI
    // L'incrément réel se fera via l'appel au store
    setIsActive(true);

    // Reset animation after delay
    setTimeout(() => setIsActive(false), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative group cursor-pointer
        ${variant === "compact" ? "p-3" : "p-4"}
        bg-white/80 backdrop-blur-md
        rounded-xl border border-gray-200 shadow-sm
        hover:border-[#00D9B1]/50 hover:shadow-md transition-all duration-300
        ${isActive ? "scale-105 border-[#00D9B1] shadow-lg" : ""}
        ${exercise.isPremium ? "border-[#FDCB6E]/50" : ""}
      `}
      onClick={handleIncrement}
    >
      {/* Premium Lock Overlay */}
      {exercise.isPremium && !true && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-[#FDCB6E] mx-auto mb-2" />
            <p className="text-sm text-[#E84393] font-medium">Premium</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#00D9B1] to-[#00B89F] rounded-lg flex items-center justify-center">
            <span className="text-lg">{exercise.emoji}</span>
          </div>
          {exercise.isPremium && <Trophy className="w-4 h-4 text-[#FDCB6E]" />}
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-[#2D3436]">{count}</div>
          <div className="text-xs text-[#636E72]">+{exercise.reps || 1}</div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-[#2D3436] group-hover:text-[#00D9B1] transition-colors">
          {exercise.name}
        </h3>

        {showDetails && (
          <>
            <p className="text-sm text-[#636E72] line-clamp-2">{exercise.description}</p>

            <div className="flex items-center justify-between text-xs">
              <span
                className={`
                px-2 py-1 rounded-full text-white font-medium
                ${
                  exercise.category === "strength"
                    ? "bg-[#E17055]"
                    : exercise.category === "cardio"
                      ? "bg-[#74B9FF]"
                      : exercise.category === "flexibility"
                        ? "bg-[#00D9B1]"
                        : "bg-[#A29BFE]"
                }
              `}
              >
                {exercise.category}
              </span>

              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#FDCB6E]" />
                <span className="text-[#FDCB6E]">{exercise.basePoints} pts</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Increment Animation */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -20 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="absolute top-2 right-2 pointer-events-none"
        >
          <div className="text-[#00D9B1] font-bold text-lg">+{exercise.reps || 1}</div>
        </motion.div>
      )}
    </motion.div>
  );
}
