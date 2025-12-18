import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // Fix cho SockJS: define global = window
    global: 'window',
  },
  resolve: {
    alias: {
      // Polyfills cho Node.js modules trong browser
      util: 'rollup-plugin-node-polyfills/polyfills/util',
    },
  },
})

