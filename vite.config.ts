import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// Keep dev HMR and sourcemaps for both dev & build
export default defineConfig({
  plugins: [react()],
  cacheDir: '/tmp/vite-cache',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4000,  // Updated to match actual running port
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_PROXY_TARGET || process.env.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,   // <— important for readable stacks
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  },
  define: {
    'process.env': process.env,
  },
})
