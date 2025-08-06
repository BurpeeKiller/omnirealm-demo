'use client'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  variant?: 'color' | 'grayscale' | 'monochrome'
  className?: string
}

export function Logo({ size = 'md', animate = true, variant = 'color', className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const viewBoxSizes = {
    sm: '38',
    md: '50',
    lg: '68'
  }

  const viewBox = `0 0 ${viewBoxSizes[size]} ${viewBoxSizes[size]}`
  const center = parseInt(viewBoxSizes[size]) / 2
  const mainRadius = size === 'sm' ? 6 : size === 'md' ? 8 : 12
  const satelliteRadius = size === 'sm' ? 3 : size === 'md' ? 5 : 7
  
  // Positions des satellites en cercle
  const colorSatellites = [
    { angle: 0, color: '#3B82F6' },     // Haut - Bleu
    { angle: 60, color: '#8B5CF6' },    // Haut droite - Violet
    { angle: 120, color: '#EC4899' },   // Bas droite - Rose
    { angle: 180, color: '#10B981' },   // Bas - Vert
    { angle: 240, color: '#F59E0B' },   // Bas gauche - Orange
    { angle: 300, color: '#6366F1' },   // Haut gauche - Indigo
  ]
  
  const grayscaleSatellites = [
    { angle: 0, color: '#1F2937' },     // Gris foncé
    { angle: 60, color: '#374151' },    // Gris
    { angle: 120, color: '#6B7280' },   // Gris moyen
    { angle: 180, color: '#9CA3AF' },   // Gris clair
    { angle: 240, color: '#4B5563' },   // Gris intermédiaire
    { angle: 300, color: '#111827' },   // Presque noir
  ]
  
  const monochromeSatellites = colorSatellites.map(sat => ({ ...sat, color: '#000000' }))
  
  const satellites = variant === 'grayscale' ? grayscaleSatellites : 
                    variant === 'monochrome' ? monochromeSatellites : 
                    colorSatellites

  const satelliteDistance = size === 'sm' ? 12 : size === 'md' ? 15 : 20

  return (
    <svg 
      className={`${sizes[size]} ${className}`}
      viewBox={viewBox}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
        {/* Animations */}
        <style>
          {`
            @keyframes orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse-scale {
              0%, 100% { 
                transform: scale(1);
              }
              50% { 
                transform: scale(1);
              }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-1px); }
            }
            @keyframes glow {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 1; }
            }
            .orbit-group {
              transform-origin: 0 0;
              animation: orbit 30s linear infinite;
            }
            .satellite {
              animation: glow 3s ease-in-out infinite;
            }
            .satellite:nth-child(2) { animation-delay: 0.5s; }
            .satellite:nth-child(3) { animation-delay: 1s; }
            .satellite:nth-child(4) { animation-delay: 1.5s; }
            .satellite:nth-child(5) { animation-delay: 2s; }
            .satellite:nth-child(6) { animation-delay: 2.5s; }
            .center-pulse {
              transform-origin: center;
              animation: pulse-scale 3s ease-in-out infinite;
            }
          `}
        </style>
        {/* Satellites qui tournent */}
        {satellites.map((sat, idx) => {
          const baseX = satelliteDistance * Math.cos((sat.angle - 90) * Math.PI / 180)
          const baseY = satelliteDistance * Math.sin((sat.angle - 90) * Math.PI / 180)
          
          return (
            <g key={idx} transform={`translate(${center}, ${center})`}>
              <g className={animate ? "orbit-group" : ""}>
                {/* Cercle satellite */}
                <circle 
                  className={animate ? "satellite" : ""}
                  cx={baseX}
                  cy={baseY}
                  r={satelliteRadius}
                  fill={sat.color}
                  opacity={variant === 'monochrome' ? '1' : '0.8'}
                />
              </g>
            </g>
          )
        })}
        
        {/* Cercle central fixe par-dessus tout */}
        <circle 
          cx={center}
          cy={center}
          r={mainRadius}
          fill="#000000"
          opacity="1"
        />
        
        <defs>
          {/* Gradients supprimés - cercle central toujours noir */}
        </defs>
      </svg>
  )
}