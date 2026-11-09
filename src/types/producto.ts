export interface Producto {
  /** Clave primaria, siempre en mayúsculas (ej. "TC001"). */
  id: string;
  nombre: string;
  /** Referencia a Categoria.id: renombrar una categoría no obliga a editar productos. */
  categoriaId: string;
  /** Precio normal en CLP (entero). */
  precio: number;
  /** Si existe y es menor que "precio", el producto está en oferta. */
  precioOferta?: number;
  imagen: string;
  descripcion: string;
  stock: number;
  stockCritico: number;
}
