"use client";

import { Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumBadgeProps {
  size?: "small" | "default" | "large";
  animated?: boolean;
}

export function PremiumBadge({ size = "default", animated = true }: PremiumBadgeProps) {
  const sizeClasses = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base",
  };

  const iconSizes = {
    small: "w-3 h-3",
    default: "w-4 h-4",
    large: "w-5 h-5",
  };

  const BadgeContent = () => (
    <div
      className={`
      inline-flex items-center gap-1.5
      bg-gradient-to-r from-yellow-600 to-orange-600
      text-white font-bold rounded-full
      ${sizeClasses[size]}
      shadow-lg shadow-yellow-500/25
    `}
    >
      <Crown className={iconSizes[size]} />
      <span>Premium</span>
      <Sparkles className={iconSizes[size]} />
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <BadgeContent />
      </motion.div>
    );
  }

  return <BadgeContent />;
}
