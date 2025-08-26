"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Users, TrendingUp, Clock, Star, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS, AB_TEST_VARIANTS, type PricingTier } from "@/data/pricing";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (tier: PricingTier) => void;
  trigger?: string;
  currentUsage?: {
    exercisesToday: number;
    streak: number;
    totalExercises: number;
  };
  variant?: keyof typeof AB_TEST_VARIANTS.upgrade_modal;
}

export function UpgradePrompt({
  isOpen,
  onClose,
  onUpgrade,
  trigger = "manual",
  currentUsage = { exercisesToday: 0, streak: 0, totalExercises: 0 },
  variant = "benefits",
}: UpgradePromptProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingTier>("starter");
  const [showConfetti, setShowConfetti] = useState(false);
  const [socialProofCount, setSocialProofCount] = useState(12847);

  // Simulate real-time social proof
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setSocialProofCount(prev => prev + Math.floor(Math.random() * 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const starterPlan = PRICING_PLANS.find(p => p.id === "starter")!;
  const variantContent = AB_TEST_VARIANTS.upgrade_modal[variant];

  // Contextual messages based on trigger
  const getContextualMessage = () => {
    switch (trigger) {
      case "daily_limit_reached":
        return {
          icon: <Zap className="w-6 h-6 text-orange-500" />,
          title: "Vous êtes en feu ! 🔥",
          description: `${currentUsage.exercisesToday}/3 exercices terminés. Continuez sur votre lancée !`,
          urgency: "high" as const,
        };
      case "streak_milestone":
        return {
          icon: <Star className="w-6 h-6 text-yellow-500" />,
          title: `${currentUsage.streak} jours consécutifs !`,
          description: "Votre régularité mérite un coach personnel.",
          urgency: "medium" as const,
        };
      case "premium_exercise_click":
        return {
          icon: <Crown className="w-6 h-6 text-purple-500" />,
          title: "Exercice Premium",
          description: "Cet exercice va transformer vos pauses !",
          urgency: "high" as const,
        };
      default:
        return {
          icon: <Sparkles className="w-6 h-6 text-[#00D9B1]" />,
          title: variantContent.title,
          description: variantContent.description,
          urgency: "medium" as const,
        };
    }
  };

  const contextualContent = getContextualMessage();

  const handleUpgrade = () => {
    setShowConfetti(true);
    setTimeout(() => {
      onUpgrade(selectedPlan);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white">
              {/* Confetti Effect */}
              <AnimatePresence>
                {showConfetti && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 pointer-events-none"
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          x: "50%",
                          y: "50%",
                          scale: 0,
                          rotate: 0,
                        }}
                        animate={{
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          scale: [0, 1, 0],
                          rotate: Math.random() * 360,
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05,
                        }}
                        className="absolute w-2 h-2 bg-gradient-to-r from-[#00D9B1] to-yellow-400 rounded-full"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="p-6">
                {/* Header with Context */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    {contextualContent.icon}
                  </div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-gray-900 mb-2"
                  >
                    {contextualContent.title}
                  </motion.h2>

                  <p className="text-gray-600 mb-4">{contextualContent.description}</p>

                  {/* Urgency Indicator */}
                  {contextualContent.urgency === "high" && (
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 0 0 rgb(239, 68, 68, 0.7)",
                          "0 0 0 10px rgb(239, 68, 68, 0)",
                          "0 0 0 0 rgb(239, 68, 68, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                      className="inline-block"
                    >
                      <Badge variant="destructive" className="animate-pulse">
                        Offre limitée
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Social Proof */}
                <div className="bg-gradient-to-r from-[#E6FFF9] to-[#E6F7FF] rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[#00B89F]">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">
                        {socialProofCount.toLocaleString("fr-FR")} professionnels
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium text-gray-700">4.9/5</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">
                    ont transformé leurs pauses cette semaine
                  </p>
                </div>

                {/* Plan Selection */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Votre upgrade</h3>
                    <Badge className="bg-[#00D9B1] text-white">14 jours gratuits</Badge>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlan("starter")}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedPlan === "starter"
                          ? "border-[#00D9B1] bg-gradient-to-r from-[#E6FFF9] to-white"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }
                    `}
                  >
                    {starterPlan.badge === "popular" && (
                      <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-[#00D9B1] to-[#00B89F] text-white text-xs">
                        Le plus populaire
                      </Badge>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#00D9B1]" />
                          {starterPlan.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{starterPlan.tagline}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {starterPlan.price.monthly}€
                        </div>
                        <div className="text-xs text-gray-500">par mois</div>
                      </div>
                    </div>

                    {/* Key Benefits Preview */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {["Exercices illimités", "Coach IA", "Analyse posture"].map(feature => (
                        <Badge key={feature} variant="secondary" className="text-xs bg-white">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center text-sm">
                  <div>
                    <div className="font-bold text-[#00D9B1]">94%</div>
                    <div className="text-gray-500">Restent</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#00D9B1]">3 jours</div>
                    <div className="text-gray-500">Résultats</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#00D9B1]">4.9★</div>
                    <div className="text-gray-500">Satisfaction</div>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <Button
                    onClick={handleUpgrade}
                    disabled={showConfetti}
                    className="w-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white font-semibold py-3 text-lg"
                  >
                    {showConfetti ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.span>
                    ) : (
                      variantContent.cta
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    Sans engagement • Annulez quand vous voulez
                  </p>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Activation instantanée</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>Résultats garantis</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
