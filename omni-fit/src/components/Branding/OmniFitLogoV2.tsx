import { motion } from "framer-motion";

interface OmniFitLogoV2Props {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const OmniFitLogoV2 = ({
  size = "medium",
  showText = true,
  animated = true,
  className = "",
}: OmniFitLogoV2Props) => {
  const sizes = {
    small: { icon: 40, text: "text-xl" },
    medium: { icon: 48, text: "text-2xl" },
    large: { icon: 64, text: "text-3xl" },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        initial={animated ? { scale: 0.8, rotate: -10 } : {}}
        animate={animated ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.3, type: "spring" }}
        className="relative"
      >
        {/* Logo avec palette mint */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradients adaptés à la nouvelle palette */}
          <defs>
            <linearGradient id="omnifit-mint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9B1" />
              <stop offset="100%" stopColor="#00B89F" />
            </linearGradient>
            <linearGradient id="omnifit-mint-light" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D9B1" opacity="0.6" />
              <stop offset="100%" stopColor="#74B9FF" opacity="0.6" />
            </linearGradient>
          </defs>

          {/* Cercle externe */}
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="#FFFFFF"
            stroke="url(#omnifit-mint)"
            strokeWidth="2"
          />

          {/* Cercle interne décoratif */}
          <circle
            cx="32"
            cy="32"
            r="22"
            stroke="url(#omnifit-mint-light)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 3"
          />

          {/* Haltère central stylisé */}
          <g transform="translate(32, 32)">
            {/* Barre centrale */}
            <rect x="-14" y="-3" width="28" height="6" rx="3" fill="url(#omnifit-mint)" />

            {/* Poids gauche */}
            <rect x="-20" y="-8" width="10" height="16" rx="5" fill="url(#omnifit-mint)" />

            {/* Poids droit */}
            <rect x="10" y="-8" width="10" height="16" rx="5" fill="url(#omnifit-mint)" />

            {/* Détails décoratifs sur les poids */}
            <rect x="-18" y="-2" width="2" height="4" rx="1" fill="#FFFFFF" opacity="0.7" />
            <rect x="16" y="-2" width="2" height="4" rx="1" fill="#FFFFFF" opacity="0.7" />
          </g>

          {/* Points orbitaux animés (boules qui tournent) */}
          <g>
            {/* Boule principale */}
            <circle cx="32" cy="6" r="3.5" fill="#00D9B1">
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

            {/* Boule secondaire 1 */}
            <circle cx="58" cy="32" r="3" fill="#74B9FF" opacity="0.8">
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

            {/* Boule secondaire 2 */}
            <circle cx="32" cy="58" r="2.5" fill="#00B894" opacity="0.7">
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

            {/* Boule tertiaire */}
            <circle cx="6" cy="32" r="2" fill="#FDCB6E" opacity="0.6">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 32 32"
                to="-360 32 32"
                dur="30s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      </motion.div>

      {showText && (
        <motion.div
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h1 className={`${currentSize.text} font-bold`}>
            <span className="bg-gradient-to-r from-[#2D3436] via-[#00D9B1] to-[#2D3436] bg-clip-text text-transparent">
              OmniFit
            </span>
          </h1>
          {size !== "small" && <p className="text-xs text-[#2D3436] -mt-1">Coach Fitness IA</p>}
        </motion.div>
      )}
    </div>
  );
};

export default OmniFitLogoV2;
