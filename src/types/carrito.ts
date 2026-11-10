import type { Producto } from './producto';

export interface ItemCarrito {
  productoId: string;
  cantidad: number;
}

export interface LineaCarrito extends ItemCarrito {
  producto: Producto;
  precioUnitario: number;
  subtotal: number;
}
