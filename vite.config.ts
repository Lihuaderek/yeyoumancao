import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        timeout: 150000 // 150s for AI generation
      }
    }
  },
  preview: { port: 5174, host: true, allowedHosts: true, proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } } },
  build: {
    chunkSizeWarningLimit: 1500,
  }
});
