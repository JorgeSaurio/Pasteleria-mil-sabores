import type { Sesion } from '@/types';
import { CLAVES, eliminar, guardar, leer } from './local/storage';

/**
 * Dónde se guarda la sesión (token + usuario). Lo usan tanto el repositorio auth local
 * como el cliente HTTP (para adjuntar el token), por eso vive fuera de local/ y http/.
 * Se usa sessionStorage: la sesión muere al cerrar la pestaña (igual que el proyecto HTML).
 */

/** Evento global que emite el cliente HTTP ante un 401; AuthContext lo escucha. */
export const EVENTO_SESION_EXPIRADA = 'mil-sabores:sesion-expirada';

export function leerSesion(): Sesion | null {
  return leer<Sesion | null>(CLAVES.sesion, null, 'sesion');
}

export function guardarSesion(sesion: Sesion): void {
  guardar(CLAVES.sesion, sesion, 'sesion');
}

export function borrarSesion(): void {
  eliminar(CLAVES.sesion, 'sesion');
}

export function leerToken(): string | null {
  return leerSesion()?.token ?? null;
}
