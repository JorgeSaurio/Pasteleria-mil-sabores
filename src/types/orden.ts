import type { ItemCarrito } from './carrito';

export type EstadoOrden = 'pagada' | 'rechazada';

export type MedioPago = 'tarjeta' | 'transferencia' | 'prueba-rechazo';

/** Copia histórica: la boleta conserva el precio pagado aunque el catálogo cambie. */
export interface ItemOrden {
  productoId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  imagen: string;
}

export interface DatosCliente {
  nombre: string;
  apellidos: string;
  email: string;
}

export interface DireccionEnvio {
  calle: string;
  departamento?: string;
  region: string;
  comuna: string;
  indicaciones?: string;
}

export interface Orden {
  id: string;
  numero: number;
  fecha: string;
  runCliente?: string;
  cliente: DatosCliente;
  envio: DireccionEnvio;
  items: ItemOrden[];
  cupon?: string;
  subtotal: number;
  descuento: number;
  total: number;
  medioPago: MedioPago;
  estado: EstadoOrden;
  motivoRechazo?: string;
}

/**
 * Lo que el frontend envía para pagar: SOLO decisiones del cliente.
 * No lleva precios ni total: los calcula quien procesa el pago (hoy el repositorio local, mañana el backend).
 */
export interface SolicitudPago {
  items: ItemCarrito[];
  cupon?: string;
  cliente: DatosCliente;
  envio: DireccionEnvio;
  medioPago: MedioPago;
  runCliente?: string;
}

export interface ResultadoCupon {
  valido: boolean;
  codigo: string;
  porcentaje: number;
  mensaje: string;
}

export interface FiltroOrdenes {
  estado?: EstadoOrden;
  runCliente?: string;
  pagina?: number;
  tamanoPagina?: number;
}
