import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,  // Port unifié pour OmniScan
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',  // Backend OmniScan sur 8001
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'utils': ['axios', 'clsx', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})