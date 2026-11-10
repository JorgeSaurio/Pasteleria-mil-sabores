import type { Orden, ResultadoCupon, ResultadoOperacion, SolicitudPago } from '@/types';

export interface PagoRepositorio {
  validarCupon(codigo: string): Promise<ResultadoCupon>;
  procesarPago(solicitud: SolicitudPago): Promise<ResultadoOperacion<Orden>>;
}
