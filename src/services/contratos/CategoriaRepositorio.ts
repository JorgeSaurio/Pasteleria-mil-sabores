import type { Categoria, ResultadoOperacion } from '@/types';

export interface CategoriaRepositorio {
  listar(): Promise<Categoria[]>;
  obtenerPorId(id: string): Promise<Categoria | null>;
  crear(datos: Omit<Categoria, 'id'>): Promise<ResultadoOperacion<Categoria>>;
  actualizar(datos: Categoria): Promise<ResultadoOperacion<Categoria>>;
  eliminar(id: string): Promise<ResultadoOperacion<null>>;
}
