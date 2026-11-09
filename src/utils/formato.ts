/** Funciones puras de formato. Sin React ni navegador: fáciles de reutilizar y probar. */

/** 45000 → "$45.000" (pesos chilenos). */
export function formatearMoneda(monto: number): string {
  const valor = Number.isFinite(monto) ? monto : 0;
  return '$' + Math.round(valor).toLocaleString('es-CL');
}

/** Recorta el texto solo si supera el largo permitido. */
export function resumirTexto(texto: string, largo = 75): string {
  const limpio = (texto ?? '').trim();
  return limpio.length > largo ? limpio.slice(0, largo).trimEnd() + '...' : limpio;
}

/** ISO → "08-11-2026 14:30". */
export function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '-';
  return fecha.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

/** Minúsculas y sin tildes: "Tiramisú" y "tiramisu" deben coincidir al buscar. */
export function normalizarTexto(texto: string): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** "12345678K" → "12.345.678-K" (solo presentación; se guarda limpio). */
export function formatearRun(run: string): string {
  const limpio = (run ?? '').replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${limpio.slice(-1)}`;
}
