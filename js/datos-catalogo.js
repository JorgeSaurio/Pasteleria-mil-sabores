const CATALOGO_PRODUCTOS = [
  {
    id: "TC001",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Chocolate",
    precio: 45000,
    imagen: "logo.jpeg",
    descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales."
  },
  {
    id: "TC002",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Frutas",
    precio: 50000,
    imagen: "logo.jpeg",
    descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones."
  },
  {
    id: "TT001",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Vainilla",
    precio: 40000,
    imagen: "logo.jpeg",
    descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión."
  },
  {
    id: "TT002",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Manjar",
    precio: 42000,
    imagen: "logo.jpeg",
    descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos."
  },
  {
    id: "PI001",
    categoria: "Postres Individuales",
    nombre: "Mousse de Chocolate",
    precio: 5000,
    imagen: "logo.jpeg",
    descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate."
  },
  {
    id: "PI002",
    categoria: "Postres Individuales",
    nombre: "Tiramisú Clásico",
    precio: 5500,
    imagen: "logo.jpeg",
    descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida."
  },
  {
    id: "PSA001",
    categoria: "Productos Sin Azúcar",
    nombre: "Torta Sin Azúcar de Naranja",
    precio: 48000,
    imagen: "logo.jpeg",
    descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables."
  },
  {
    id: "PSA002",
    categoria: "Productos Sin Azúcar",
    nombre: "Cheesecake Sin Azúcar",
    precio: 47000,
    imagen: "logo.jpeg",
    descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa."
  },
  {
    id: "PT001",
    categoria: "Pastelería Tradicional",
    nombre: "Empanada de Manzana",
    precio: 3000,
    imagen: "logo.jpeg",
    descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda."
  },
  {
    id: "PT002",
    categoria: "Pastelería Tradicional",
    nombre: "Tarta de Santiago",
    precio: 6000,
    imagen: "logo.jpeg",
    descripcion: "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos."
  },
  {
    id: "PG001",
    categoria: "Productos Sin Gluten",
    nombre: "Brownie Sin Gluten",
    precio: 4000,
    imagen: "logo.jpeg",
    descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor."
  },
  {
    id: "PG002",
    categoria: "Productos Sin Gluten",
    nombre: "Pan Sin Gluten",
    precio: 3500,
    imagen: "logo.jpeg",
    descripcion: "Suave y esponjoso, ideal para sandwiches o para acompañar cualquier comida."
  },
  {
    id: "PV001",
    categoria: "Productos Veganos",
    nombre: "Torta Vegana de Chocolate",
    precio: 50000,
    imagen: "logo.jpeg",
    descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos."
  },
  {
    id: "PV002",
    categoria: "Productos Veganos",
    nombre: "Galletas Veganas de Avena",
    precio: 4500,
    imagen: "logo.jpeg",
    descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano."
  },
  {
    id: "TE001",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Cumpleaños",
    precio: 55000,
    imagen: "logo.jpeg",
    descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos."
  },
  {
    id: "TE002",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Boda",
    precio: 60000,
    imagen: "logo.jpeg",
    descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda."
  }
];


/** Categorías únicas del catálogo, en orden de aparición */
const CATEGORIAS_PRODUCTOS = [...new Set(CATALOGO_PRODUCTOS.map(p => p.categoria))];


/** Imagen usada cuando un producto no declara una válida */
const IMAGEN_POR_DEFECTO = "logo.jpeg";


/**
 * Busca un producto del catálogo por su id
 * @param {string} id
 * @returns {object|null} El producto o null si no existe
 */
function obtenerProductoPorId(id) {
  if (!id) return null;
  return CATALOGO_PRODUCTOS.find(p => p.id === id) || null;
}



