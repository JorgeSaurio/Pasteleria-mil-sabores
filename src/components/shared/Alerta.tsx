import type { Variante } from '@/types';

interface AlertaProps {
  mensaje?: string | null;
  variante?: Variante;
  onCerrar?: () => void;
  className?: string;
}

export function Alerta({ mensaje, variante = 'danger', onCerrar, className = '' }: AlertaProps) {
  if (!mensaje) return null;
  return (
    <div
      className={`alert alert-${variante} d-flex justify-content-between align-items-start ${className}`.trim()}
      role="alert"
    >
      <span>{mensaje}</span>
      {onCerrar && <button type="button" className="btn-close ms-3" aria-label="Cerrar" onClick={onCerrar} />}
    </div>
  );
}
