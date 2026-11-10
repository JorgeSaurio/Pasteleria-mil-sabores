export type ModoDatos = 'local' | 'http';

const modoDatos: ModoDatos = import.meta.env.VITE_MODO_DATOS === 'http' ? 'http' : 'local';
const latencia = Number(import.meta.env.VITE_LATENCIA_MS ?? 300);

export const entorno = {
  modoDatos,
  apiUrl: (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, ''),
  latenciaMs: Number.isFinite(latencia) && latencia >= 0 ? latencia : 300,
} as const;

if (entorno.modoDatos === 'http' && !entorno.apiUrl) {
  throw new Error('VITE_MODO_DATOS=http requiere definir VITE_API_URL en el archivo .env');
}
