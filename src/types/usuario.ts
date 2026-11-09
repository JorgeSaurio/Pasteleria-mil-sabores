export type Rol = 'Administrador' | 'Vendedor' | 'Cliente';

export const ROLES: readonly Rol[] = ['Administrador', 'Vendedor', 'Cliente'];

/** Lo que la UI lee y muestra. NUNCA incluye contraseña (un backend no la devuelve). */
export interface Usuario {
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  fechaNacimiento?: string;
  region: string;
  comuna: string;
  direccion: string;
  telefono?: string;
  rol: Rol;
}

/** Solo al registrar / crear. */
export interface UsuarioNuevo extends Usuario {
  password: string;
}

/** Solo al editar: todo opcional, la contraseña se cambia solo si viene. */
export interface CambioUsuario extends Partial<Omit<Usuario, 'run'>> {
  password?: string;
}

export interface Credenciales {
  email: string;
  password: string;
}

/** Sesión autenticada. En modo local el token es simulado; con backend será un JWT. */
export interface Sesion {
  token: string;
  usuario: Usuario;
  expiraEn?: string;
}
