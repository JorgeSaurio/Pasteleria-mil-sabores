import type { FiltroListado, Pagina, Producto, ResultadoOperacion } from '@/types';

/**
 * Contrato de acceso a productos. La UI depende SOLO de esta interfaz.
 * Implementaciones: services/local/productoLocal.ts (hoy) y services/http/productoHttp.ts (backend).
 */
export interface ProductoRepositorio {
  listar(filtro?: FiltroListado): Promise<Pagina<Producto>>;
  obtenerPorId(id: string): Promise<Producto | null>;
  /** Para armar las líneas del carrito en una sola llamada. */
  obtenerPorIds(ids: string[]): Promise<Producto[]>;
  crear(datos: Producto): Promise<ResultadoOperacion<Producto>>;
  actualizar(datos: Producto): Promise<ResultadoOperacion<Producto>>;
  eliminar(id: string): Promise<ResultadoOperacion<null>>;
  listarOfertas(): Promise<Producto[]>;
  listarCriticos(): Promise<Producto[]>;
}
