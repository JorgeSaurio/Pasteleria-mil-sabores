interface PaginacionProps {
  pagina: number;
  total: number;
  tamanoPagina: number;
  onCambiar: (pagina: number) => void;
}

/** Paginación de Bootstrap. No se renderiza si todo cabe en una página. */
export function Paginacion({ pagina, total, tamanoPagina, onCambiar }: PaginacionProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / Math.max(1, tamanoPagina)));
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginación" className="mt-4">
      <ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${pagina <= 1 ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onCambiar(pagina - 1)} disabled={pagina <= 1}>
            Anterior
          </button>
        </li>
        {paginas.map((numero) => (
          <li key={numero} className={`page-item ${numero === pagina ? 'active' : ''}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onCambiar(numero)}
              aria-current={numero === pagina ? 'page' : undefined}
            >
              {numero}
            </button>
          </li>
        ))}
        <li className={`page-item ${pagina >= totalPaginas ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onCambiar(pagina + 1)}
            disabled={pagina >= totalPaginas}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
}
