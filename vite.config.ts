import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Alias "@" → "src" para evitar imports del tipo "../../../".
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Pruebas unitarias (Vitest + Testing Library). Sin red: datos siempre en modo local.
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    env: { VITE_MODO_DATOS: 'local', VITE_LATENCIA_MS: '0', VITE_API_URL: '' },
  },
});
