import type { Credenciales, ResultadoOperacion, Sesion } from '@/types';

export interface AuthRepositorio {
  iniciarSesion(credenciales: Credenciales): Promise<ResultadoOperacion<Sesion>>;
  cerrarSesion(): Promise<void>;
  obtenerSesion(): Promise<Sesion | null>;
}
