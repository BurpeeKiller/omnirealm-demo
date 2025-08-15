/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true, // Activer la compression GZIP
  output: 'standalone', // Nécessaire pour Docker
  // ESLint et TypeScript activés pour garantir la qualité
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Configuration d'optimisation d'image pour le mode dynamique
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    // Configuration expérimentale compatible Next.js 14
  },
};

module.exports = nextConfig;
