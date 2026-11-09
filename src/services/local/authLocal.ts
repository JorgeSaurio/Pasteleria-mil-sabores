import type { Sesion } from '@/types';
import type { AuthRepositorio } from '../contratos/AuthRepositorio';
import { borrarSesion, guardarSesion, leerSesion } from '../sesionAlmacen';
import { buscarPorCredenciales, buscarPorRunSincrono } from './usuarioLocal';
import { exito, fallo, responder } from './utilidades';

/** Token simulado. Con backend lo emite el servidor (JWT) y el frontend solo lo transporta. */
function generarTokenSimulado(): string {
  return `local.${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}`;
}

export const authLocal: AuthRepositorio = {
  async iniciarSesion({ email, password }) {
    if (!email.trim() || !password) return responder(fallo<Sesion>('Ingresa tu correo y contraseña.'));

    const usuario = buscarPorCredenciales(email, password);
    if (!usuario) return responder(fallo<Sesion>('Correo o contraseña incorrectos.'));

    const sesion: Sesion = { token: generarTokenSimulado(), usuario };
    guardarSesion(sesion);
    return responder(exito(`¡Bienvenido/a, ${usuario.nombre}!`, sesion));
  },

  async cerrarSesion() {
    borrarSesion();
    return responder(undefined);
  },

  async obtenerSesion() {
    const guardada = leerSesion();
    if (!guardada?.token) return responder(null);

    // Equivalente local a "validar el token": el usuario debe seguir existiendo.
    const usuario = buscarPorRunSincrono(guardada.usuario.run);
    if (!usuario) {
      borrarSesion();
      return responder(null);
    }
    const sesion: Sesion = { ...guardada, usuario };
    guardarSesion(sesion);
    return responder(sesion);
  },
};
