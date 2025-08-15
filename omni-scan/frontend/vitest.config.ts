import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    name: 'omni-scan-frontend',
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
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
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      thresholds: {
        global: {
          lines: 50,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});