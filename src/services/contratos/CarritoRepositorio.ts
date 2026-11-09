import type { ItemCarrito } from '@/types';

export interface CarritoGuardado {
  items: ItemCarrito[];
  cupon: string | null;
}

/**
 * Persistencia del carrito. Hoy vive en el navegador; a futuro puede sincronizarse
 * con el backend para usuarios con sesión sin que CarritoContext cambie.
 */
export interface CarritoRepositorio {
  obtener(): Promise<CarritoGuardado>;
  guardar(datos: CarritoGuardado): Promise<void>;
}
