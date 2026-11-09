/**
 * Único punto de la app que toca localStorage / sessionStorage.
 * Todo acceso va envuelto en try/catch: el navegador puede bloquear el storage
 * (modo privado, cuota llena) o el JSON puede estar corrupto.
 */

export const CLAVES = {
  productos: 'mil_sabores_productos',
  categorias: 'mil_sabores_categorias',
  usuarios: 'mil_sabores_usuarios',
  ordenes: 'mil_sabores_ordenes',
  contactos: 'mil_sabores_contactos',
  carrito: 'mil_sabores_carrito',
  cupon: 'mil_sabores_cupon',
  sesion: 'mil_sabores_sesion',
} as const;

/** Claves que usaba el proyecto HTML. Se leen una vez para migrar datos y luego se borran. */
export const CLAVES_LEGADAS = {
  inventario: 'mil_sabores_inventario',
  carrito: 'mil_sabores_carrito',
  registros: 'registros',
  contactos: 'contactos',
  usuarioActivo: 'usuarioActivo',
} as const;

type TipoAlmacen = 'local' | 'sesion';

function obtenerAlmacen(tipo: TipoAlmacen): Storage | null {
  try {
    return tipo === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function existe(clave: string, tipo: TipoAlmacen = 'local'): boolean {
  return obtenerAlmacen(tipo)?.getItem(clave) != null;
}

export function leer<T>(clave: string, porDefecto: T, tipo: TipoAlmacen = 'local'): T {
  try {
    const crudo = obtenerAlmacen(tipo)?.getItem(clave);
    return crudo == null ? porDefecto : (JSON.parse(crudo) as T);
  } catch (error) {
    console.warn(`[storage] Valor corrupto en "${clave}", se usa el valor por defecto.`, error);
    return porDefecto;
  }
}

export function guardar<T>(clave: string, valor: T, tipo: TipoAlmacen = 'local'): void {
  try {
    obtenerAlmacen(tipo)?.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error(`[storage] No se pudo guardar "${clave}".`, error);
  }
}

export function eliminar(clave: string, tipo: TipoAlmacen = 'local'): void {
  try {
    obtenerAlmacen(tipo)?.removeItem(clave);
  } catch {
    /* sin acceso al storage: no hay nada que borrar */
  }
}
