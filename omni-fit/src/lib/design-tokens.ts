/**
 * OmniFit Design System Tokens
 * Version 1.0
 * 
 * Système unifié de design tokens pour assurer la cohérence visuelle
 */

// ============================================
// SPACING SYSTEM (base 8px)
// ============================================
export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
} as const;

// ============================================
// BORDER RADIUS (3 valeurs seulement)
// ============================================
export const radius = {
  sm: '0.5rem',    // 8px - Inputs, boutons secondaires
  md: '0.75rem',   // 12px - Cards, boutons primaires (défaut)
  lg: '1rem',      // 16px - Modales, conteneurs principaux
  full: '9999px',  // Avatars, badges
} as const;

// ============================================
// COLORS PALETTE
// ============================================
export const colors = {
  // Primary (Violet)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Secondary (Rose)
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // Gray (pour dark mode)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
} as const;

// ============================================
// GRADIENTS OFFICIELS
// ============================================
export const gradients = {
  primary: 'from-primary-500 to-secondary-500',
  premium: 'from-purple-600 to-pink-600',
  success: 'from-green-500 to-emerald-500',
  warning: 'from-yellow-500 to-orange-500',
  danger: 'from-red-500 to-pink-500',
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  // Font sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// ============================================
// SHADOWS
// ============================================
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
} as const;

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
} as const;

// ============================================
// COMPONENT VARIANTS
// ============================================
export const components = {
  // Buttons
  button: {
    base: `font-semibold transition-all duration-${transitions.fast} active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`,
    sizes: {
      sm: `px-3 py-1.5 text-sm`,
      md: `px-4 py-2 text-base`,
      lg: `px-6 py-3 text-lg`,
    },
    variants: {
      primary: `bg-gradient-to-r ${gradients.primary} text-white shadow-lg hover:shadow-xl`,
      secondary: `bg-gray-800 text-gray-100 border border-gray-700 hover:bg-gray-700`,
      ghost: `bg-transparent text-gray-300 hover:bg-gray-800`,
      danger: `bg-red-600 text-white hover:bg-red-700`,
    },
  },
  
  // Cards
  card: {
    base: `bg-gray-800 border border-gray-700 shadow-lg`,
    padding: spacing.md, // 24px standardisé
    radius: radius.md,   // 12px standardisé
  },
  
  // Modals
  modal: {
    backdrop: `fixed inset-0 bg-black/80 backdrop-blur-sm z-${zIndex.modalBackdrop}`,
    content: `bg-gray-900 border border-gray-800 shadow-2xl z-${zIndex.modal}`,
    radius: radius.lg,
  },
  
  // Inputs
  input: {
    base: `bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500 focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20`,
    radius: radius.sm,
  },
} as const;

// ============================================
// HELPERS
// ============================================
export const utils = {
  // Génère les classes Tailwind pour un gradient
  gradient: (type: keyof typeof gradients) => `bg-gradient-to-r ${gradients[type]}`,
  
  // Génère les classes pour une ombre colorée
  coloredShadow: (color: string, opacity = 25) => `shadow-xl shadow-${color}-500/${opacity}`,
  
  // Classes pour le glassmorphism
  glass: `backdrop-blur-md bg-white/10 border border-white/20`,
  
  // Animation de pulse pour les éléments premium
  premiumPulse: `animate-pulse bg-gradient-to-r ${gradients.premium}`,
} as const;

// Export du type pour TypeScript
export type DesignTokens = {
  spacing: typeof spacing;
  radius: typeof radius;
  colors: typeof colors;
  gradients: typeof gradients;
  typography: typeof typography;
  shadows: typeof shadows;
  transitions: typeof transitions;
  breakpoints: typeof breakpoints;
  zIndex: typeof zIndex;
  components: typeof components;
  utils: typeof utils;
};