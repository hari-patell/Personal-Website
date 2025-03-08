import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Set base to root for custom domain
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Copy files from public directory to build output
  publicDir: 'public',
});
