export interface Producto {
  id: string;
  nombre: string;
  categoriaId: string;
  precio: number;
  precioOferta?: number;
  imagen: string;
  descripcion: string;
  stock: number;
  stockCritico: number;
}
