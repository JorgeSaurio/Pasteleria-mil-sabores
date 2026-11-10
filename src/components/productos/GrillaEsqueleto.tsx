import { COLUMNAS_POR_DEFECTO } from './ProductoGrilla';

interface GrillaEsqueletoProps {
  cantidad?: number;
  columnas?: string;
}

/** Tarjetas "fantasma" mientras cargan los productos (clases ms-esqueleto del CSS original). */
export function GrillaEsqueleto({ cantidad = 8, columnas = COLUMNAS_POR_DEFECTO }: GrillaEsqueletoProps) {
  return (
    <div className={`row ${columnas} g-4`} aria-hidden="true">
      {Array.from({ length: cantidad }, (_, i) => (
        <div className="col" key={i}>
          <article className="card h-100 border-0 shadow-sm product-card">
            <div className="ms-esqueleto ms-esqueleto--img" />
            <div className="card-body d-flex flex-column">
              <div className="ms-esqueleto ms-esqueleto--linea ms-esqueleto--ancho-75" />
              <div className="ms-esqueleto ms-esqueleto--linea ms-esqueleto--ancho-50" />
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="ms-esqueleto ms-esqueleto--linea ms-esqueleto--precio" />
                <div className="ms-esqueleto ms-esqueleto--boton" />
              </div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
