import type { Credenciales, ResultadoOperacion, Sesion } from '@/types';

export interface AuthRepositorio {
  iniciarSesion(credenciales: Credenciales): Promise<ResultadoOperacion<Sesion>>;
  cerrarSesion(): Promise<void>;
  /** Recupera la sesión guardada y la valida (con backend: GET /auth/yo con el token). */
  obtenerSesion(): Promise<Sesion | null>;
}
