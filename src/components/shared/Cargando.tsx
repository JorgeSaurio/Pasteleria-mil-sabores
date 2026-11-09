interface CargandoProps {
  texto?: string;
}

/** Indicador de carga accesible. */
export function Cargando({ texto = 'Cargando...' }: CargandoProps) {
  return (
    <div className="d-flex justify-content-center align-items-center gap-2 py-5 text-muted" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>{texto}</span>
    </div>
  );
}
