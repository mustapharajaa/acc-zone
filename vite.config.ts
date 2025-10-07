import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Vercel deployment
  base: process.env.NODE_ENV === 'production' ? '/en/youtube/' : '/',
  
  // Development server settings
  server: {
    port: 3000,
    open: '/en/youtube',
    strictPort: true
  },
  
  // Build settings
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Ensure the base path is correctly set in the built files
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  
  // Environment variables
  define: {
    'process.env': {}
  }
});
