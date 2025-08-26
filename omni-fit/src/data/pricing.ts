/**
 * OMNIFI PRICING TIERS - Système SaaS révolutionnaire
 * Optimisé pour conversion rate 8%+ freemium → premium
 */

import { Star, Crown, Shield, Users, Zap, Brain, Video, Trophy, Sparkles } from "lucide-react";

export type PricingTier = "free" | "starter" | "pro" | "team";

export interface PricingFeature {
  name: string;
  description: string;
  included: boolean;
  limit?: string | number;
  badge?: "popular" | "premium" | "exclusive" | "new";
}

export interface PricingPlan {
  id: PricingTier;
  name: string;
  tagline: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  badge?: "popular" | "premium" | "enterprise";
  icon: any; // Lucide icon
  gradient: string;
  features: PricingFeature[];
  cta: {
    text: string;
    variant: "primary" | "secondary" | "premium";
  };
  trialDays?: number;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar: string;
  };
  stats?: {
    conversions: string;
    satisfaction: string;
    timeToValue: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// 🎯 PRICING TIERS - Stratégie de conversion optimisée
// ═══════════════════════════════════════════════════════════════

export const PRICING_PLANS: PricingPlan[] = [
  // 🆓 FREE TIER - Hook addictif avec frustration motivante
  {
    id: "free",
    name: "Gratuit",
    tagline: "Parfait pour découvrir",
    price: {
      monthly: 0,
      yearly: 0,
      currency: "EUR",
    },
    icon: Sparkles,
    gradient: "from-gray-500 to-gray-600",
    features: [
      {
        name: "Exercices quotidiens",
        description: "Juste assez pour créer l'habitude",
        included: true,
        limit: "3/jour",
      },
      {
        name: "Timer basique",
        description: "Sessions courtes pour commencer",
        included: true,
        limit: "max 3 min",
      },
      {
        name: "Statistiques",
        description: "Vos 7 derniers jours",
        included: true,
        limit: "7 jours",
      },
      {
        name: "Rappels simples",
        description: "Notifications de base",
        included: true,
      },
      {
        name: "Coach IA",
        description: "Conseils génériques seulement",
        included: false,
        limit: "Non inclus",
      },
      {
        name: "Exercices premium",
        description: "50+ exercices avancés",
        included: false,
      },
      {
        name: "Analyse posture",
        description: "Corrections temps réel",
        included: false,
      },
    ],
    cta: {
      text: "Commencer gratuitement",
      variant: "secondary",
    },
    testimonial: {
      quote: "J'ai commencé gratuit, en 3 jours j'étais accro !",
      author: "Marie L.",
      role: "Développeuse",
      company: "Startup Tech",
      avatar: "ML",
    },
  },

  // 🌟 STARTER TIER - Sweet spot de conversion
  {
    id: "starter",
    name: "Starter",
    tagline: "Pour des résultats rapides",
    price: {
      monthly: 29,
      yearly: 290, // 2 mois offerts
      currency: "EUR",
    },
    badge: "popular",
    icon: Zap,
    gradient: "from-[#00D9B1] to-[#00B89F]",
    trialDays: 14,
    features: [
      {
        name: "Exercices illimités",
        description: "Plus de frustration, que du plaisir",
        included: true,
        badge: "popular",
      },
      {
        name: "Coach IA conversationnel",
        description: "Motivation personnalisée",
        included: true,
        limit: "10 messages/jour",
        badge: "new",
      },
      {
        name: "20+ exercices premium",
        description: "Variété et progression",
        included: true,
      },
      {
        name: "Plans personnalisés",
        description: "IA adapte selon votre profil",
        included: true,
      },
      {
        name: "Analyse posture",
        description: "Corrections vidéo en temps réel",
        included: true,
        limit: "5/jour",
      },
      {
        name: "Badges et achievements",
        description: "Gamification motivante",
        included: true,
        badge: "premium",
      },
      {
        name: "Stats avancées",
        description: "Historique complet et tendances",
        included: true,
      },
      {
        name: "Mode équipe",
        description: "Collaboration et challenges",
        included: false,
      },
    ],
    cta: {
      text: "Essai gratuit 14 jours",
      variant: "primary",
    },
    testimonial: {
      quote: "En 2 semaines, mes collègues ont vu la différence. Le coach IA est bluffant !",
      author: "Thomas R.",
      role: "Chef de projet",
      company: "ESN",
      avatar: "TR",
    },
    stats: {
      conversions: "94% restent après l'essai",
      satisfaction: "4.9/5 étoiles",
      timeToValue: "Résultats en 3 jours",
    },
  },

  // 💎 PRO TIER - Power users et teams leaders
  {
    id: "pro",
    name: "Pro",
    tagline: "Pour les experts et leaders",
    price: {
      monthly: 99,
      yearly: 990, // 2 mois offerts
      currency: "EUR",
    },
    badge: "premium",
    icon: Crown,
    gradient: "from-purple-600 to-pink-600",
    trialDays: 14,
    features: [
      {
        name: "Tous les exercices",
        description: "100+ exercices + exclusivités PRO",
        included: true,
        badge: "exclusive",
      },
      {
        name: "Coach IA Expert illimité",
        description: "Conversations illimitées + analyse poussée",
        included: true,
        badge: "premium",
      },
      {
        name: "Analyse temps réel illimitée",
        description: "Corrections posture + recommandations",
        included: true,
      },
      {
        name: "White-label",
        description: "Personnalisez pour votre équipe",
        included: true,
        badge: "new",
      },
      {
        name: "Analytics avancées",
        description: "Rapports détaillés + export data",
        included: true,
      },
      {
        name: "API Access",
        description: "Intégrez avec vos outils",
        included: true,
        badge: "exclusive",
      },
      {
        name: "Programmes exclusifs",
        description: "Créés par des coachs pros",
        included: true,
      },
      {
        name: "Support prioritaire",
        description: "Réponse < 2h en semaine",
        included: true,
      },
    ],
    cta: {
      text: "Devenir PRO maintenant",
      variant: "premium",
    },
    testimonial: {
      quote: "L'API nous a permis d'intégrer OmniFit dans notre app RH. Nos 200 employés adorent !",
      author: "Sophie M.",
      role: "DRH",
      company: "Scale-up 200p",
      avatar: "SM",
    },
    stats: {
      conversions: "87% des teams leaders",
      satisfaction: "5/5 étoiles",
      timeToValue: "ROI positif en 1 semaine",
    },
  },

  // 🏢 TEAM TIER - Enterprise solution
  {
    id: "team",
    name: "Team",
    tagline: "Solution entreprise complète",
    price: {
      monthly: 299,
      yearly: 2990, // 2 mois offerts
      currency: "EUR",
    },
    badge: "enterprise",
    icon: Users,
    gradient: "from-blue-700 to-indigo-800",
    trialDays: 30,
    features: [
      {
        name: "Tout du plan PRO",
        description: "Toutes les fonctionnalités premium",
        included: true,
      },
      {
        name: "Multi-utilisateurs",
        description: "Jusqu'à 50 employés inclus",
        included: true,
        limit: "50 users",
      },
      {
        name: "Dashboard RH",
        description: "Analytics wellness pour managers",
        included: true,
        badge: "exclusive",
      },
      {
        name: "Reporting collectif",
        description: "ROI wellness + engagement metrics",
        included: true,
      },
      {
        name: "Intégrations",
        description: "Slack, Teams, Google Workspace",
        included: true,
        badge: "new",
      },
      {
        name: "Challenges équipes",
        description: "Gamification inter-départements",
        included: true,
      },
      {
        name: "Onboarding dédié",
        description: "Formation équipe + setup personnalisé",
        included: true,
      },
      {
        name: "Account manager",
        description: "Support dédié + conseils stratégiques",
        included: true,
        badge: "premium",
      },
    ],
    cta: {
      text: "Demander une démo",
      variant: "premium",
    },
    testimonial: {
      quote: "Nos KPIs wellness ont explosé : +45% satisfaction employés, -30% arrêts maladie.",
      author: "David Chen",
      role: "CHRO",
      company: "Fortune 500",
      avatar: "DC",
    },
    stats: {
      conversions: "ROI moyen 300% en 6 mois",
      satisfaction: "96% renouvellent",
      timeToValue: "Impact visible en 2 semaines",
    },
  },
];

// ═══════════════════════════════════════════════════════════════
// 🎯 UPGRADE TRIGGERS - Moments optimaux pour proposer upgrade
// ═══════════════════════════════════════════════════════════════

export interface UpgradeTrigger {
  id: string;
  condition: string;
  tier: PricingTier;
  message: string;
  urgency: "low" | "medium" | "high";
  personalizedCTA: string;
}

export const UPGRADE_TRIGGERS: UpgradeTrigger[] = [
  {
    id: "daily_limit_reached",
    condition: "user reaches 3 exercises in a day",
    tier: "starter",
    message: "Vous êtes en feu ! 🔥 Débloquéez plus d'exercices pour continuer.",
    urgency: "high",
    personalizedCTA: "Débloquer maintenant (+20 exercices)",
  },
  {
    id: "streak_milestone",
    condition: "user reaches 7-day streak",
    tier: "starter",
    message: "7 jours consécutifs ! Votre motivation mérite le coach IA.",
    urgency: "medium",
    personalizedCTA: "Avoir mon coach personnel",
  },
  {
    id: "premium_exercise_click",
    condition: "user clicks on premium exercise",
    tier: "starter",
    message: "Cet exercice va révolutionner vos pauses !",
    urgency: "high",
    personalizedCTA: "Essai gratuit 14 jours",
  },
  {
    id: "social_proof",
    condition: "user views leaderboard",
    tier: "starter",
    message: "Rejoignez le top 10% avec les fonctionnalités premium.",
    urgency: "medium",
    personalizedCTA: "Débloquer le mode compétition",
  },
  {
    id: "team_request",
    condition: "user shares with colleagues",
    tier: "team",
    message: "Vos collègues adorent ! Organisez des challenges d'équipe.",
    urgency: "low",
    personalizedCTA: "Créer une équipe",
  },
];

// ═══════════════════════════════════════════════════════════════
// 📊 CONVERSION OPTIMIZATION - A/B Testing variants
// ═══════════════════════════════════════════════════════════════

export const AB_TEST_VARIANTS = {
  upgrade_modal: {
    scarcity: {
      title: "Offre limitée - Plus que 48h !",
      description: "Seulement 100 places Starter à -50% cette semaine.",
      cta: "Réserver ma place",
    },
    benefits: {
      title: "Débloquez votre potentiel fitness",
      description: "Coach IA + exercices illimités + analyses posture.",
      cta: "Transformer mes pauses",
    },
    social_proof: {
      title: "Rejoignez 12,847 professionnels épanouis",
      description: '"OmniFit a changé ma relation au travail" - Marie, Dev',
      cta: "Rejoindre la communauté",
    },
  },
  pricing_page: {
    monthly_first: true, // Show monthly prices first
    yearly_discount: true, // Highlight yearly savings
    trial_length: 14, // Days of free trial
  },
};

// ═══════════════════════════════════════════════════════════════
// 🏆 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getPlanById(id: PricingTier): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === id);
}

export function getRecommendedPlan(): PricingPlan {
  return PRICING_PLANS.find(plan => plan.badge === "popular")!;
}

export function calculateYearlySavings(plan: PricingPlan): number {
  const monthlyCost = plan.price.monthly * 12;
  return monthlyCost - plan.price.yearly;
}

export function getTriggersForTier(tier: PricingTier): UpgradeTrigger[] {
  return UPGRADE_TRIGGERS.filter(trigger => trigger.tier === tier);
}

export function formatPrice(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
