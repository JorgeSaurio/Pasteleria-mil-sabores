export type Rol = 'Administrador' | 'Vendedor' | 'Cliente';

export const ROLES: readonly Rol[] = ['Administrador', 'Vendedor', 'Cliente'];

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

export interface UsuarioNuevo extends Usuario {
  password: string;
}

export interface CambioUsuario extends Partial<Omit<Usuario, 'run'>> {
  password?: string;
}

export interface Credenciales {
  email: string;
  password: string;
}

export interface Sesion {
  token: string;
  usuario: Usuario;
  expiraEn?: string;
}
