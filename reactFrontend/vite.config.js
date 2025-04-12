import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      'react-refresh/runtime': '@vitejs/plugin-react/refresh'
    }
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material']
  }
});
