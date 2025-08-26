"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Play, Users, Star, Crown, Zap, Timer, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExerciseDefinition } from "@/data/exercises";

interface FeatureGateProps {
  exercise: ExerciseDefinition;
  onUpgrade: () => void;
  className?: string;
  showPreview?: boolean;
}

export function FeatureGate({
  exercise,
  onUpgrade,
  className = "",
  showPreview = true,
}: FeatureGateProps) {
  const [previewProgress, setPreviewProgress] = useState(0);
  const [weeklyUnlocks, setWeeklyUnlocks] = useState(1247);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showUrgency, setShowUrgency] = useState(false);

  // Simulate weekly unlocks counter
  useEffect(() => {
    const interval = setInterval(() => {
      setWeeklyUnlocks(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Show urgency after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUrgency(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  const startPreview = () => {
    if (!showPreview) return;

    setIsPreviewPlaying(true);
    setPreviewProgress(0);

    const interval = setInterval(() => {
      setPreviewProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPreviewPlaying(false);
          return 100;
        }
        return prev + 2;
      });
    }, 60); // 3 second preview (100 / 2 * 60ms = 3000ms)

    // Stop preview after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsPreviewPlaying(false);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 ${className}`}
    >
      {/* Premium Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      </div>

      {/* Exercise Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Blur overlay when not previewing */}
        <AnimatePresence>
          {!isPreviewPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <Lock className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-gray-700 font-medium">Exercice Premium</p>
                <p className="text-gray-500 text-sm">Aperçu disponible</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Animation/Preview */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="text-6xl filter drop-shadow-lg"
          >
            {exercise.icon}
          </motion.div>
        </div>

        {/* Preview Progress */}
        {isPreviewPlaying && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">Aperçu gratuit</span>
                <span className="text-gray-500">{Math.round(previewProgress)}%</span>
              </div>
              <Progress value={previewProgress} className="h-1" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              {exercise.name}
              <div className="w-2 h-2 rounded-full bg-emerald-400 opacity-60" />
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{exercise.description}</p>
          </div>
        </div>

        {/* Exercise Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{exercise.duration}s</div>
            <div className="text-xs text-gray-500">Durée</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">10</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-500">
              {exercise.calories || Math.round(exercise.duration * 0.5)}
            </div>
            <div className="text-xs text-gray-500">Calories</div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-gray-900">
                {weeklyUnlocks.toLocaleString("fr-FR")} personnes
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.8/5</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1">ont débloqué cet exercice cette semaine</p>
        </div>

        {/* Benefits Preview */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Ce que vous débloquez :
          </p>
          <div className="grid grid-cols-1 gap-1">
            {exercise.benefits.slice(0, 2).map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                {benefit}
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />+{" "}
              {exercise.benefits.length - 2} autres bénéfices...
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {showPreview && !isPreviewPlaying && (
            <Button
              onClick={startPreview}
              variant="outline"
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Aperçu gratuit 3s
              <Eye className="w-4 h-4 ml-2" />
            </Button>
          )}

          {isPreviewPlaying && (
            <Button disabled variant="outline" className="w-full border-purple-200 text-purple-600">
              <Timer className="w-4 h-4 mr-2 animate-spin" />
              Aperçu en cours...
            </Button>
          )}

          <motion.div
            animate={
              showUrgency
                ? {
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 0 0 0 rgb(147, 51, 234, 0.5)",
                      "0 0 0 5px rgb(147, 51, 234, 0.1)",
                      "0 0 0 0 rgb(147, 51, 234, 0)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: showUrgency ? Infinity : 0,
              repeatType: "loop",
            }}
          >
            <Button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
            >
              {showUrgency ? (
                <>
                  <Crown className="w-4 h-4 mr-2 animate-bounce" />
                  Débloquer maintenant - Offre limitée !
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Débloquer en 30 secondes
                </>
              )}
            </Button>
          </motion.div>

          {showUrgency && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs text-orange-600 font-medium"
            >
              ⚡ Essai gratuit 14 jours - Aucune carte requise
            </motion.p>
          )}
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>100% sécurisé</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Zap className="w-3 h-3" />
            <span>Accès immédiat</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
