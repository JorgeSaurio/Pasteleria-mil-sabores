
const CLAVE_INVENTARIO = "mil_sabores_inventario";

/**
 * Imagen usada cuando un producto no declara una válida. Es una URL absoluta a
 propósito: el mismo valor sirve desde la raíz y desde /admin/, sin rutas relativas.
 */
const IMAGEN_POR_DEFECTO = "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Flogo.jpeg";

const STOCK_CRITICO_POR_DEFECTO = 5;
const STOCK_POR_DEFECTO = 15;
const STOCK_INICIAL_BAJO = 3;

/**
 * Catálogo semilla. Solo se usa la primera vez que se visita el sitio
 * (cuando aún no existe nada en localStorage); después manda el inventario.
 */
const CATALOGO_INICIAL = [
  {
    id: "TC001",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Chocolate",
    precio: 45000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-cuadrada-chocolate.png",
    descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales."
  },
  {
    id: "TC002",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Frutas",
    precio: 50000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-cuadrada-frutas.jpg",
    descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones."
  },
  {
    id: "TT001",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Vainilla",
    precio: 40000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-circular-vainilla.jpg",
    descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión."
  },
  {
    id: "TT002",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Manjar",
    precio: 42000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-circular-manjar.webp",
    descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos."
  },
  {
    id: "PI001",
    categoria: "Postres Individuales",
    nombre: "Mousse de Chocolate",
    precio: 5000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Fmousse-chocolate.webp",
    descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate."
  },
  {
    id: "PI002",
    categoria: "Postres Individuales",
    nombre: "Tiramisú Clásico",
    precio: 5500,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftiramisu.jfif",
    descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida."
  },
  {
    id: "PSA001",
    categoria: "Productos Sin Azúcar",
    nombre: "Torta Sin Azúcar de Naranja",
    precio: 48000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-naranja.jpg",
    descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables."
  },
  {
    id: "PSA002",
    categoria: "Productos Sin Azúcar",
    nombre: "Cheesecake Sin Azúcar",
    precio: 47000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Fcheescake-sin-azucar.jpg",
    descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa."
  },
  {
    id: "PT001",
    categoria: "Pastelería Tradicional",
    nombre: "Empanada de Manzana",
    precio: 3000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Fempanadas-manzana.jpg",
    descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda."
  },
  {
    id: "PT002",
    categoria: "Pastelería Tradicional",
    nombre: "Tarta de Santiago",
    precio: 6000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftarta-de-santiago.jpg",
    descripcion: "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos."
  },
  {
    id: "PG001",
    categoria: "Productos Sin Gluten",
    nombre: "Brownie Sin Gluten",
    precio: 4000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Fbrownie-sin-gluten.jpg",
    descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor."
  },
  {
    id: "PG002",
    categoria: "Productos Sin Gluten",
    nombre: "Pan Sin Gluten",
    precio: 3500,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Fpan-sin-gluten.jpg",
    descripcion: "Suave y esponjoso, ideal para sandwiches o para acompañar cualquier comida."
  },
  {
    id: "PV001",
    categoria: "Productos Veganos",
    nombre: "Torta Vegana de Chocolate",
    precio: 50000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-vegana-chocolate.webp",
    descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecto para veganos."
  },
  {
    id: "PV002",
    categoria: "Productos Veganos",
    nombre: "Galletas Veganas de Avena",
    precio: 4500,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Fgalletas-veganas-avena.jpg",
    descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano."
  },
  {
    id: "TE001",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Cumpleaños",
    precio: 55000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-cumpleanios.jpg",
    descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos."
  },
  {
    id: "TE002",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Boda",
    precio: 60000,
    imagen: "https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2Ftorta-boda.jpg",
    descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda."
  }
];

/** Categorías del catálogo semilla, en orden de aparición. */
const CATEGORIAS_BASE = [...new Set(CATALOGO_INICIAL.map(p => p.categoria))];

/**
 * Rutas que el proyecto usó antes y que ya no resuelven a ningún archivo.
 * Se tratan como "sin imagen declarada" para que caiga en IMAGEN_POR_DEFECTO.
 */
const RUTAS_IMAGEN_LEGADAS = ["logo.jpeg", "../logo.jpeg", "../../logo.jpeg"];

/**
 * Normaliza un registro de producto cualquiera (base, localStorage o formulario)
 * devolviendo siempre la misma forma de objeto.
 * @param {object} producto
 * @returns {object|null} Producto válido o null si no se puede normalizar
 */
function normalizarProducto(producto) {
  if (!producto || typeof producto !== "object") return null;

  const id = String(producto.id ?? "").trim().toUpperCase();
  const nombre = String(producto.nombre ?? "").trim();
  if (!id || !nombre) return null;

  const precio = Number(producto.precio);
  const stock = Number(producto.stock);
  const stockCritico = Number(producto.stockCritico);
  const imagen = typeof producto.imagen === "string" ? producto.imagen.trim() : "";

  return {
    id,
    nombre,
    categoria: String(producto.categoria ?? "").trim() || CATEGORIAS_BASE[0],
    precio: Number.isFinite(precio) && precio >= 0 ? Math.round(precio) : 0,
    imagen: !imagen || RUTAS_IMAGEN_LEGADAS.includes(imagen) ? IMAGEN_POR_DEFECTO : imagen,
    descripcion: String(producto.descripcion ?? "").trim(),
    stock: Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : STOCK_POR_DEFECTO,
    stockCritico: Number.isFinite(stockCritico) && stockCritico >= 1
      ? Math.floor(stockCritico)
      : STOCK_CRITICO_POR_DEFECTO
  };
}

/**
 * Construye el inventario a partir del catálogo semilla.
 * @returns {Array<object>}
 */
function crearInventarioInicial() {
  return CATALOGO_INICIAL.map((p, idx) => normalizarProducto({
    ...p,
    stock: idx % 3 === 0 ? STOCK_INICIAL_BAJO : STOCK_POR_DEFECTO,
    stockCritico: STOCK_CRITICO_POR_DEFECTO
  }));
}

/**
 * Persiste el inventario normalizado.
 * @param {Array<object>} catalogo
 * @returns {Array<object>} El inventario tal como quedó guardado
 */
function guardarCatalogo(catalogo) {
  const normalizado = (Array.isArray(catalogo) ? catalogo : [])
    .map(normalizarProducto)
    .filter(Boolean);

  try {
    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(normalizado));
  } catch (error) {
    console.error("No se pudo persistir el inventario:", error);
  }

  return normalizado;
}

/**
 * Lee el inventario persistido. Si no existe o está corrupto, lo inicializa
 * con el catálogo semilla.
 * @returns {Array<object>}
 */
function obtenerCatalogo() {
  try {
    const data = localStorage.getItem(CLAVE_INVENTARIO);
    if (data) {
      const parseado = JSON.parse(data);
      if (Array.isArray(parseado)) return parseado.map(normalizarProducto).filter(Boolean);
      throw new TypeError("El inventario no es un arreglo");
    }
  } catch (error) {
    console.warn("Inventario corrupto en localStorage, se reinicia:", error);
  }

  return guardarCatalogo(crearInventarioInicial());
}

/**
 * Busca un producto del inventario por su id
 * @param {string} id
 * @returns {object|null} El producto o null si no existe
 */
function obtenerProductoPorId(id) {
  if (!id) return null;
  return obtenerCatalogo().find(p => p.id === String(id).trim().toUpperCase()) || null;
}

/**
 * Categorías presentes en el inventario actual, en orden de aparición.
 * @returns {Array<string>}
 */
function obtenerCategorias() {
  return [...new Set(obtenerCatalogo().map(p => p.categoria).filter(Boolean))];
}

/**
 * Indica si un producto tiene stock para la cantidad pedida.
 * @param {object} producto
 * @param {number} cantidad
 * @returns {boolean}
 */
function tieneStock(producto, cantidad = 1) {
  if (!producto) return false;
  const pedido = Number(cantidad);
  return Number.isFinite(pedido) && Number(producto.stock) >= pedido;
}

/**
 * Crea un producto en el inventario.
 * @param {object} datos
 * @returns {{ok: boolean, mensaje: string, producto: object|null}}
 */
function crearProducto(datos) {
  const producto = normalizarProducto(datos);
  if (!producto) {
    return { ok: false, mensaje: "Los datos del producto no son válidos.", producto: null };
  }

  const catalogo = obtenerCatalogo();
  if (catalogo.some(p => p.id === producto.id)) {
    return { ok: false, mensaje: "El código de producto ya existe. Por favor ingrese un código único.", producto: null };
  }

  guardarCatalogo([...catalogo, producto]);
  return { ok: true, mensaje: "¡Producto agregado exitosamente al inventario!", producto };
}

/**
 * Actualiza un producto existente del inventario.
 * @param {object} datos
 * @returns {{ok: boolean, mensaje: string, producto: object|null}}
 */
function actualizarProducto(datos) {
  const producto = normalizarProducto(datos);
  if (!producto) {
    return { ok: false, mensaje: "Los datos del producto no son válidos.", producto: null };
  }

  const catalogo = obtenerCatalogo();
  if (!catalogo.some(p => p.id === producto.id)) {
    return { ok: false, mensaje: "El producto que intenta actualizar no existe en el inventario.", producto: null };
  }

  guardarCatalogo(catalogo.map(p => p.id === producto.id ? producto : p));
  return { ok: true, mensaje: "¡Producto actualizado con éxito!", producto };
}

/**
 * Elimina un producto del inventario.
 * @param {string} id
 * @returns {Array<object>} Inventario restante
 */
function eliminarProducto(id) {
  return guardarCatalogo(obtenerCatalogo().filter(p => p.id !== id));
}

/**
 * Llena un <select> con las categorías del inventario.
 * Conserva la opción placeholder (value="") si el select ya tiene una.
 * @param {HTMLSelectElement} select
 * @param {{todas?: string}} [opciones] "todas" agrega una opción general al inicio
 *   y la deja seleccionada por defecto
 */
function poblarSelectCategorias(select, opciones = {}) {
  if (!select) return;

  const placeholder = select.querySelector('option[value=""]');
  [...select.options]
    .filter(o => o.value !== "" && !o.dataset.msGenerada)
    .forEach(o => o.remove());

  obtenerCategorias().forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    option.dataset.msGenerada = "true";
    select.appendChild(option);
  });

  if (opciones.todas) {
    const option = document.createElement("option");
    option.value = "TODAS";
    option.textContent = opciones.todas;
    option.dataset.msGenerada = "true";
    select.prepend(option);
    select.value = "TODAS";
  }

  if (placeholder) select.prepend(placeholder);
}
