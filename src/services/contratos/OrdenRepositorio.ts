import type { FiltroOrdenes, Orden, Pagina } from '@/types';

/** Las órdenes solo se CREAN a través de PagoRepositorio.procesarPago. */
export interface OrdenRepositorio {
  listar(filtro?: FiltroOrdenes): Promise<Pagina<Orden>>;
  obtenerPorId(id: string): Promise<Orden | null>;
  listarPorRun(run: string): Promise<Orden[]>;
}
