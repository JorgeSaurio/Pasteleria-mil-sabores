/** Variantes visuales de Bootstrap usadas en alertas y notificaciones. */
export type Variante = 'success' | 'warning' | 'danger' | 'info';

/**
 * Respuesta uniforme de toda operación de escritura.
 * "errores" transporta errores por campo (como responde un backend ante HTTP 400/422).
 */
export interface ResultadoOperacion<T> {
  ok: boolean;
  mensaje: string;
  dato: T | null;
  errores?: Record<string, string>;
}

/** Filtros comunes de listados. Con backend se traducen a query params. */
export interface FiltroListado {
  busqueda?: string;
  categoriaId?: string;
  soloDisponibles?: boolean;
  pagina?: number;
  tamanoPagina?: number;
}

/** Página de resultados. Con 16 productos parece excesivo; con un backend es lo estándar. */
export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  tamanoPagina: number;
}
