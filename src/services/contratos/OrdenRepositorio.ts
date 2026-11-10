import type { FiltroOrdenes, Orden, Pagina } from '@/types';

export interface OrdenRepositorio {
  listar(filtro?: FiltroOrdenes): Promise<Pagina<Orden>>;
  obtenerPorId(id: string): Promise<Orden | null>;
  listarPorRun(run: string): Promise<Orden[]>;
}
