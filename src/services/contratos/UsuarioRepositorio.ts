import type { CambioUsuario, FiltroListado, Pagina, ResultadoOperacion, Usuario, UsuarioNuevo } from '@/types';

export interface UsuarioRepositorio {
  listar(filtro?: FiltroListado): Promise<Pagina<Usuario>>;
  obtenerPorRun(run: string): Promise<Usuario | null>;
  crear(datos: UsuarioNuevo): Promise<ResultadoOperacion<Usuario>>;
  registrar(datos: UsuarioNuevo): Promise<ResultadoOperacion<Usuario>>;
  actualizar(run: string, cambios: CambioUsuario): Promise<ResultadoOperacion<Usuario>>;
  eliminar(run: string): Promise<ResultadoOperacion<null>>;
}
