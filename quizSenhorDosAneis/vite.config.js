import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
// Demo (VITE_DEMO=true) vai para o GitHub Pages em /<repositório>/ (VITE_BASE, padrão /QuizLotr/)
export default defineConfig(({ mode }) => ({
  base: mode === 'demo' ? process.env.VITE_BASE || '/QuizLotr/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      // "@demo": servidor local só no build da demo; nas outras, um módulo vazio
      '@demo': fileURLToPath(new URL(mode === 'demo' ? './src/demo/localApi.js' : './src/demo/noDemo.js', import.meta.url)),
    },
  },
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
}))
