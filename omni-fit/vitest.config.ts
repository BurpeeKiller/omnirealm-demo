import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['is-stream'],
  },
  ssr: {
    noExternal: ['is-stream'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Configuration optimisée pour WSL
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Timeout réduit mais suffisant
    testTimeout: 10000,
    // Isoler complètement les tests
    isolate: true,
    // Une seule tâche à la fois pour éviter OOM
    maxConcurrency: 1,
    minThreads: 1,
    maxThreads: 1,
    // Nettoyer après chaque test
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*', 'dist/'],
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
});
