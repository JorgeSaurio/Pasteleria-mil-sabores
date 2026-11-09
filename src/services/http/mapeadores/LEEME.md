# Mapeadores DTO ↔ dominio

Esta carpeta queda vacía hasta que exista el backend.

Cuando se implemente un repositorio HTTP (p. ej. `productoHttp.ts`), aquí va su mapeador:

```ts
// productoMapeador.ts
import type { Producto } from '@/types';

/** Forma en que el BACKEND envía el producto (acordar con el equipo backend). */
export interface ProductoDto {
  codigo: string;
  nombre: string;
  categoria_id: string;
  precio: number;
  precio_oferta: number | null;
  imagen_url: string;
  descripcion: string;
  stock: number;
  stock_critico: number;
}

export const aProducto = (dto: ProductoDto): Producto => ({
  id: dto.codigo,
  nombre: dto.nombre,
  categoriaId: dto.categoria_id,
  precio: dto.precio,
  precioOferta: dto.precio_oferta ?? undefined,
  imagen: dto.imagen_url,
  descripcion: dto.descripcion,
  stock: dto.stock,
  stockCritico: dto.stock_critico,
});
```

Si el backend cambia el nombre de un campo, se corrige solo aquí: ningún componente se entera.
