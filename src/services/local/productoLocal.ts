import { IMAGEN_POR_DEFECTO } from '@/config/constantes';
import { CATEGORIAS_INICIALES } from '@/data/categoriasIniciales';
import { PRODUCTOS_INICIALES } from '@/data/productosIniciales';
import type { FiltroListado, Producto } from '@/types';
import { esStockCritico, estaEnOferta, tieneStock } from '@/utils/carrito';
import { normalizarTexto } from '@/utils/formato';
import type { ProductoRepositorio } from '../contratos/ProductoRepositorio';
import { CLAVES, CLAVES_LEGADAS, eliminar, existe, guardar, leer } from './storage';
import { exito, fallo, paginar, responder } from './utilidades';

const STOCK_POR_DEFECTO = 15;
const STOCK_CRITICO_POR_DEFECTO = 5;
const RUTAS_IMAGEN_LEGADAS = ['logo.jpeg', '../logo.jpeg', '../../logo.jpeg'];

/** Convierte el nombre de categoría del proyecto HTML ("Tortas Cuadradas") en su id nuevo. */
function categoriaIdDesdeNombre(nombre: string): string {
  const encontrada = CATEGORIAS_INICIALES.find((c) => c.nombre === nombre);
  return encontrada?.id ?? CATEGORIAS_INICIALES[0].id;
}

/**
 * Normaliza cualquier registro (semilla, storage, formulario o formato antiguo)
 * devolviendo siempre la misma forma. Porta normalizarProducto() de datos-catalogo.js.
 */
function normalizarProducto(crudo: unknown): Producto | null {
  if (!crudo || typeof crudo !== 'object') return null;
  const p = crudo as Record<string, unknown>;

  const id = String(p.id ?? '').trim().toUpperCase();
  const nombre = String(p.nombre ?? '').trim();
  if (!id || !nombre) return null;

  const precio = Number(p.precio);
  const precioOferta = Number(p.precioOferta);
  const stock = Number(p.stock);
  const stockCritico = Number(p.stockCritico);
  const imagen = typeof p.imagen === 'string' ? p.imagen.trim() : '';
  const categoriaId =
    typeof p.categoriaId === 'string' && p.categoriaId
      ? p.categoriaId
      : categoriaIdDesdeNombre(String(p.categoria ?? ''));

  const producto: Producto = {
    id,
    nombre,
    categoriaId,
    precio: Number.isFinite(precio) && precio >= 0 ? Math.round(precio) : 0,
    imagen: !imagen || RUTAS_IMAGEN_LEGADAS.includes(imagen) ? IMAGEN_POR_DEFECTO : imagen,
    descripcion: String(p.descripcion ?? '').trim(),
    stock: Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : STOCK_POR_DEFECTO,
    stockCritico:
      Number.isFinite(stockCritico) && stockCritico >= 1 ? Math.floor(stockCritico) : STOCK_CRITICO_POR_DEFECTO,
  };
  if (Number.isFinite(precioOferta) && precioOferta > 0) producto.precioOferta = Math.round(precioOferta);
  return producto;
}

function normalizarLista(lista: unknown): Producto[] {
  return Array.isArray(lista) ? lista.map(normalizarProducto).filter((p): p is Producto => p !== null) : [];
}

/**
 * Lee el inventario. Orden de prioridad:
 * 1) clave nueva  2) inventario del proyecto HTML (se migra y se borra)  3) semilla.
 * Exportada (no es parte del contrato) porque pagoLocal necesita descontar stock.
 */
export function cargarProductos(): Producto[] {
  if (existe(CLAVES.productos)) return normalizarLista(leer<unknown>(CLAVES.productos, []));

  const legado = normalizarLista(leer<unknown>(CLAVES_LEGADAS.inventario, null));
  const inicial = legado.length > 0 ? legado : PRODUCTOS_INICIALES;
  guardarProductos(inicial);
  eliminar(CLAVES_LEGADAS.inventario);
  return inicial;
}

export function guardarProductos(productos: Producto[]): void {
  guardar(CLAVES.productos, productos);
}

function validarProducto(p: Producto): Record<string, string> {
  const errores: Record<string, string> = {};
  if (p.precioOferta !== undefined && p.precioOferta >= p.precio) {
    errores.precioOferta = 'El precio oferta debe ser menor que el precio normal.';
  }
  if (p.stockCritico < 1) errores.stockCritico = 'El stock crítico debe ser al menos 1.';
  return errores;
}

export const productoLocal: ProductoRepositorio = {
  async listar(filtro: FiltroListado = {}) {
    const busqueda = normalizarTexto(filtro.busqueda ?? '');
    const resultado = cargarProductos().filter(
      (p) =>
        (!filtro.categoriaId || p.categoriaId === filtro.categoriaId) &&
        (!filtro.soloDisponibles || tieneStock(p, 1)) &&
        (!busqueda ||
          normalizarTexto(p.nombre).includes(busqueda) ||
          normalizarTexto(p.descripcion).includes(busqueda)),
    );
    return responder(paginar(resultado, filtro.pagina, filtro.tamanoPagina));
  },

  async obtenerPorId(id) {
    const buscado = String(id ?? '').trim().toUpperCase();
    return responder(cargarProductos().find((p) => p.id === buscado) ?? null);
  },

  async obtenerPorIds(ids) {
    const conjunto = new Set(ids.map((id) => id.toUpperCase()));
    return responder(cargarProductos().filter((p) => conjunto.has(p.id)));
  },

  async crear(datos) {
    const producto = normalizarProducto(datos);
    if (!producto) return responder(fallo('Los datos del producto no son válidos.'));

    const errores = validarProducto(producto);
    if (Object.keys(errores).length > 0) return responder(fallo('Revisa los campos marcados.', errores));

    const productos = cargarProductos();
    if (productos.some((p) => p.id === producto.id)) {
      return responder(fallo('El código de producto ya existe.', { id: 'Ingresa un código único.' }));
    }
    guardarProductos([...productos, producto]);
    return responder(exito('¡Producto agregado exitosamente al inventario!', producto));
  },

  async actualizar(datos) {
    const producto = normalizarProducto(datos);
    if (!producto) return responder(fallo('Los datos del producto no son válidos.'));

    const errores = validarProducto(producto);
    if (Object.keys(errores).length > 0) return responder(fallo('Revisa los campos marcados.', errores));

    const productos = cargarProductos();
    if (!productos.some((p) => p.id === producto.id)) {
      return responder(fallo('El producto que intenta actualizar no existe.'));
    }
    guardarProductos(productos.map((p) => (p.id === producto.id ? producto : p)));
    return responder(exito('¡Producto actualizado con éxito!', producto));
  },

  async eliminar(id) {
    const productos = cargarProductos();
    const restantes = productos.filter((p) => p.id !== id);
    if (restantes.length === productos.length) return responder(fallo('El producto no existe.'));
    guardarProductos(restantes);
    return responder(exito('Producto eliminado.', null));
  },

  async listarOfertas() {
    return responder(cargarProductos().filter(estaEnOferta));
  },

  async listarCriticos() {
    return responder(cargarProductos().filter(esStockCritico));
  },
};
