"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Sparkles, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BadgeVariant = "crown" | "star" | "shield" | "sparkles" | "lightning";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeStyle = "gradient" | "solid" | "glow" | "minimal";

interface PremiumBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: BadgeStyle;
  animated?: boolean;
  showText?: boolean;
  text?: string;
  pulsing?: boolean;
  glowing?: boolean;
  onClick?: () => void;
  className?: string;
}

const ICON_MAP = {
  crown: Crown,
  star: Star,
  shield: Shield,
  sparkles: Sparkles,
  lightning: Zap,
};

const SIZE_MAP = {
  sm: { icon: "w-3 h-3", text: "text-xs", padding: "px-1.5 py-0.5" },
  md: { icon: "w-4 h-4", text: "text-sm", padding: "px-2 py-1" },
  lg: { icon: "w-5 h-5", text: "text-base", padding: "px-3 py-1.5" },
};

export function PremiumBadge({
  variant = "crown",
  size = "md",
  style = "gradient",
  animated = true,
  showText = true,
  text = "Premium",
  pulsing = false,
  glowing = false,
  onClick,
  className = "",
}: PremiumBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkleCount, setSparkleCount] = useState(0);

  const Icon = ICON_MAP[variant];
  const sizeConfig = SIZE_MAP[size];

  useEffect(() => {
    if (animated && variant === "sparkles") {
      const interval = setInterval(() => {
        setSparkleCount(prev => prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [animated, variant]);

  const getStyleClasses = () => {
    const baseClasses = "inline-flex items-center gap-1 font-semibold transition-all duration-300";

    switch (style) {
      case "gradient":
        return cn(
          baseClasses,
          "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0 shadow-md",
          glowing && "shadow-purple-500/25 shadow-lg",
          isHovered && "shadow-purple-500/40 shadow-xl scale-105"
        );

      case "solid":
        return cn(baseClasses, "bg-purple-600 text-white border-0", isHovered && "bg-purple-700");

      case "glow":
        return cn(
          baseClasses,
          "bg-white text-purple-600 border-2 border-purple-200 shadow-lg",
          "shadow-purple-500/20",
          isHovered && "shadow-purple-500/40 border-purple-300"
        );

      case "minimal":
        return cn(
          baseClasses,
          "bg-purple-50 text-purple-600 border border-purple-200",
          isHovered && "bg-purple-100"
        );

      default:
        return baseClasses;
    }
  };

  const badge = (
    <motion.div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={
        pulsing
          ? {
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1],
            }
          : {}
      }
      transition={
        pulsing
          ? {
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }
          : {}
      }
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Sparkle Effects */}
      <AnimatePresence>
        {animated && variant === "sparkles" && sparkleCount > 0 && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`${sparkleCount}-${i}`}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 40,
                  y: (Math.random() - 0.5) * 40,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                }}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <Badge className={cn(getStyleClasses(), sizeConfig.padding)}>
        {/* Icon with animation */}
        <motion.div
          animate={
            animated
              ? {
                  rotate: variant === "crown" ? [0, 5, -5, 0] : 0,
                  scale: variant === "star" ? [1, 1.1, 1] : 1,
                  y: variant === "lightning" ? [0, -1, 0] : 0,
                }
              : {}
          }
          transition={
            animated
              ? {
                  duration: variant === "crown" ? 3 : variant === "star" ? 2 : 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }
              : {}
          }
          className={sizeConfig.icon}
        >
          <Icon
            className={cn(
              "fill-current",
              variant === "crown" && "text-yellow-300",
              variant === "star" && "text-yellow-400",
              variant === "sparkles" && "text-pink-300"
            )}
          />
        </motion.div>

        {/* Text */}
        {showText && <span className={sizeConfig.text}>{text}</span>}

        {/* Hover effect overlay */}
        <AnimatePresence>
          {isHovered && style === "gradient" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/10 rounded-md"
            />
          )}
        </AnimatePresence>
      </Badge>

      {/* Glowing ring effect */}
      <AnimatePresence>
        {glowing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.2, 1.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-md blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );

  return badge;
}

// Predefined badge variants for common use cases
export const PremiumBadges = {
  Crown: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge variant="crown" style="gradient" animated {...props} />
  ),

  Star: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge variant="star" style="glow" animated pulsing {...props} />
  ),

  Shield: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge variant="shield" style="solid" text="Sécurisé" {...props} />
  ),

  Sparkles: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge variant="sparkles" style="gradient" animated glowing {...props} />
  ),

  Lightning: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge variant="lightning" style="glow" text="Rapide" animated {...props} />
  ),

  // Social status badges
  EarlyAdopter: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge variant="star" style="gradient" text="Early Adopter" glowing {...props} />
  ),

  FitnessGuru: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge
      variant="crown"
      style="gradient"
      text="Fitness Guru"
      animated
      pulsing
      {...props}
    />
  ),

  TopPerformer: (props: Partial<PremiumBadgeProps>) => (
    <PremiumBadge variant="lightning" style="glow" text="Top 10%" glowing {...props} />
  ),
};
