import { USUARIOS_INICIALES } from '@/data/usuariosIniciales';
import type { FiltroListado, Rol, Usuario, UsuarioNuevo } from '@/types';
import { ROLES } from '@/types';
import { normalizarTexto } from '@/utils/formato';
import type { UsuarioRepositorio } from '../contratos/UsuarioRepositorio';
import { CLAVES, CLAVES_LEGADAS, eliminar, existe, guardar, leer } from './storage';
import { exito, fallo, paginar, responder } from './utilidades';

// Incluye la contraseña. Nunca sale de este archivo.
type UsuarioAlmacenado = UsuarioNuevo;

export function limpiarRun(run: string): string {
  return (run ?? '').replace(/[^0-9kK]/g, '').toUpperCase();
}

function quitarPassword(u: UsuarioAlmacenado): Usuario {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...usuario } = u;
  return usuario;
}

function esRol(valor: unknown): valor is Rol {
  return typeof valor === 'string' && (ROLES as readonly string[]).includes(valor);
}

function normalizarUsuario(crudo: unknown): UsuarioAlmacenado | null {
  if (!crudo || typeof crudo !== 'object') return null;
  const u = crudo as Record<string, unknown>;
  const run = limpiarRun(String(u.run ?? ''));
  const email = String(u.email ?? '').trim().toLowerCase();
  if (!run || !email) return null;

  const rol = esRol(u.rol) ? u.rol : esRol(u.tipo) ? u.tipo : 'Cliente';
  const texto = (valor: unknown) => (typeof valor === 'string' ? valor.trim() : '');

  return {
    run,
    nombre: texto(u.nombre) || texto(u.name),
    apellidos: texto(u.apellidos),
    email,
    password: String(u.password ?? ''),
    fechaNacimiento: texto(u.fechaNacimiento) || texto(u.nacimiento) || undefined,
    region: texto(u.region),
    comuna: texto(u.comuna),
    direccion: texto(u.direccion) || texto(u.dir),
    telefono: texto(u.telefono) || texto(u.tel) || undefined,
    rol,
  };
}

function cargarUsuarios(): UsuarioAlmacenado[] {
  let lista: UsuarioAlmacenado[];
  if (existe(CLAVES.usuarios)) {
    lista = leer<unknown[]>(CLAVES.usuarios, []).map(normalizarUsuario).filter((u): u is UsuarioAlmacenado => !!u);
  } else {
    const legado = leer<unknown[]>(CLAVES_LEGADAS.registros, [])
      .map(normalizarUsuario)
      .filter((u): u is UsuarioAlmacenado => !!u);
    const porRun = new Map<string, UsuarioAlmacenado>();
    [...USUARIOS_INICIALES, ...legado].forEach((u) => porRun.set(u.run, u));
    lista = [...porRun.values()];
    eliminar(CLAVES_LEGADAS.registros);
    eliminar(CLAVES_LEGADAS.usuarioActivo, 'sesion');
  }
  if (!lista.some((u) => u.rol === 'Administrador')) lista = [USUARIOS_INICIALES[0], ...lista];
  guardar(CLAVES.usuarios, lista);
  return lista;
}

function guardarUsuarios(lista: UsuarioAlmacenado[]): void {
  guardar(CLAVES.usuarios, lista);
}

export function buscarPorCredenciales(email: string, password: string): Usuario | null {
  const correo = email.trim().toLowerCase();
  const encontrado = cargarUsuarios().find((u) => u.email === correo && u.password === password);
  return encontrado ? quitarPassword(encontrado) : null;
}

export function buscarPorRunSincrono(run: string): Usuario | null {
  const encontrado = cargarUsuarios().find((u) => u.run === limpiarRun(run));
  return encontrado ? quitarPassword(encontrado) : null;
}

function validarUnicidad(lista: UsuarioAlmacenado[], datos: { run: string; email: string }, excluirRun?: string) {
  const errores: Record<string, string> = {};
  if (!excluirRun && lista.some((u) => u.run === datos.run)) errores.run = 'RUN ya registrado.';
  if (lista.some((u) => u.run !== excluirRun && u.email === datos.email)) {
    errores.email = 'Ya existe un usuario con ese correo.';
  }
  return errores;
}

async function crearInterno(datos: UsuarioNuevo, rolForzado?: Rol) {
  const usuario = normalizarUsuario({ ...datos, rol: rolForzado ?? datos.rol });
  if (!usuario || !usuario.password) return responder(fallo<Usuario>('Los datos del usuario no son válidos.'));

  const lista = cargarUsuarios();
  const errores = validarUnicidad(lista, usuario);
  if (Object.keys(errores).length > 0) {
    return responder(fallo<Usuario>(Object.values(errores)[0], errores));
  }
  guardarUsuarios([...lista, usuario]);
  return responder(exito('¡Registro exitoso!', quitarPassword(usuario)));
}

export const usuarioLocal: UsuarioRepositorio = {
  async listar(filtro: FiltroListado = {}) {
    const busqueda = normalizarTexto(filtro.busqueda ?? '');
    const lista = cargarUsuarios()
      .map(quitarPassword)
      .filter(
        (u) =>
          !busqueda ||
          normalizarTexto(`${u.nombre} ${u.apellidos} ${u.email} ${u.run}`).includes(busqueda),
      );
    return responder(paginar(lista, filtro.pagina, filtro.tamanoPagina));
  },

  async obtenerPorRun(run) {
    return responder(buscarPorRunSincrono(run));
  },

  crear(datos) {
    return crearInterno(datos);
  },

  registrar(datos) {
    return crearInterno(datos, 'Cliente');
  },

  async actualizar(run, cambios) {
    const lista = cargarUsuarios();
    const actual = lista.find((u) => u.run === limpiarRun(run));
    if (!actual) return responder(fallo<Usuario>('El usuario no existe.'));

    const { password, ...resto } = cambios;
    const fusionado = normalizarUsuario({
      ...actual,
      ...resto,
      run: actual.run,
      password: password ? password : actual.password,
    });
    if (!fusionado) return responder(fallo<Usuario>('Los datos del usuario no son válidos.'));

    const errores = validarUnicidad(lista, fusionado, actual.run);
    if (Object.keys(errores).length > 0) return responder(fallo<Usuario>(Object.values(errores)[0], errores));

    guardarUsuarios(lista.map((u) => (u.run === actual.run ? fusionado : u)));
    return responder(exito('¡Datos actualizados!', quitarPassword(fusionado)));
  },

  async eliminar(run) {
    const lista = cargarUsuarios();
    const objetivo = lista.find((u) => u.run === limpiarRun(run));
    if (!objetivo) return responder(fallo<null>('El usuario no existe.'));
    if (objetivo.rol === 'Administrador' && lista.filter((u) => u.rol === 'Administrador').length === 1) {
      return responder(fallo<null>('No se puede eliminar al último administrador.'));
    }
    guardarUsuarios(lista.filter((u) => u.run !== objetivo.run));
    return responder(exito('Usuario eliminado.', null));
  },
};
