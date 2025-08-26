/**
 * Premium Components - Export barrel
 * Système SaaS révolutionnaire pour conversion maximale
 */

// Core Premium Components
export { UpgradePrompt } from "./UpgradePrompt";
export { FeatureGate } from "./FeatureGate";
export { UsageLimits } from "./UsageLimits";
export { PremiumBadge, PremiumBadges } from "./PremiumBadge";

// AI Components
export { AIChatPremium } from "../AI/AIChatPremium";

// Types
export type { PricingTier, PricingPlan, PricingFeature, UpgradeTrigger } from "@/data/pricing";

// Utility functions
export {
  getPlanById,
  getRecommendedPlan,
  calculateYearlySavings,
  getTriggersForTier,
  formatPrice,
  PRICING_PLANS,
  UPGRADE_TRIGGERS,
} from "@/data/pricing";
