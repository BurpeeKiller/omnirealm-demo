import { motion } from 'framer-motion';

interface OmniFitLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  animated?: boolean;
}

export const OmniFitLogo = ({ size = 'medium', showText = true, animated = true }: OmniFitLogoProps) => {
  const sizes = {
    small: { icon: 32, text: 'text-xl' },
    medium: { icon: 48, text: 'text-2xl' },
    large: { icon: 64, text: 'text-3xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={animated ? { scale: 0.8, rotate: -10 } : {}}
        animate={animated ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.3, type: "spring" }}
        className="relative"
      >
        {/* Icône principale - Haltère stylisé avec gradient */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient pour l'effet premium */}
          <defs>
            <linearGradient id="omnifit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="omnifit-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
          
          {/* Barre centrale de l'haltère */}
          <rect
            x="16"
            y="28"
            width="32"
            height="8"
            rx="4"
            fill="url(#omnifit-gradient)"
          />
          
          {/* Poids gauche */}
          <rect
            x="8"
            y="20"
            width="12"
            height="24"
            rx="6"
            fill="url(#omnifit-gradient)"
          />
          
          {/* Poids droit */}
          <rect
            x="44"
            y="20"
            width="12"
            height="24"
            rx="6"
            fill="url(#omnifit-gradient)"
          />
          
          {/* Effet de brillance sur les poids */}
          <rect
            x="10"
            y="22"
            width="4"
            height="16"
            rx="2"
            fill="url(#omnifit-gradient-light)"
            opacity="0.6"
          />
          <rect
            x="46"
            y="22"
            width="4"
            height="16"
            rx="2"
            fill="url(#omnifit-gradient-light)"
            opacity="0.6"
          />
          
          {/* Badge IA en haut à droite */}
          <circle
            cx="52"
            cy="12"
            r="10"
            fill="white"
            stroke="url(#omnifit-gradient)"
            strokeWidth="2"
          />
          <text
            x="52"
            y="17"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="url(#omnifit-gradient)"
          >
            AI
          </text>
        </svg>
      </motion.div>
      
      {showText && (
        <motion.div
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h1 className={`${currentSize.text} font-bold`}>
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              OmniFit
            </span>
          </h1>
          {size !== 'small' && (
            <p className="text-xs text-gray-400 -mt-1">Coach Fitness IA</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default OmniFitLogo;