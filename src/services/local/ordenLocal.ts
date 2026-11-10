import type { FiltroOrdenes, Orden } from '@/types';
import type { OrdenRepositorio } from '../contratos/OrdenRepositorio';
import { limpiarRun } from './usuarioLocal';
import { CLAVES, guardar, leer } from './storage';
import { paginar, responder } from './utilidades';

const NUMERO_INICIAL = 20240700;

export function cargarOrdenes(): Orden[] {
  const lista = leer<Orden[]>(CLAVES.ordenes, []);
  return Array.isArray(lista) ? lista : [];
}

export function registrarOrden(orden: Omit<Orden, 'id' | 'numero'>): Orden {
  const ordenes = cargarOrdenes();
  const numero = ordenes.reduce((maximo, o) => Math.max(maximo, o.numero), NUMERO_INICIAL) + 1;
  const completa: Orden = { ...orden, id: `ORD${numero}`, numero };
  guardar(CLAVES.ordenes, [...ordenes, completa]);
  return completa;
}

function ordenarPorFecha(lista: Orden[]): Orden[] {
  return [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export const ordenLocal: OrdenRepositorio = {
  async listar(filtro: FiltroOrdenes = {}) {
    const run = filtro.runCliente ? limpiarRun(filtro.runCliente) : '';
    const lista = ordenarPorFecha(cargarOrdenes()).filter(
      (o) => (!filtro.estado || o.estado === filtro.estado) && (!run || o.runCliente === run),
    );
    return responder(paginar(lista, filtro.pagina, filtro.tamanoPagina));
  },

  async obtenerPorId(id) {
    return responder(cargarOrdenes().find((o) => o.id === id) ?? null);
  },

  async listarPorRun(run) {
    const limpio = limpiarRun(run);
    return responder(ordenarPorFecha(cargarOrdenes().filter((o) => o.runCliente === limpio)));
  },
};
