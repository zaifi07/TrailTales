import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During `npm run dev` the client runs at :5173 and proxies /api to the
// Express server on :5000. In production both are served from the same
// Express process, so /api just resolves on the same origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
