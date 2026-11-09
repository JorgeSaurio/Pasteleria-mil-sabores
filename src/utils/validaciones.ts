/**
 * Validadores puros. Cada uno recibe el valor y devuelve el mensaje de error o null.
 * Portan las reglas de js/validaciones.js. Dan feedback inmediato; el backend debe repetirlas.
 */

export type Validador = (valor: string) => string | null;

export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

const REGEX_EMAIL_PERMITIDO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
const REGEX_EMAIL_FORMATO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_TELEFONO = /^(\+56)?9[0-9]{8}$/;

/** Quita puntos, guion y espacios: "21.088.533-1" → "210885331". */
export function limpiarRun(valor: string): string {
  return (valor ?? '').replace(/[.\-\s]/g, '').toUpperCase();
}

/** Dígito verificador por módulo 11. */
export function calcularDv(cuerpo: string): string {
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resultado = 11 - (suma % 11);
  if (resultado === 11) return '0';
  if (resultado === 10) return 'K';
  return String(resultado);
}

export function validarRun(valor: string): string | null {
  const run = limpiarRun(valor);
  if (run.length === 0) return 'El RUN es obligatorio.';
  if (run.length < 7) return 'El RUN debe tener mínimo 7 caracteres.';
  if (run.length > 9) return 'El RUN debe tener máximo 9 caracteres.';
  if (!/^\d{6,8}[0-9K]$/.test(run)) return 'Formato inválido. Ejemplo: 12345678K';
  if (calcularDv(run.slice(0, -1)) !== run.slice(-1)) return 'El RUN no es válido, por favor revísalo.';
  return null;
}

/** Fábrica: obligatorio + largo máximo. */
export function requerido(nombreCampo: string, maximo?: number): Validador {
  return (valor) => {
    const limpio = (valor ?? '').trim();
    if (!limpio) return `${nombreCampo} es obligatorio.`;
    if (maximo && limpio.length > maximo) return `${nombreCampo} no debe superar los ${maximo} caracteres.`;
    return null;
  };
}

export const validarNombre = requerido('El nombre', 50);
export const validarApellidos = requerido('Los apellidos', 100);
export const validarDireccion = requerido('La dirección', 300);

/** Correo con dominios permitidos (registro, login, contacto). */
export function validarEmail(valor: string): string | null {
  const email = (valor ?? '').trim();
  if (!email) return 'El correo es obligatorio.';
  if (email.length > 100) return 'El correo no debe superar los 100 caracteres.';
  if (!REGEX_EMAIL_PERMITIDO.test(email)) {
    return `Solo se permiten correos @${DOMINIOS_PERMITIDOS.join(', @')}.`;
  }
  return null;
}

/** Correo con formato válido, sin restringir dominio (checkout). */
export function validarEmailFormato(valor: string): string | null {
  const email = (valor ?? '').trim();
  if (!email) return 'El correo es obligatorio.';
  if (!REGEX_EMAIL_FORMATO.test(email)) return 'Ingresa un correo válido.';
  return null;
}

export function validarPassword(valor: string): string | null {
  if (!valor) return 'Ingresa una contraseña.';
  if (valor.length < 4) return 'La contraseña debe tener al menos 4 caracteres.';
  if (valor.length > 10) return 'La contraseña debe tener como máximo 10 caracteres.';
  return null;
}

/** Teléfono opcional: vacío es válido. */
export function validarTelefono(valor: string): string | null {
  const telefono = (valor ?? '').trim();
  if (!telefono) return null;
  return REGEX_TELEFONO.test(telefono) ? null : 'Formato válido: +56912345678';
}

export function validarSeleccion(mensaje: string): Validador {
  return (valor) => ((valor ?? '').trim() ? null : mensaje);
}

/** Confirmación (correo o contraseña repetidos): obligatorio y debe coincidir con el original. */
export function validarConfirmacion(valor: string, original: string, mensaje: string): string | null {
  if (!valor) return 'Este campo es obligatorio.';
  return valor === original ? null : mensaje;
}

/** Valida que un texto numérico sea entero y esté dentro de un rango. */
export function validarEntero(nombreCampo: string, minimo: number, opcional = false): Validador {
  return (valor) => {
    const limpio = (valor ?? '').trim();
    if (!limpio) return opcional ? null : `${nombreCampo} es obligatorio.`;
    const numero = Number(limpio);
    if (!Number.isInteger(numero)) return `${nombreCampo} debe ser un número entero.`;
    if (numero < minimo) return `${nombreCampo} debe ser mayor o igual a ${minimo}.`;
    return null;
  };
}
