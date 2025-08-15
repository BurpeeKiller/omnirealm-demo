import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    name: 'omni-fit',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 10000,
    // Configuration mémoire optimisée (Option A2)
    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: 6,
        minForks: 1
      }
    },
    maxConcurrency: 2,
    isolate: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '*.config.*',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/test/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})