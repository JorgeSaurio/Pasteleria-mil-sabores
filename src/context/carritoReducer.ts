import { CANTIDAD_MAXIMA_ITEM } from '@/config/constantes';
import type { ItemCarrito, ResultadoCupon } from '@/types';

export interface EstadoCarrito {
  items: ItemCarrito[];
  cupon: ResultadoCupon | null;
  cargado: boolean;
}

export type AccionCarrito =
  | { tipo: 'CARGAR'; items: ItemCarrito[]; cupon: ResultadoCupon | null }
  | { tipo: 'AGREGAR'; productoId: string; cantidad: number }
  | { tipo: 'MODIFICAR'; productoId: string; delta: number }
  | { tipo: 'ELIMINAR'; productoId: string }
  | { tipo: 'QUITAR_INEXISTENTES'; idsValidos: string[] }
  | { tipo: 'VACIAR' }
  | { tipo: 'CUPON'; cupon: ResultadoCupon | null };

export const ESTADO_INICIAL_CARRITO: EstadoCarrito = { items: [], cupon: null, cargado: false };

const acotar = (cantidad: number) => Math.min(Math.max(0, Math.floor(cantidad)), CANTIDAD_MAXIMA_ITEM);

export function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  switch (accion.tipo) {
    case 'CARGAR':
      return { items: accion.items, cupon: accion.cupon, cargado: true };

    case 'AGREGAR': {
      const existente = estado.items.find((i) => i.productoId === accion.productoId);
      const items = existente
        ? estado.items.map((i) =>
            i.productoId === accion.productoId ? { ...i, cantidad: acotar(i.cantidad + accion.cantidad) } : i,
          )
        : [...estado.items, { productoId: accion.productoId, cantidad: acotar(accion.cantidad) }];
      return { ...estado, items };
    }

    case 'MODIFICAR': {
      const items = estado.items
        .map((i) => (i.productoId === accion.productoId ? { ...i, cantidad: acotar(i.cantidad + accion.delta) } : i))
        .filter((i) => i.cantidad > 0);
      return { ...estado, items };
    }

    case 'ELIMINAR':
      return { ...estado, items: estado.items.filter((i) => i.productoId !== accion.productoId) };

    case 'QUITAR_INEXISTENTES': {
      const validos = new Set(accion.idsValidos);
      return { ...estado, items: estado.items.filter((i) => validos.has(i.productoId)) };
    }

    case 'VACIAR':
      return { ...estado, items: [], cupon: null };

    case 'CUPON':
      return { ...estado, cupon: accion.cupon };

    default:
      return estado;
  }
}
