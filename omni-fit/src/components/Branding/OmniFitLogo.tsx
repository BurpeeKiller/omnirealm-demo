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
        {/* Logo unifié OmniRealm avec haltère intégré */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradients OmniRealm */}
          <defs>
            <linearGradient id="omnifit-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="omnifit-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          
          {/* Orbite externe (style OmniRealm) */}
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="url(#omnifit-primary)"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
          
          {/* Orbite interne */}
          <circle
            cx="32"
            cy="32"
            r="20"
            stroke="url(#omnifit-secondary)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
            strokeDasharray="4 2"
          />
          
          {/* Haltère central stylisé */}
          <g transform="translate(32, 32)">
            {/* Barre centrale */}
            <rect
              x="-12"
              y="-3"
              width="24"
              height="6"
              rx="3"
              fill="url(#omnifit-primary)"
            />
            
            {/* Poids gauche */}
            <rect
              x="-18"
              y="-8"
              width="8"
              height="16"
              rx="4"
              fill="url(#omnifit-primary)"
            />
            
            {/* Poids droit */}
            <rect
              x="10"
              y="-8"
              width="8"
              height="16"
              rx="4"
              fill="url(#omnifit-primary)"
            />
          </g>
          
          {/* Points orbitaux (satellites) */}
          <circle cx="32" cy="8" r="3" fill="url(#omnifit-primary)" opacity="0.8">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 32 32"
              to="360 32 32"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="56" cy="32" r="2.5" fill="url(#omnifit-secondary)" opacity="0.7">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 32 32"
              to="-360 32 32"
              dur="15s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="32" cy="56" r="2" fill="url(#omnifit-primary)" opacity="0.6">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 32 32"
              to="360 32 32"
              dur="25s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </motion.div>
      
      {showText && (
        <motion.div
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h1 className={`${currentSize.text} font-bold`}>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
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