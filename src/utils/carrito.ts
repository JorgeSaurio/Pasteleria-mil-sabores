import type { LineaCarrito, Producto } from '@/types';

/**
 * Reglas de cálculo del carrito como funciones puras.
 * En el frontend sirven para MOSTRAR una estimación; el total oficial lo calcula
 * quien procesa el pago (repositorio local hoy, backend mañana).
 */

/** Un producto está en oferta si tiene precioOferta válido y menor al precio normal. */
export function estaEnOferta(producto: Producto): boolean {
  return (
    typeof producto.precioOferta === 'number' &&
    producto.precioOferta > 0 &&
    producto.precioOferta < producto.precio
  );
}

/** Precio que realmente se cobra hoy. */
export function precioVigente(producto: Producto): number {
  return estaEnOferta(producto) ? (producto.precioOferta as number) : producto.precio;
}

export function tieneStock(producto: Producto, cantidad = 1): boolean {
  return Number.isFinite(cantidad) && producto.stock >= cantidad;
}

export function esStockCritico(producto: Producto): boolean {
  return producto.stock <= producto.stockCritico;
}

export function calcularSubtotal(lineas: Pick<LineaCarrito, 'subtotal'>[]): number {
  return lineas.reduce((acumulado, linea) => acumulado + linea.subtotal, 0);
}

/** porcentaje en formato 0..1 (0.1 = 10 %). */
export function calcularDescuento(subtotal: number, porcentaje: number): number {
  if (porcentaje <= 0) return 0;
  return Math.round(subtotal * porcentaje);
}

export function calcularTotal(subtotal: number, descuento: number): number {
  return Math.max(0, subtotal - descuento);
}
