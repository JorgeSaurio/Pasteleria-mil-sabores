import { entorno } from '@/config/entorno';
import { EVENTO_SESION_EXPIRADA, leerToken } from '../sesionAlmacen';
import { ErrorApi } from './errores';

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface OpcionesPeticion {
  metodo?: Metodo;
  cuerpo?: unknown;
  parametros?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

const TIMEOUT_POR_DEFECTO_MS = 10000;

function construirUrl(ruta: string, parametros?: OpcionesPeticion['parametros']): string {
  const url = new URL(`${entorno.apiUrl}${ruta}`);
  Object.entries(parametros ?? {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== '') url.searchParams.set(clave, String(valor));
  });
  return url.toString();
}

export async function peticion<T>(ruta: string, opciones: OpcionesPeticion = {}): Promise<T> {
  const { metodo = 'GET', cuerpo, parametros, timeoutMs = TIMEOUT_POR_DEFECTO_MS, signal } = opciones;

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), timeoutMs);
  signal?.addEventListener('abort', () => controlador.abort());

  const cabeceras: Record<string, string> = { Accept: 'application/json' };
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json';
  const token = leerToken();
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  let respuesta: Response;
  try {
    respuesta = await fetch(construirUrl(ruta, parametros), {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal: controlador.signal,
    });
  } catch (error) {
    const abortado = error instanceof DOMException && error.name === 'AbortError';
    throw new ErrorApi(
      0,
      abortado ? 'TIEMPO_AGOTADO' : 'SIN_CONEXION',
      abortado ? 'El servidor tardó demasiado en responder.' : 'No se pudo conectar con el servidor.',
    );
  } finally {
    clearTimeout(temporizador);
  }

  if (respuesta.status === 401) window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));

  if (!respuesta.ok) {
    const cuerpoError = (await respuesta.json().catch(() => ({}))) as {
      codigo?: string;
      mensaje?: string;
      errores?: Record<string, string>;
    };
    throw new ErrorApi(
      respuesta.status,
      cuerpoError.codigo ?? `HTTP_${respuesta.status}`,
      cuerpoError.mensaje ?? 'La solicitud no pudo completarse.',
      cuerpoError.errores,
    );
  }

  if (respuesta.status === 204) return undefined as T;
  return (await respuesta.json()) as T;
}

export const http = {
  get: <T>(ruta: string, opciones?: Omit<OpcionesPeticion, 'metodo' | 'cuerpo'>) =>
    peticion<T>(ruta, { ...opciones, metodo: 'GET' }),
  post: <T>(ruta: string, cuerpo?: unknown, opciones?: Omit<OpcionesPeticion, 'metodo' | 'cuerpo'>) =>
    peticion<T>(ruta, { ...opciones, metodo: 'POST', cuerpo }),
  put: <T>(ruta: string, cuerpo?: unknown, opciones?: Omit<OpcionesPeticion, 'metodo' | 'cuerpo'>) =>
    peticion<T>(ruta, { ...opciones, metodo: 'PUT', cuerpo }),
  delete: <T>(ruta: string, opciones?: Omit<OpcionesPeticion, 'metodo' | 'cuerpo'>) =>
    peticion<T>(ruta, { ...opciones, metodo: 'DELETE' }),
};
