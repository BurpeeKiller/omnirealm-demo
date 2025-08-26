"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Flame,
  Clock,
  Crown,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Users,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface UsageLimitsProps {
  currentUsage: {
    exercisesToday: number;
    maxExercises: number;
    streak: number;
    totalSessions: number;
  };
  onUpgrade: () => void;
  className?: string;
  compact?: boolean;
}

export function UsageLimits({
  currentUsage,
  onUpgrade,
  className = "",
  compact = false,
}: UsageLimitsProps) {
  const [encouragementLevel, setEncouragementLevel] = useState<
    "neutral" | "encouraging" | "urgent"
  >("neutral");
  const [showMotivation, setShowMotivation] = useState(false);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);

  const { exercisesToday, maxExercises, streak, totalSessions } = currentUsage;
  const usagePercentage = (exercisesToday / maxExercises) * 100;
  const remainingExercises = Math.max(0, maxExercises - exercisesToday);
  const isLimitReached = exercisesToday >= maxExercises;

  // Calculate daily goal progress (assuming goal is 3 exercises)
  useEffect(() => {
    const dailyGoal = 3;
    setDailyGoalProgress((exercisesToday / dailyGoal) * 100);
  }, [exercisesToday]);

  // Set encouragement level based on usage
  useEffect(() => {
    if (usagePercentage >= 80) {
      setEncouragementLevel("urgent");
    } else if (usagePercentage >= 50) {
      setEncouragementLevel("encouraging");
    } else {
      setEncouragementLevel("neutral");
    }
  }, [usagePercentage]);

  // Show motivation after user engagement
  useEffect(() => {
    if (exercisesToday > 0) {
      setShowMotivation(true);
    }
  }, [exercisesToday]);

  const getMotivationalMessage = () => {
    if (isLimitReached) {
      if (streak >= 7) {
        return "🔥 7 jours consécutifs ! Votre régularité mérite plus d'exercices.";
      } else if (streak >= 3) {
        return "💪 Vous êtes en pleine forme ! Continuez avec plus d'exercices.";
      } else {
        return "⚡ Vous êtes motivé(e) ! Débloquéz plus d'exercices pour continuer.";
      }
    } else if (usagePercentage >= 66) {
      return `🚀 Plus que ${remainingExercises} exercice${remainingExercises > 1 ? "s" : ""} avant demain !`;
    } else if (exercisesToday > 0) {
      return "👏 Excellent début ! Vous faites partie des utilisateurs actifs.";
    } else {
      return "💫 Prêt(e) pour votre première séance aujourd'hui ?";
    }
  };

  const getProgressColor = () => {
    if (usagePercentage >= 80) return "from-orange-500 to-red-500";
    if (usagePercentage >= 50) return "from-yellow-400 to-orange-500";
    return "from-[#00D9B1] to-[#00B89F]";
  };

  const getUrgencyIcon = () => {
    if (isLimitReached) return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    if (usagePercentage >= 66) return <Timer className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle2 className="w-4 h-4 text-[#00D9B1]" />;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg ${className}`}
      >
        <div className="flex items-center gap-3">
          {getUrgencyIcon()}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {exercisesToday}/{maxExercises} exercices
            </div>
            <div className="text-xs text-gray-500">aujourd'hui</div>
          </div>
        </div>

        {isLimitReached && (
          <Button
            size="sm"
            onClick={onUpgrade}
            className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white"
          >
            Débloquer
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <Card className={`overflow-hidden border-0 shadow-sm bg-white ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Activité aujourd'hui</h3>
          </div>

          {streak > 0 && (
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {streak} jour{streak > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Progress Visualization */}
        <div className="space-y-4">
          {/* Main Usage Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Exercices quotidiens</span>
              <span className="text-sm text-gray-600">
                <strong className="text-gray-900">{exercisesToday}</strong>/{maxExercises}
              </span>
            </div>

            <div className="relative">
              <Progress value={usagePercentage} className="h-3 bg-gray-100" />
              <div
                className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
                style={{ width: `${usagePercentage}%` }}
              />

              {/* Usage markers */}
              <div className="absolute -top-1 w-full h-5">
                {[33, 66].map(marker => (
                  <div
                    key={marker}
                    className="absolute w-0.5 h-5 bg-gray-300"
                    style={{ left: `${marker}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <AnimatePresence>
            {showMotivation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3"
              >
                <p className="text-sm text-gray-700 text-center">{getMotivationalMessage()}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-lg font-bold text-gray-900">{totalSessions}</div>
              <div className="text-xs text-gray-500">Sessions totales</div>
            </div>
            <div className="bg-gradient-to-br from-[#E6FFF9] to-[#E6F7FF] rounded-lg p-3">
              <div className="text-lg font-bold text-[#00B89F]">
                {Math.round(dailyGoalProgress)}%
              </div>
              <div className="text-xs text-gray-600">Objectif quotidien</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">{streak}</div>
              <div className="text-xs text-gray-600">Série actuelle</div>
            </div>
          </div>

          {/* Upgrade Prompt */}
          <AnimatePresence>
            {(usagePercentage >= 66 || isLimitReached) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3"
              >
                {/* Social Proof */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>94% des utilisateurs premium continuent après l'essai</span>
                </div>

                {/* CTA Button */}
                <motion.div
                  animate={
                    isLimitReached
                      ? {
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            "0 0 0 0 rgb(0, 217, 177, 0.5)",
                            "0 0 0 8px rgb(0, 217, 177, 0.1)",
                            "0 0 0 0 rgb(0, 217, 177, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: isLimitReached ? Infinity : 0,
                    repeatType: "loop",
                  }}
                >
                  <Button
                    onClick={onUpgrade}
                    className="w-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white font-semibold py-3"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    {isLimitReached ? "Continuer avec Premium" : "Débloquer plus d'exercices"}
                  </Button>
                </motion.div>

                {/* Benefits Preview */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    Avec Premium :
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Exercices illimités
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Coach IA personnel
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Analyse posture
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      14 jours gratuits
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-500">
                  Sans engagement • Annulation en 1 clic
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
