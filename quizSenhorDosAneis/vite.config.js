import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // vídeos e áudios nunca viram base64 dentro do JS
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // React e Leaflet em chunks próprios (cache entre deploys)
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
