import type { Sesion } from '@/types';
import { CLAVES, eliminar, guardar, leer } from './local/storage';

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
