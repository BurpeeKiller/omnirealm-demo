/**
 * Utilitaire pour afficher des confettis
 */

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

/**
 * Lance une animation de confettis
 */
export function confetti(options?: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
}) {
  const { particleCount = 50, spread = 45, origin = { x: 0.5, y: 0.5 } } = options || {};

  // Créer un canvas temporaire
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  // Couleurs des confettis
  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
  ];

  // Créer les particules
  const particles: ConfettiParticle[] = [];
  const originX = canvas.width * (origin.x || 0.5);
  const originY = canvas.height * (origin.y || 0.5);

  for (let i = 0; i < particleCount; i++) {
    const angle =
      (Math.PI * 2 * i) / particleCount + ((Math.random() - 0.5) * spread * Math.PI) / 180;
    const velocity = 5 + Math.random() * 5;

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 5,
      life: 100,
    });
  }

  // Animation
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let aliveParticles = 0;

    particles.forEach((particle) => {
      if (particle.life <= 0) return;

      aliveParticles++;
      particle.life--;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // Gravité
      particle.vx *= 0.99; // Friction

      ctx.save();
      ctx.globalAlpha = particle.life / 100;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      ctx.restore();
    });

    if (aliveParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      // Nettoyer
      document.body.removeChild(canvas);
    }
  }

  animate();
}
