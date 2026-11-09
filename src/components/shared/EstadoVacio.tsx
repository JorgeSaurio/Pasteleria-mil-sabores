import { Link } from 'react-router-dom';

interface EstadoVacioProps {
  titulo: string;
  mensaje: string;
  /** Botón opcional que lleva a otra ruta (ej. "Explorar productos"). */
  accion?: { texto: string; ruta: string };
}

/** Mensaje de "sin resultados / vacío", antes escrito distinto en cada página. */
export function EstadoVacio({ titulo, mensaje, accion }: EstadoVacioProps) {
  return (
    <div className="alert alert-info text-center py-5 shadow-sm mb-0">
      <h2 className="alert-heading font-titulo h4">{titulo}</h2>
      <p className={accion ? 'mb-3' : 'mb-0'}>{mensaje}</p>
      {accion && (
        <Link to={accion.ruta} className="btn btn-anadir">
          {accion.texto}
        </Link>
      )}
    </div>
  );
}
