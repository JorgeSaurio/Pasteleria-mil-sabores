import { CANTIDAD_MAXIMA_ITEM } from '@/config/constantes';
import type { ItemCarrito } from '@/types';
import type { CarritoRepositorio } from '../contratos/CarritoRepositorio';
import { CLAVES, eliminar, guardar, leer } from './storage';

/** Acepta el formato nuevo {productoId, cantidad} y el del proyecto HTML {id, nombre, precio, cantidad...}. */
function normalizarItem(crudo: unknown): ItemCarrito | null {
  if (!crudo || typeof crudo !== 'object') return null;
  const item = crudo as Record<string, unknown>;
  const productoId = String(item.productoId ?? item.id ?? '').trim().toUpperCase();
  const cantidad = Math.floor(Number(item.cantidad));
  if (!productoId || !Number.isFinite(cantidad) || cantidad < 1) return null;
  return { productoId, cantidad: Math.min(cantidad, CANTIDAD_MAXIMA_ITEM) };
}

/**
 * Sin latencia simulada a propósito: el carrito vive en el navegador incluso con backend,
 * y un retardo haría "parpadear" el contador del navbar en cada carga.
 */
export const carritoLocal: CarritoRepositorio = {
  async obtener() {
    const crudo = leer<unknown>(CLAVES.carrito, []);
    const items = Array.isArray(crudo)
      ? crudo.map(normalizarItem).filter((i): i is ItemCarrito => i !== null)
      : [];
    const cupon = leer<string | null>(CLAVES.cupon, null);
    return { items, cupon: typeof cupon === 'string' && cupon ? cupon : null };
  },

  async guardar({ items, cupon }) {
    guardar(CLAVES.carrito, items);
    if (cupon) guardar(CLAVES.cupon, cupon);
    else eliminar(CLAVES.cupon);
  },
};
