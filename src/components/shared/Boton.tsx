import type { ReactNode } from 'react';

interface BotonProps {
  /** Contenido del botón (texto o íconos). */
  children: ReactNode;
  onClick?: () => void;
  /** Sufijo de clase Bootstrap: 'dark', 'outline-dark', 'success'... o 'anadir' (estilo propio). */
  variante?: string;
  /** 'button' por defecto para evitar envíos de formulario accidentales. */
  tipo?: 'button' | 'submit';
  deshabilitado?: boolean;
  /** Muestra un spinner y bloquea el botón mientras hay una operación en curso. */
  cargando?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Botón genérico. El padre decide qué hace (onClick) y qué dice (children). */
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
