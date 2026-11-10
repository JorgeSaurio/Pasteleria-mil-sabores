import { entorno } from '@/config/entorno';
import type { Pagina, ResultadoOperacion } from '@/types';

export function responder<T>(valor: T): Promise<T> {
  const copia = structuredClone(valor);
  return new Promise((resolver) => setTimeout(() => resolver(copia), entorno.latenciaMs));
}

export function paginar<T>(items: T[], pagina = 1, tamanoPagina?: number): Pagina<T> {
  const tamano = tamanoPagina && tamanoPagina > 0 ? tamanoPagina : Math.max(items.length, 1);
  const totalPaginas = Math.max(1, Math.ceil(items.length / tamano));
  const actual = Math.min(Math.max(1, pagina), totalPaginas);
  return {
    items: items.slice((actual - 1) * tamano, actual * tamano),
    total: items.length,
    pagina: actual,
    tamanoPagina: tamano,
  };
}

export function exito<T>(mensaje: string, dato: T): ResultadoOperacion<T> {
  return { ok: true, mensaje, dato };
}

export function fallo<T>(mensaje: string, errores?: Record<string, string>): ResultadoOperacion<T> {
  return { ok: false, mensaje, dato: null, errores };
}

export function crearSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
