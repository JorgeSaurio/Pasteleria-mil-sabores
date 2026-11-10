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

export function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorApi) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}
