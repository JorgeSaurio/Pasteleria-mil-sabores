export function formatearMoneda(monto: number): string {
  const valor = Number.isFinite(monto) ? monto : 0;
  return '$' + Math.round(valor).toLocaleString('es-CL');
}

export function resumirTexto(texto: string, largo = 75): string {
  const limpio = (texto ?? '').trim();
  return limpio.length > largo ? limpio.slice(0, largo).trimEnd() + '...' : limpio;
}

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '-';
  return fecha.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

export function normalizarTexto(texto: string): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function formatearRun(run: string): string {
  const limpio = (run ?? '').replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${limpio.slice(-1)}`;
}
