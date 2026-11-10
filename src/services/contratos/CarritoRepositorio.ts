import type { ItemCarrito } from '@/types';

export interface CarritoGuardado {
  items: ItemCarrito[];
  cupon: string | null;
}

export interface CarritoRepositorio {
  obtener(): Promise<CarritoGuardado>;
  guardar(datos: CarritoGuardado): Promise<void>;
}
