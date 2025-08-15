import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import path from 'path'

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuration pour build Docker standalone
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Optimisations pour le développement
  swcMinify: true,
  // Désactiver la télémétrie
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  // Désactiver la vérification des types pendant le build (temporaire)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimiser webpack
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        // IMPORTANT: Ignorer tout sauf notre projet
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          // Ignorer le reste du monorepo
          path.resolve(__dirname, '../../**'),
          // Mais PAS notre projet
          '!' + path.resolve(__dirname, './src/**'),
          '!' + path.resolve(__dirname, './app/**'),
          '!' + path.resolve(__dirname, './components/**'),
          '!' + path.resolve(__dirname, './lib/**'),
        ],
      }
    }
    // Résolution des modules optimisée
    config.resolve.symlinks = false
    return config
  },
}

export default nextConfig