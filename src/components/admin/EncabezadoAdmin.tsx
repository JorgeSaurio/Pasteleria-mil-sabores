import type { ReactNode } from 'react';

interface EncabezadoAdminProps {
  titulo: string;
  subtitulo?: string;
  acciones?: ReactNode;
}

export function EncabezadoAdmin({ titulo, subtitulo, acciones }: EncabezadoAdminProps) {
  return (
    <header className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 pb-2 border-bottom">
      <div>
        <h1 className="h3 fw-bold text-dark mb-0">{titulo}</h1>
        {subtitulo && <p className="text-muted small mb-0">{subtitulo}</p>}
      </div>
      {acciones && <div className="d-flex gap-2 flex-wrap">{acciones}</div>}
    </header>
  );
}
