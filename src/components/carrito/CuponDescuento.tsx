import { useEffect, useState } from 'react';
import type { ResultadoCupon } from '@/types';

interface CuponDescuentoProps {
  cuponActivo: ResultadoCupon | null;
  onAplicar: (codigo: string) => Promise<ResultadoCupon>;
}

/**
 * El texto que se escribe es estado LOCAL hasta presionar "Aplicar"; recién ahí se
 * comunica al contexto. Evita recalcular el total (o llamar al backend) por cada tecla.
 */
export function CuponDescuento({ cuponActivo, onAplicar }: CuponDescuentoProps) {
  const [codigo, setCodigo] = useState(cuponActivo?.codigo ?? '');
  const [mensaje, setMensaje] = useState<{ texto: string; clase: string } | null>(
    cuponActivo ? { texto: cuponActivo.mensaje, clase: 'text-success' } : null,
  );
  const [aplicando, setAplicando] = useState(false);

  // Si el cupón guardado llega después del montaje (recarga directa en /carrito), se refleja.
  const codigoActivo = cuponActivo?.codigo;
  const mensajeActivo = cuponActivo?.mensaje;
  useEffect(() => {
    if (!codigoActivo) return;
    setCodigo(codigoActivo);
    setMensaje({ texto: mensajeActivo ?? '', clase: 'text-success' });
  }, [codigoActivo, mensajeActivo]);

  const aplicar = async () => {
    setAplicando(true);
    try {
      const resultado = await onAplicar(codigo);
      if (!codigo.trim()) setMensaje(null);
      else setMensaje({ texto: resultado.mensaje, clase: resultado.valido ? 'text-success' : 'text-danger' });
    } finally {
      setAplicando(false);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="input-cupon" className="form-label small text-muted">
        Ingrese el cupón de descuento
      </label>
      <div className="input-group">
        <input
          type="text"
          id="input-cupon"
          className="form-control"
          placeholder="Ej: FELICES50"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void aplicar()}
        />
        <button className="btn btn-outline-secondary" type="button" onClick={aplicar} disabled={aplicando}>
          {aplicando ? '...' : 'APLICAR'}
        </button>
      </div>
      {mensaje && <div className={`form-text mt-1 ${mensaje.clase}`}>{mensaje.texto}</div>}
    </div>
  );
}
