import type { CambioUsuario, FiltroListado, Pagina, ResultadoOperacion, Usuario, UsuarioNuevo } from '@/types';

/** Ningún método devuelve contraseñas: solo se reciben en UsuarioNuevo / CambioUsuario. */
export interface UsuarioRepositorio {
  listar(filtro?: FiltroListado): Promise<Pagina<Usuario>>;
  obtenerPorRun(run: string): Promise<Usuario | null>;
  /** Alta desde el panel admin (permite elegir rol). */
  crear(datos: UsuarioNuevo): Promise<ResultadoOperacion<Usuario>>;
  /** Registro público: el rol siempre queda como "Cliente". */
  registrar(datos: UsuarioNuevo): Promise<ResultadoOperacion<Usuario>>;
  actualizar(run: string, cambios: CambioUsuario): Promise<ResultadoOperacion<Usuario>>;
  eliminar(run: string): Promise<ResultadoOperacion<null>>;
}
