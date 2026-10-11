import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/Nova-Store/',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Vite 8 uses Rolldown. Strip leading "_" from chunk names so that
    // GitHub Pages (Jekyll) never ignores them.
    rolldownOptions: {
      output: {
        chunkFileNames: (chunk) =>
          `assets/${chunk.name.replace(/^_+/, '')}-[hash].js`,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [fileURLToPath(new URL('./src', import.meta.url))],
      },
    },
  },
})