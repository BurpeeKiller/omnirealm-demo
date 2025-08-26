"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Sparkles, Check } from "lucide-react";
import { useState } from "react";

interface UpgradePromptProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function UpgradePrompt({ isOpen = true, onClose }: UpgradePromptProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md mx-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-yellow-500/30"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Content */}
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Débloquez Premium</h2>
              <p className="text-gray-300">
                Accédez à tous les exercices et fonctionnalités avancées
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 text-left">
              {[
                "Tous les exercices premium",
                "Coach IA personnalisé",
                "Analytics avancées",
                "Programmes illimités",
                "Support prioritaire",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-white">29€</span>
                <div className="text-left">
                  <div className="text-gray-300">/mois</div>
                  <div className="text-xs text-gray-400">14 jours gratuits</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold h-12"
                onClick={() => {
                  // TODO: Redirect to pricing
                  handleClose();
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Commencer l'essai gratuit
              </Button>

              <Button
                variant="ghost"
                onClick={handleClose}
                className="w-full text-gray-400 hover:text-white"
              >
                Plus tard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
