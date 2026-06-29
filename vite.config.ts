import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'api/**'],
    coverage: {
      provider: 'v8',
      exclude: ['src/main.tsx', 'src/test-setup.ts', 'src/vite-env.d.ts', 'vite.config.ts', 'dist/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
