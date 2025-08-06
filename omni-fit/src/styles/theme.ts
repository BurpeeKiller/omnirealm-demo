// Thème unifié pour l'application OmniFit
// Palette moderne et professionnelle basée sur les tendances 2024

export const theme = {
  // Couleurs principales - Gradient sophistiqué violet/indigo
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // Couleur principale
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Couleurs secondaires - Turquoise moderne pour contraste
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Couleur secondaire
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  
  // Couleurs d'accent - Rose énergique
  accent: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Couleur d'accent
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // Couleurs neutres - Gris moderne
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
  
  // Couleurs sémantiques
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  
  warning: {
    light: '#fde047',
    DEFAULT: '#eab308',
    dark: '#ca8a04',
  },
  
  error: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  
  info: {
    light: '#93c5fd',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },
  
  // Gradients principaux
  gradients: {
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    secondary: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)',
    accent: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
    hero: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  },
  
  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Bordures arrondies
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    DEFAULT: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
};

// Classes CSS utilitaires pour les gradients
export const gradientClasses = {
  primary: 'bg-gradient-to-r from-purple-600 to-indigo-600',
  secondary: 'bg-gradient-to-r from-teal-600 to-teal-700',
  accent: 'bg-gradient-to-r from-pink-600 to-rose-600',
  hero: 'bg-gradient-to-r from-purple-600 to-pink-600',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
  success: 'bg-gradient-to-r from-green-600 to-green-700',
  warning: 'bg-gradient-to-r from-amber-600 to-amber-700',
  error: 'bg-gradient-to-r from-red-600 to-red-700',
};

// Styles de boutons harmonisés
export const buttonStyles = {
  primary: `
    bg-gradient-to-r from-purple-600 to-indigo-600 
    hover:from-purple-700 hover:to-indigo-700 
    text-white font-semibold 
    shadow-lg hover:shadow-xl 
    transform transition-all duration-200 
    hover:scale-[1.02] active:scale-[0.98]
  `,
  secondary: `
    bg-gradient-to-r from-teal-600 to-teal-700 
    hover:from-teal-700 hover:to-teal-800 
    text-white font-semibold 
    shadow-md hover:shadow-lg 
    transform transition-all duration-200 
    hover:scale-[1.02] active:scale-[0.98]
  `,
  accent: `
    bg-gradient-to-r from-pink-600 to-rose-600 
    hover:from-pink-700 hover:to-rose-700 
    text-white font-semibold 
    shadow-md hover:shadow-lg 
    transform transition-all duration-200 
    hover:scale-[1.02] active:scale-[0.98]
  `,
  ghost: `
    bg-transparent 
    hover:bg-gray-100 dark:hover:bg-gray-800 
    text-gray-700 dark:text-gray-300 
    transition-colors duration-200
  `,
  danger: `
    bg-gradient-to-r from-red-600 to-red-700 
    hover:from-red-700 hover:to-red-800 
    text-white font-semibold 
    shadow-md hover:shadow-lg 
    transform transition-all duration-200 
    hover:scale-[1.02] active:scale-[0.98]
  `,
};

// Export des couleurs Tailwind personnalisées
export const tailwindColors = {
  primary: theme.primary,
  secondary: theme.secondary,
  accent: theme.accent,
};