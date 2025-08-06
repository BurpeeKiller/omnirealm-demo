import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3004,  // Port utilisé actuellement
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',  // Backend OmniScan sur 8001
        changeOrigin: true,
        secure: false,
      },
    },
  },
})