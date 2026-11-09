import type { Orden, ResultadoCupon, ResultadoOperacion, SolicitudPago } from '@/types';

/**
 * Reglas que en producción viven OBLIGATORIAMENTE en el servidor:
 * precios, cupones, stock y numeración de órdenes.
 */
export interface PagoRepositorio {
  validarCupon(codigo: string): Promise<ResultadoCupon>;
  /**
   * Devuelve siempre la orden creada (pagada o rechazada) en "dato" cuando la solicitud
   * es procesable; ok=true solo si quedó pagada.
   */
  procesarPago(solicitud: SolicitudPago): Promise<ResultadoOperacion<Orden>>;
}
