export type Variante = 'success' | 'warning' | 'danger' | 'info';

export interface ResultadoOperacion<T> {
  ok: boolean;
  mensaje: string;
  dato: T | null;
  errores?: Record<string, string>;
}

export interface FiltroListado {
  busqueda?: string;
  categoriaId?: string;
  soloDisponibles?: boolean;
  pagina?: number;
  tamanoPagina?: number;
}

export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  tamanoPagina: number;
}
