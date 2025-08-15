import { ABTest } from '@/hooks/useABTest';

/**
 * A/B Test configurations for OmniRealm
 * 
 * Test naming convention: {product}_{element}_{version}
 * Variant naming: control, variant_a, variant_b, etc.
 */

// OmniScan Hero Section Test
export const omniScanHeroTest: ABTest = {
  id: 'omniscan_hero_messaging',
  name: 'OmniScan Hero Messaging Test',
  enabled: true,
  variants: [
    {
      id: 'control',
      name: 'OCR Intelligent (Control)',
      weight: 50,
      config: {
        headline: 'OCR Intelligent avec IA',
        subheadline: 'Transformez instantanément vos documents papier, PDF et images en données structurées exploitables. Notre IA comprend le contexte et organise automatiquement vos informations.',
        ctaPrimary: 'Essayer Gratuitement',
        ctaSecondary: 'Découvrir les fonctionnalités'
      }
    },
    {
      id: 'variant_a',
      name: 'Extraction Automatique (Variant A)',
      weight: 50,
      config: {
        headline: 'Extraction Automatique de Données',
        subheadline: 'Numérisez et extrayez automatiquement le contenu de tous vos documents en quelques secondes. Fini la saisie manuelle, notre IA fait tout pour vous.',
        ctaPrimary: 'Démarrer l\'Extraction',
        ctaSecondary: 'Voir comment ça marche'
      }
    }
  ]
};

// OmniScan CTA Color Test
export const omniScanCtaTest: ABTest = {
  id: 'omniscan_cta_style',
  name: 'OmniScan CTA Style Test',
  enabled: true,
  variants: [
    {
      id: 'control',
      name: 'Blue CTA (Control)',
      weight: 33,
      config: {
        primaryColor: 'bg-blue-600 hover:bg-blue-700',
        urgencyText: null
      }
    },
    {
      id: 'variant_a',
      name: 'Green CTA (Variant A)',
      weight: 33,
      config: {
        primaryColor: 'bg-green-600 hover:bg-green-700',
        urgencyText: null
      }
    },
    {
      id: 'variant_b',
      name: 'Orange with Urgency (Variant B)',
      weight: 34,
      config: {
        primaryColor: 'bg-orange-600 hover:bg-orange-700',
        urgencyText: '⚡ 5 scans gratuits - Sans engagement'
      }
    }
  ]
};

// OmniScan Pricing Display Test
export const omniScanPricingTest: ABTest = {
  id: 'omniscan_pricing_display',
  name: 'OmniScan Pricing Display Test',
  enabled: true,
  variants: [
    {
      id: 'control',
      name: 'Standard Pricing (Control)',
      weight: 50,
      config: {
        showDiscount: false,
        priceDisplay: 'monthly',
        urgencyBanner: null,
        popularBadge: 'POPULAIRE'
      }
    },
    {
      id: 'variant_a',
      name: 'Discount & Urgency (Variant A)',
      weight: 50,
      config: {
        showDiscount: true,
        priceDisplay: 'monthly',
        urgencyBanner: '🔥 Offre limitée - 30% de réduction les 3 premiers mois',
        popularBadge: 'MEILLEURE OFFRE',
        discountPrice: '34€',
        originalPrice: '49€'
      }
    }
  ]
};

// OmniScan Social Proof Test
export const omniScanSocialProofTest: ABTest = {
  id: 'omniscan_social_proof',
  name: 'OmniScan Social Proof Test',
  enabled: true,
  variants: [
    {
      id: 'control',
      name: 'No Social Proof (Control)',
      weight: 33,
      config: {
        showTestimonials: false,
        showStats: false
      }
    },
    {
      id: 'variant_a',
      name: 'Usage Stats (Variant A)',
      weight: 33,
      config: {
        showTestimonials: false,
        showStats: true,
        stats: {
          users: '5,000+',
          documents: '250,000+',
          satisfaction: '98%'
        }
      }
    },
    {
      id: 'variant_b',
      name: 'Customer Testimonials (Variant B)',
      weight: 34,
      config: {
        showTestimonials: true,
        showStats: false,
        testimonials: [
          {
            text: "OmniScan a révolutionné ma gestion documentaire. Je gagne 2h par jour !",
            author: "Marie L.",
            role: "Comptable"
          },
          {
            text: "L'IA comprend parfaitement mes factures complexes. Impressionnant.",
            author: "Pierre D.",
            role: "Entrepreneur"
          }
        ]
      }
    }
  ]
};

// OmniTask Hero Test (pour plus tard)
export const omniTaskHeroTest: ABTest = {
  id: 'omnitask_hero_messaging',
  name: 'OmniTask Hero Messaging Test',
  enabled: false, // Disabled for now
  variants: [
    {
      id: 'control',
      name: 'Gestion Tâches IA (Control)',
      weight: 50,
      config: {
        headline: 'Gestion de Tâches avec IA',
        subheadline: 'Organisez votre travail intelligemment avec l\'aide de l\'IA. Priorisez automatiquement, planifiez optimalement.',
        ctaPrimary: 'Essayer Gratuitement'
      }
    },
    {
      id: 'variant_a',
      name: 'Productivité Maximale (Variant A)',
      weight: 50,
      config: {
        headline: 'Productivité Maximale avec IA',
        subheadline: 'Doublez votre efficacité grâce à l\'IA qui organise, priorise et planifie vos tâches automatiquement.',
        ctaPrimary: 'Booster ma Productivité'
      }
    }
  ]
};

// OmniFit Hero Test (pour plus tard)
export const omniFitHeroTest: ABTest = {
  id: 'omnifit_hero_messaging',
  name: 'OmniFit Hero Messaging Test',
  enabled: false, // Disabled for now
  variants: [
    {
      id: 'control',
      name: 'Coach Fitness IA (Control)',
      weight: 50,
      config: {
        headline: 'Votre Coach Fitness Personnel',
        subheadline: 'Atteignez vos objectifs fitness avec un coaching personnalisé par IA. Programmes adaptatifs et motivation constante.',
        ctaPrimary: 'Commencer l\'Entraînement'
      }
    },
    {
      id: 'variant_a',
      name: 'Transformation Physique (Variant A)',
      weight: 50,
      config: {
        headline: 'Transformez Votre Physique',
        subheadline: 'Obtenez le corps de vos rêves avec nos programmes IA personnalisés. Résultats garantis en 30 jours.',
        ctaPrimary: 'Démarrer ma Transformation'
      }
    }
  ]
};

/**
 * All active A/B tests
 */
export const activeTests: ABTest[] = [
  omniScanHeroTest,
  omniScanCtaTest,
  omniScanPricingTest,
  omniScanSocialProofTest
];

/**
 * Tests by product
 */
export const testsByProduct = {
  omniscan: [
    omniScanHeroTest,
    omniScanCtaTest,
    omniScanPricingTest,
    omniScanSocialProofTest
  ],
  omnitask: [omniTaskHeroTest],
  omnifit: [omniFitHeroTest]
};

/**
 * Conversion goals for tracking
 */
export const conversionGoals = {
  // Primary conversions
  SIGNUP: 'signup',
  TRIAL_START: 'trial_start',
  SUBSCRIPTION: 'subscription',
  
  // Micro conversions
  CTA_CLICK: 'cta_click',
  DEMO_REQUEST: 'demo_request',
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  PRICING_VIEW: 'pricing_view',
  FEATURE_VIEW: 'feature_view',
  
  // Engagement
  SCROLL_50: 'scroll_50',
  SCROLL_90: 'scroll_90',
  TIME_ON_PAGE_60S: 'time_on_page_60s',
  TIME_ON_PAGE_180S: 'time_on_page_180s'
};