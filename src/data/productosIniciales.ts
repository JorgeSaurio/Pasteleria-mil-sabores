import type { Producto } from '@/types';

const IMG = 'https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2F';

const STOCK_NORMAL = 15;
const STOCK_BAJO = 3;
const STOCK_CRITICO = 5;

type ProductoSemilla = Omit<Producto, 'stock' | 'stockCritico'>;

const SEMILLA: ProductoSemilla[] = [
  { id: 'TC001', categoriaId: 'tortas-cuadradas', nombre: 'Torta Cuadrada de Chocolate', precio: 45000, imagen: `${IMG}torta-cuadrada-chocolate.png`, descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.' },
  { id: 'TC002', categoriaId: 'tortas-cuadradas', nombre: 'Torta Cuadrada de Frutas', precio: 50000, precioOferta: 45000, imagen: `${IMG}torta-cuadrada-frutas.jpg`, descripcion: 'Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.' },
  { id: 'TT001', categoriaId: 'tortas-circulares', nombre: 'Torta Circular de Vainilla', precio: 40000, imagen: `${IMG}torta-circular-vainilla.jpg`, descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.' },
  { id: 'TT002', categoriaId: 'tortas-circulares', nombre: 'Torta Circular de Manjar', precio: 42000, imagen: `${IMG}torta-circular-manjar.webp`, descripcion: 'Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.' },
  { id: 'PI001', categoriaId: 'postres-individuales', nombre: 'Mousse de Chocolate', precio: 5000, imagen: `${IMG}mousse-chocolate.webp`, descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.' },
  { id: 'PI002', categoriaId: 'postres-individuales', nombre: 'Tiramisú Clásico', precio: 5500, precioOferta: 4500, imagen: `${IMG}tiramisu.jfif`, descripcion: 'Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.' },
  { id: 'PSA001', categoriaId: 'sin-azucar', nombre: 'Torta Sin Azúcar de Naranja', precio: 48000, imagen: `${IMG}torta-naranja.jpg`, descripcion: 'Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.' },
  { id: 'PSA002', categoriaId: 'sin-azucar', nombre: 'Cheesecake Sin Azúcar', precio: 47000, imagen: `${IMG}cheescake-sin-azucar.jpg`, descripcion: 'Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.' },
  { id: 'PT001', categoriaId: 'tradicional', nombre: 'Empanada de Manzana', precio: 3000, precioOferta: 2500, imagen: `${IMG}empanadas-manzana.jpg`, descripcion: 'Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.' },
  { id: 'PT002', categoriaId: 'tradicional', nombre: 'Tarta de Santiago', precio: 6000, imagen: `${IMG}tarta-de-santiago.jpg`, descripcion: 'Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos.' },
  { id: 'PG001', categoriaId: 'sin-gluten', nombre: 'Brownie Sin Gluten', precio: 4000, imagen: `${IMG}brownie-sin-gluten.jpg`, descripcion: 'Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.' },
  { id: 'PG002', categoriaId: 'sin-gluten', nombre: 'Pan Sin Gluten', precio: 3500, imagen: `${IMG}pan-sin-gluten.jpg`, descripcion: 'Suave y esponjoso, ideal para sandwiches o para acompañar cualquier comida.' },
  { id: 'PV001', categoriaId: 'veganos', nombre: 'Torta Vegana de Chocolate', precio: 50000, imagen: `${IMG}torta-vegana-chocolate.webp`, descripcion: 'Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecto para veganos.' },
  { id: 'PV002', categoriaId: 'veganos', nombre: 'Galletas Veganas de Avena', precio: 4500, precioOferta: 3900, imagen: `${IMG}galletas-veganas-avena.jpg`, descripcion: 'Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.' },
  { id: 'TE001', categoriaId: 'tortas-especiales', nombre: 'Torta Especial de Cumpleaños', precio: 55000, precioOferta: 49900, imagen: `${IMG}torta-cumpleanios.jpg`, descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.' },
  { id: 'TE002', categoriaId: 'tortas-especiales', nombre: 'Torta Especial de Boda', precio: 60000, imagen: `${IMG}torta-boda.jpg`, descripcion: 'Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.' },
];

/**
 * Catálogo semilla. Se usa solo la primera vez (cuando no hay nada guardado).
 * Igual que en el proyecto HTML, uno de cada tres productos parte con stock bajo
 * para que la alerta de stock crítico tenga datos que mostrar.
 */
export const PRODUCTOS_INICIALES: Producto[] = SEMILLA.map((p, indice) => ({
  ...p,
  stock: indice % 3 === 0 ? STOCK_BAJO : STOCK_NORMAL,
  stockCritico: STOCK_CRITICO,
}));
