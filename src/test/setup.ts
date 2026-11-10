import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cada prueba parte con DOM y almacenamiento limpios: independientes del orden de ejecución.
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// jsdom no implementa window.scrollTo (lo usan TiendaLayout y AdminLayout al cambiar de ruta)
// y sin esto imprime "Not implemented: window.scrollTo" en consola.
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });
