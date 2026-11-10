import type { FiltroListado, Pagina, Producto, ResultadoOperacion } from '@/types';

export interface ProductoRepositorio {
  listar(filtro?: FiltroListado): Promise<Pagina<Producto>>;
  obtenerPorId(id: string): Promise<Producto | null>;
  obtenerPorIds(ids: string[]): Promise<Producto[]>;
  crear(datos: Producto): Promise<ResultadoOperacion<Producto>>;
  actualizar(datos: Producto): Promise<ResultadoOperacion<Producto>>;
  eliminar(id: string): Promise<ResultadoOperacion<null>>;
  listarOfertas(): Promise<Producto[]>;
  listarCriticos(): Promise<Producto[]>;
}
