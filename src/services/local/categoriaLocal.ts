import { CATEGORIAS_INICIALES } from '@/data/categoriasIniciales';
import type { Categoria } from '@/types';
import type { CategoriaRepositorio } from '../contratos/CategoriaRepositorio';
import { cargarProductos } from './productoLocal';
import { CLAVES, existe, guardar, leer } from './storage';
import { crearSlug, exito, fallo, responder } from './utilidades';

function cargarCategorias(): Categoria[] {
  if (!existe(CLAVES.categorias)) guardar(CLAVES.categorias, CATEGORIAS_INICIALES);
  const lista = leer<Categoria[]>(CLAVES.categorias, CATEGORIAS_INICIALES);
  return Array.isArray(lista) ? lista.filter((c) => c && c.id && c.nombre) : CATEGORIAS_INICIALES;
}

function nombreDuplicado(lista: Categoria[], nombre: string, excluirId?: string): boolean {
  const buscado = nombre.trim().toLowerCase();
  return lista.some((c) => c.id !== excluirId && c.nombre.trim().toLowerCase() === buscado);
}

export const categoriaLocal: CategoriaRepositorio = {
  async listar() {
    return responder(cargarCategorias());
  },

  async obtenerPorId(id) {
    return responder(cargarCategorias().find((c) => c.id === id) ?? null);
  },

  async crear(datos) {
    const nombre = datos.nombre?.trim() ?? '';
    if (!nombre) return responder(fallo('El nombre es obligatorio.', { nombre: 'Ingresa un nombre.' }));

    const lista = cargarCategorias();
    if (nombreDuplicado(lista, nombre)) {
      return responder(fallo('Ya existe una categoría con ese nombre.', { nombre: 'Nombre repetido.' }));
    }
    const categoria: Categoria = { id: crearSlug(nombre) || `categoria-${Date.now()}`, nombre, imagen: datos.imagen };
    guardar(CLAVES.categorias, [...lista, categoria]);
    return responder(exito('Categoría creada.', categoria));
  },

  async actualizar(datos) {
    const nombre = datos.nombre?.trim() ?? '';
    if (!nombre) return responder(fallo('El nombre es obligatorio.', { nombre: 'Ingresa un nombre.' }));

    const lista = cargarCategorias();
    if (!lista.some((c) => c.id === datos.id)) return responder(fallo('La categoría no existe.'));
    if (nombreDuplicado(lista, nombre, datos.id)) {
      return responder(fallo('Ya existe una categoría con ese nombre.', { nombre: 'Nombre repetido.' }));
    }
    const actualizada: Categoria = { ...datos, nombre };
    guardar(CLAVES.categorias, lista.map((c) => (c.id === datos.id ? actualizada : c)));
    return responder(exito('Categoría actualizada.', actualizada));
  },

  async eliminar(id) {
    const asociados = cargarProductos().filter((p) => p.categoriaId === id).length;
    if (asociados > 0) {
      return responder(fallo(`No se puede eliminar: tiene ${asociados} producto(s) asociado(s).`));
    }
    const lista = cargarCategorias();
    guardar(CLAVES.categorias, lista.filter((c) => c.id !== id));
    return responder(exito('Categoría eliminada.', null));
  },
};
