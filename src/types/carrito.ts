import type { Producto } from './producto';

/** Lo único que se persiste del carrito: así refleja al instante precios y stock actuales. */
export interface ItemCarrito {
  productoId: string;
  cantidad: number;
}

/** Dato DERIVADO que consume la UI (item + producto actual). Nunca se persiste. */
export interface LineaCarrito extends ItemCarrito {
  producto: Producto;
  precioUnitario: number;
  subtotal: number;
}
