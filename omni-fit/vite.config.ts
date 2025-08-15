import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3003,  // Port fixe dédié OmniFit
    cors: true,
    hmr: {
      overlay: false,
      clientPort: 443,
      host: 'localhost',
    },
    strictPort: false,
    allowedHosts: ['.ngrok-free.app', '.ngrok.io', 'localhost'],
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://plausible.io https://*.supabase.co wss://*.supabase.co https://checkout.stripe.com",
        "media-src 'self' blob:",
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        "frame-src 'self' https://checkout.stripe.com https://js.stripe.com",
      ].join('; '),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'chart.js',
      'react-chartjs-2',
      'dexie',
      'zustand',
      'date-fns',
      'lucide-react',
    ],
  },
  build: {
    // Minification optimisée pour éviter erreurs
    minify: 'esbuild', // Alternative plus stable à terser
    target: 'es2020', // Cible moderne pour compatibilité
    rollupOptions: {
      output: {
        manualChunks(id) {
          // DÉSACTIVÉ - Le chunking cause des erreurs avec React
          // Tout sera dans le bundle principal pour éviter les problèmes
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.png', 'icon-192.png', 'icon-512.png', 'sounds/*.mp3'],
      manifest: {
        name: 'OmniFit - Coach Fitness IA Premium',
        short_name: 'OmniFit',
        description: 'Coach fitness IA personnel avec programmes adaptés, suivi intelligent et motivation personnalisée pour atteindre vos objectifs',
        theme_color: '#8B5CF6',
        background_color: '#1F2937',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        id: 'com.omnirealm.omnifit',
        lang: 'fr',
        dir: 'ltr',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['fitness', 'health', 'lifestyle', 'sports'],
        shortcuts: [
          {
            name: 'Ajouter Burpees',
            short_name: 'Burpees',
            description: 'Ajouter rapidement des burpees',
            url: '/?exercise=burpees',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Voir Stats',
            short_name: 'Stats',
            description: 'Consulter vos statistiques',
            url: '/?view=stats',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Réglages',
            short_name: 'Config',
            description: 'Configurer les rappels',
            url: '/?view=settings',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff,woff2,ttf}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        importScripts: ['/sw-custom.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
          {
            urlPattern: /\.(?:mp3|wav|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 jours
              },
            },
          },
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Active le SW en dev pour tests
        type: 'module',
        suppressWarnings: true, // Supprime les warnings en dev
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
