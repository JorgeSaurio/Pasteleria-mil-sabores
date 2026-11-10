import { entorno } from '@/config/entorno';
import type { AuthRepositorio } from './contratos/AuthRepositorio';
import type { CarritoRepositorio } from './contratos/CarritoRepositorio';
import type { CategoriaRepositorio } from './contratos/CategoriaRepositorio';
import type { ContactoRepositorio } from './contratos/ContactoRepositorio';
import type { OrdenRepositorio } from './contratos/OrdenRepositorio';
import type { PagoRepositorio } from './contratos/PagoRepositorio';
import type { ProductoRepositorio } from './contratos/ProductoRepositorio';
import type { UsuarioRepositorio } from './contratos/UsuarioRepositorio';
import { authLocal } from './local/authLocal';
import { carritoLocal } from './local/carritoLocal';
import { categoriaLocal } from './local/categoriaLocal';
import { contactoLocal } from './local/contactoLocal';
import { ordenLocal } from './local/ordenLocal';
import { pagoLocal } from './local/pagoLocal';
import { productoLocal } from './local/productoLocal';
import { usuarioLocal } from './local/usuarioLocal';

if (entorno.modoDatos === 'http') {
  console.warn(
    '[services] VITE_MODO_DATOS=http, pero aún no hay repositorios HTTP implementados: se usan los locales.',
  );
}

// Único punto para obtener datos.
export const productoRepositorio: ProductoRepositorio = productoLocal;
export const categoriaRepositorio: CategoriaRepositorio = categoriaLocal;
export const usuarioRepositorio: UsuarioRepositorio = usuarioLocal;
export const authRepositorio: AuthRepositorio = authLocal;
export const ordenRepositorio: OrdenRepositorio = ordenLocal;
export const pagoRepositorio: PagoRepositorio = pagoLocal;
export const contactoRepositorio: ContactoRepositorio = contactoLocal;
export const carritoRepositorio: CarritoRepositorio = carritoLocal;

export { ErrorApi, mensajeDeError } from './http/errores';
export { EVENTO_SESION_EXPIRADA } from './sesionAlmacen';
