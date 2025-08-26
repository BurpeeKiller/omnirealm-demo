"use client";

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { StateCreator } from "zustand";
import type { Session, User } from "next-auth";

// Types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    language: "fr" | "en";
    timezone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

export interface Subscription {
  id: string;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  planId: string;
  planName: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  planRequired: string[];
  enabled: boolean;
}

export interface UsageLimits {
  dailyExercises: {
    used: number;
    limit: number;
    unlimited: boolean;
  };
  programs: {
    used: number;
    limit: number;
    unlimited: boolean;
  };
  customExercises: {
    used: number;
    limit: number;
    unlimited: boolean;
  };
  aiCoaching: {
    used: number;
    limit: number;
    unlimited: boolean;
  };
  analytics: {
    enabled: boolean;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
  stripePriceId: string;
  limits: Partial<UsageLimits>;
}

// Store State Interface
interface AuthState {
  // Auth State
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;

  // Subscription State
  subscription: Subscription | null;
  isPremium: boolean;
  isTrialing: boolean;
  planId: string | null;

  // Premium Features
  premiumFeatures: PremiumFeature[];
  usageLimits: UsageLimits;
  availablePlans: SubscriptionPlan[];

  // UI State
  loading: boolean;
  error: string | null;
  showUpgradePrompt: boolean;
  upgradeReason: string | null;

  // Actions - Authentication
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserPreferences: (preferences: Partial<UserProfile["preferences"]>) => Promise<void>;
  signOut: () => Promise<void>;

  // Actions - Subscription
  loadSubscription: () => Promise<void>;
  updateSubscription: (subscription: Subscription) => void;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;

  // Actions - Premium Features
  checkFeatureAccess: (featureId: string) => boolean;
  checkUsageLimit: (limitType: keyof UsageLimits) => boolean;
  incrementUsage: (limitType: keyof UsageLimits, amount?: number) => void;
  resetDailyUsage: () => void;

  // Actions - Plans & Billing
  loadAvailablePlans: () => Promise<void>;
  createCheckoutSession: (planId: string) => Promise<string>;
  createPortalSession: () => Promise<string>;

  // Actions - UI
  showUpgrade: (reason: string, feature?: string) => void;
  hideUpgradePrompt: () => void;
  clearError: () => void;

  // Actions - Data Management
  reset: () => void;
  syncWithServer: () => Promise<void>;
}

// Default values
const DEFAULT_USAGE_LIMITS: UsageLimits = {
  dailyExercises: {
    used: 0,
    limit: 3,
    unlimited: false,
  },
  programs: {
    used: 0,
    limit: 1,
    unlimited: false,
  },
  customExercises: {
    used: 0,
    limit: 0,
    unlimited: false,
  },
  aiCoaching: {
    used: 0,
    limit: 0,
    unlimited: false,
  },
  analytics: {
    enabled: false,
  },
};

const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: "unlimited_exercises",
    name: "Exercices illimités",
    description: "Pas de limite sur le nombre d'exercices par jour",
    planRequired: ["premium", "pro"],
    enabled: true,
  },
  {
    id: "custom_programs",
    name: "Programmes personnalisés",
    description: "Créez vos propres programmes d'entraînement",
    planRequired: ["premium", "pro"],
    enabled: true,
  },
  {
    id: "ai_coaching",
    name: "Coach IA",
    description: "Conseils personnalisés et suivi intelligent",
    planRequired: ["pro"],
    enabled: true,
  },
  {
    id: "advanced_analytics",
    name: "Analyses avancées",
    description: "Statistiques détaillées et graphiques",
    planRequired: ["premium", "pro"],
    enabled: true,
  },
  {
    id: "export_data",
    name: "Export de données",
    description: "Exportez vos données d'entraînement",
    planRequired: ["premium", "pro"],
    enabled: true,
  },
  {
    id: "priority_support",
    name: "Support prioritaire",
    description: "Support client avec réponse prioritaire",
    planRequired: ["pro"],
    enabled: true,
  },
];

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Gratuit",
    description: "Parfait pour débuter",
    price: 0,
    currency: "EUR",
    interval: "month",
    stripePriceId: "",
    features: [
      "3 exercices par jour",
      "1 programme de base",
      "Statistiques simples",
      "Support communautaire",
    ],
    limits: {
      dailyExercises: { used: 0, limit: 3, unlimited: false },
      programs: { used: 0, limit: 1, unlimited: false },
      customExercises: { used: 0, limit: 0, unlimited: false },
      analytics: { enabled: false },
    },
  },
  {
    id: "premium",
    name: "Premium",
    description: "Pour les sportifs réguliers",
    price: 9.99,
    currency: "EUR",
    interval: "month",
    stripePriceId: "price_premium_monthly",
    popular: true,
    features: [
      "Exercices illimités",
      "Tous les programmes",
      "Exercices personnalisés",
      "Analyses avancées",
      "Export de données",
      "Support par email",
    ],
    limits: {
      dailyExercises: { used: 0, limit: -1, unlimited: true },
      programs: { used: 0, limit: -1, unlimited: true },
      customExercises: { used: 0, limit: 20, unlimited: false },
      analytics: { enabled: true },
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les passionnés de fitness",
    price: 19.99,
    currency: "EUR",
    interval: "month",
    stripePriceId: "price_pro_monthly",
    features: [
      "Tout du Premium",
      "Coach IA personnel",
      "Programmes illimités",
      "Exercices illimités",
      "Support prioritaire",
      "Accès beta aux nouvelles fonctionnalités",
    ],
    limits: {
      dailyExercises: { used: 0, limit: -1, unlimited: true },
      programs: { used: 0, limit: -1, unlimited: true },
      customExercises: { used: 0, limit: -1, unlimited: true },
      aiCoaching: { used: 0, limit: -1, unlimited: true },
      analytics: { enabled: true },
    },
  },
];

// Store Implementation
const createAuthStore: StateCreator<
  AuthState,
  [["zustand/subscribeWithSelector", never], ["zustand/persist", unknown], ["zustand/immer", never]]
> = (set, get) => ({
  // Initial State
  session: null,
  user: null,
  userProfile: null,
  isAuthenticated: false,

  subscription: null,
  isPremium: false,
  isTrialing: false,
  planId: "free",

  premiumFeatures: PREMIUM_FEATURES,
  usageLimits: DEFAULT_USAGE_LIMITS,
  availablePlans: SUBSCRIPTION_PLANS,

  loading: false,
  error: null,
  showUpgradePrompt: false,
  upgradeReason: null,

  // Authentication Actions
  setSession: (session: Session | null) => {
    set(draft => {
      draft.session = session;
      draft.user = session?.user || null;
      draft.isAuthenticated = !!session;
    });
  },

  setUser: (user: User | null) => {
    set(draft => {
      draft.user = user;
    });
  },

  setUserProfile: (profile: UserProfile | null) => {
    set(draft => {
      draft.userProfile = profile;
    });
  },

  updateUserPreferences: async (preferences: Partial<UserProfile["preferences"]>) => {
    const { userProfile } = get();
    if (!userProfile) return;

    set(draft => {
      draft.loading = true;
      draft.error = null;
    });

    try {
      const updatedProfile = {
        ...userProfile,
        preferences: { ...userProfile.preferences, ...preferences },
      };

      // Update in backend
      await updateUserProfileInDB(updatedProfile);

      set(draft => {
        draft.userProfile = updatedProfile;
        draft.loading = false;
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      set(draft => {
        draft.error = error instanceof Error ? error.message : "Failed to update preferences";
        draft.loading = false;
      });
    }
  },

  signOut: async () => {
    try {
      // Sign out with NextAuth
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/" });

      // Reset store
      get().reset();
    } catch (error) {
      console.error("Error signing out:", error);
      set(draft => {
        draft.error = "Failed to sign out";
      });
    }
  },

  // Subscription Actions
  loadSubscription: async () => {
    const { user } = get();
    if (!user) return;

    set(draft => {
      draft.loading = true;
      draft.error = null;
    });

    try {
      const subscription = await fetchUserSubscription(user.email!);

      set(draft => {
        draft.subscription = subscription;
        draft.isPremium = subscription?.status === "active" || subscription?.status === "trialing";
        draft.isTrialing = subscription?.status === "trialing";
        draft.planId = subscription?.planId || "free";

        // Update usage limits based on plan
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === draft.planId);
        if (plan?.limits) {
          draft.usageLimits = { ...DEFAULT_USAGE_LIMITS, ...plan.limits };
        }

        draft.loading = false;
      });
    } catch (error) {
      console.error("Error loading subscription:", error);
      set(draft => {
        draft.error = "Failed to load subscription";
        draft.loading = false;
      });
    }
  },

  updateSubscription: (subscription: Subscription) => {
    set(draft => {
      draft.subscription = subscription;
      draft.isPremium = subscription.status === "active" || subscription.status === "trialing";
      draft.isTrialing = subscription.status === "trialing";
      draft.planId = subscription.planId;

      // Update usage limits
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);
      if (plan?.limits) {
        draft.usageLimits = { ...DEFAULT_USAGE_LIMITS, ...plan.limits };
      }
    });
  },

  cancelSubscription: async () => {
    const { subscription } = get();
    if (!subscription) return;

    set(draft => {
      draft.loading = true;
      draft.error = null;
    });

    try {
      await cancelSubscriptionInStripe(subscription.id);

      set(draft => {
        if (draft.subscription) {
          draft.subscription.cancelAtPeriodEnd = true;
        }
        draft.loading = false;
      });

      // Track cancellation
      trackSubscriptionEvent("cancelled", subscription.planId);
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      set(draft => {
        draft.error = "Failed to cancel subscription";
        draft.loading = false;
      });
    }
  },

  reactivateSubscription: async () => {
    const { subscription } = get();
    if (!subscription) return;

    set(draft => {
      draft.loading = true;
      draft.error = null;
    });

    try {
      await reactivateSubscriptionInStripe(subscription.id);

      set(draft => {
        if (draft.subscription) {
          draft.subscription.cancelAtPeriodEnd = false;
        }
        draft.loading = false;
      });

      // Track reactivation
      trackSubscriptionEvent("reactivated", subscription.planId);
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      set(draft => {
        draft.error = "Failed to reactivate subscription";
        draft.loading = false;
      });
    }
  },

  // Premium Features Actions
  checkFeatureAccess: (featureId: string): boolean => {
    const { premiumFeatures, planId, isPremium } = get();
    const feature = premiumFeatures.find(f => f.id === featureId);

    if (!feature) return false;
    if (!feature.enabled) return false;

    return (
      feature.planRequired.includes(planId || "free") ||
      (isPremium && feature.planRequired.includes("premium"))
    );
  },

  checkUsageLimit: (limitType: keyof UsageLimits): boolean => {
    const { usageLimits } = get();
    const limit = usageLimits[limitType] as any;

    if (!limit || typeof limit !== "object") return true;
    if (limit.unlimited) return true;

    return limit.used < limit.limit;
  },

  incrementUsage: (limitType: keyof UsageLimits, amount: number = 1) => {
    set(draft => {
      const limit = draft.usageLimits[limitType] as any;
      if (limit && typeof limit === "object" && !limit.unlimited) {
        limit.used += amount;
      }
    });
  },

  resetDailyUsage: () => {
    set(draft => {
      draft.usageLimits.dailyExercises.used = 0;
      draft.usageLimits.aiCoaching.used = 0;
    });
  },

  // Plans & Billing Actions
  loadAvailablePlans: async () => {
    set(draft => {
      draft.loading = true;
      draft.error = null;
    });

    try {
      const plans = await fetchAvailablePlans();

      set(draft => {
        draft.availablePlans = plans;
        draft.loading = false;
      });
    } catch (error) {
      console.error("Error loading plans:", error);
      set(draft => {
        draft.error = "Failed to load plans";
        draft.loading = false;
      });
    }
  },

  createCheckoutSession: async (planId: string): Promise<string> => {
    const { user } = get();
    if (!user?.email) throw new Error("User not authenticated");

    set(draft => {
      draft.loading = true;
      draft.error = null;
    });

    try {
      const checkoutUrl = await createStripeCheckoutSession({
        planId,
        userEmail: user.email,
        userId: user.id,
      });

      set(draft => {
        draft.loading = false;
      });

      // Track checkout initiation
      trackSubscriptionEvent("checkout_initiated", planId);

      return checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      set(draft => {
        draft.error = "Failed to create checkout session";
        draft.loading = false;
      });
      throw error;
    }
  },

  createPortalSession: async (): Promise<string> => {
    const { user } = get();
    if (!user?.email) throw new Error("User not authenticated");

    try {
      const portalUrl = await createStripePortalSession(user.email);
      return portalUrl;
    } catch (error) {
      console.error("Error creating portal session:", error);
      throw error;
    }
  },

  // UI Actions
  showUpgrade: (reason: string, feature?: string) => {
    set(draft => {
      draft.showUpgradePrompt = true;
      draft.upgradeReason = reason;
    });

    // Track upgrade prompt shown
    trackUpgradePromptEvent(reason, feature);
  },

  hideUpgradePrompt: () => {
    set(draft => {
      draft.showUpgradePrompt = false;
      draft.upgradeReason = null;
    });
  },

  clearError: () => {
    set(draft => {
      draft.error = null;
    });
  },

  // Data Management
  reset: () => {
    set(draft => {
      draft.session = null;
      draft.user = null;
      draft.userProfile = null;
      draft.isAuthenticated = false;

      draft.subscription = null;
      draft.isPremium = false;
      draft.isTrialing = false;
      draft.planId = "free";

      draft.usageLimits = DEFAULT_USAGE_LIMITS;

      draft.loading = false;
      draft.error = null;
      draft.showUpgradePrompt = false;
      draft.upgradeReason = null;
    });
  },

  syncWithServer: async () => {
    const { user } = get();
    if (!user) return;

    try {
      await Promise.all([get().loadSubscription(), loadUserProfileFromDB(user.email!)]);
    } catch (error) {
      console.error("Error syncing with server:", error);
    }
  },
});

// Create store with middleware
export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(immer(createAuthStore), {
      name: "omnifit-auth",
      version: 1,
      partialize: state => ({
        userProfile: state.userProfile,
        planId: state.planId,
        usageLimits: state.usageLimits,
      }),
    })
  )
);

// API functions (placeholder implementations)
async function updateUserProfileInDB(profile: UserProfile): Promise<void> {
  console.log("Updating user profile:", profile.id);
}

async function fetchUserSubscription(email: string): Promise<Subscription | null> {
  console.log("Fetching subscription for:", email);
  return null;
}

async function fetchAvailablePlans(): Promise<SubscriptionPlan[]> {
  return SUBSCRIPTION_PLANS;
}

async function createStripeCheckoutSession(params: {
  planId: string;
  userEmail: string;
  userId: string;
}): Promise<string> {
  console.log("Creating checkout session:", params);
  return "https://checkout.stripe.com/session/123";
}

async function createStripePortalSession(email: string): Promise<string> {
  console.log("Creating portal session for:", email);
  return "https://billing.stripe.com/session/123";
}

async function cancelSubscriptionInStripe(subscriptionId: string): Promise<void> {
  console.log("Cancelling subscription:", subscriptionId);
}

async function reactivateSubscriptionInStripe(subscriptionId: string): Promise<void> {
  console.log("Reactivating subscription:", subscriptionId);
}

async function loadUserProfileFromDB(email: string): Promise<UserProfile | null> {
  console.log("Loading user profile:", email);
  return null;
}

// Analytics functions (placeholder)
async function trackSubscriptionEvent(event: string, planId: string): Promise<void> {
  console.log("Subscription event:", event, planId);
}

async function trackUpgradePromptEvent(reason: string, feature?: string): Promise<void> {
  console.log("Upgrade prompt shown:", reason, feature);
}

// Utility function for checking premium limits
export async function checkPremiumLimit(limitType: keyof UsageLimits): Promise<boolean> {
  const canProceed = useAuthStore.getState().checkUsageLimit(limitType);

  if (canProceed) {
    useAuthStore.getState().incrementUsage(limitType);
    return true;
  }

  return false;
}

// Selectors for optimized re-renders
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useCurrentUser = () => useAuthStore(state => state.user);
export const useUserProfile = () => useAuthStore(state => state.userProfile);
export const useIsPremium = () => useAuthStore(state => state.isPremium);
export const useSubscription = () => useAuthStore(state => state.subscription);
export const usePlanId = () => useAuthStore(state => state.planId);
export const useUsageLimits = () => useAuthStore(state => state.usageLimits);
export const useAvailablePlans = () => useAuthStore(state => state.availablePlans);
export const useShowUpgradePrompt = () => useAuthStore(state => state.showUpgradePrompt);
export const useUpgradeReason = () => useAuthStore(state => state.upgradeReason);
export const useAuthLoading = () => useAuthStore(state => state.loading);
export const useAuthError = () => useAuthStore(state => state.error);
