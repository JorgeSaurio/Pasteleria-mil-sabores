import type { ReactNode } from 'react';
import { Boton } from '@/components/shared/Boton';
import { formatearMoneda } from '@/utils/formato';

interface ResumenCompraProps {
  subtotal: number;
  descuento: number;
  total: number;
  textoAccion: string;
  onAccion: () => void;
  accionDeshabilitada?: boolean;
  children?: ReactNode;
}

export function ResumenCompra({
  subtotal,
  descuento,
  total,
  textoAccion,
  onAccion,
  accionDeshabilitada = false,
  children,
}: ResumenCompraProps) {
  return (
    <div className="card border-0 shadow-sm p-4 bg-light">
      <h2 className="h4 fw-bold mb-3">Resumen de compra</h2>
      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">Subtotal</span>
        <span className="fw-semibold">{formatearMoneda(subtotal)}</span>
      </div>
      {descuento > 0 && (
        <div className="d-flex justify-content-between mb-2 text-success">
          <span>Descuento aplicado</span>
          <span>-{formatearMoneda(descuento)}</span>
        </div>
      )}
      <hr />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="h5 fw-bold mb-0">TOTAL:</span>
        <span className="h4 fw-bold text-dark mb-0">{formatearMoneda(total)}</span>
      </div>
      {children}
      <Boton variante="success" className="btn-lg w-100 py-2 fw-bold shadow-sm" onClick={onAccion} deshabilitado={accionDeshabilitada}>
        {textoAccion}
      </Boton>
    </div>
  );
}
