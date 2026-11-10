import type { ReactNode } from 'react';

interface BotonProps {
  children: ReactNode;
  onClick?: () => void;
  variante?: string;
  tipo?: 'button' | 'submit';
  deshabilitado?: boolean;
  cargando?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Boton({
  children,
  onClick,
  variante = 'dark',
  tipo = 'button',
  deshabilitado = false,
  cargando = false,
  className = '',
  ariaLabel,
}: BotonProps) {
  const claseVariante = variante === 'anadir' ? 'btn-anadir' : `btn-${variante}`;
  return (
    <button
      type={tipo}
      className={`btn ${claseVariante} ${className}`.trim()}
      onClick={onClick}
      disabled={deshabilitado || cargando}
      aria-label={ariaLabel}
      aria-busy={cargando}
    >
      {cargando && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
      {children}
    </button>
  );
}
