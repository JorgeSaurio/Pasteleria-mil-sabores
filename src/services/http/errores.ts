/**
 * Error único de la capa HTTP. Cualquier fallo (red, timeout, 4xx, 5xx) se convierte en
 * ErrorApi, así las páginas manejan un solo tipo de error sin importar su origen.
 */
export class ErrorApi extends Error {
  readonly status: number;
  readonly codigo: string;
  readonly errores?: Record<string, string>;

  constructor(status: number, codigo: string, mensaje: string, errores?: Record<string, string>) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.status = status;
    this.codigo = codigo;
    this.errores = errores;
  }
}

/** Mensaje legible para mostrar al usuario a partir de cualquier error. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorApi) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}
