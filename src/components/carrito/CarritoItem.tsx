import { Link } from 'react-router-dom';
import { ImagenConRespaldo } from '@/components/shared/ImagenConRespaldo';
import type { LineaCarrito } from '@/types';
import { formatearMoneda, resumirTexto } from '@/utils/formato';

interface CarritoItemProps {
  linea: LineaCarrito;
  onIncrementar: () => void;
  onDecrementar: () => void;
  onEliminar: () => void;
}

export function CarritoItem({ linea, onIncrementar, onDecrementar, onEliminar }: CarritoItemProps) {
  const { producto, cantidad, precioUnitario, subtotal } = linea;

  return (
    <article className="card border-0 shadow-sm p-3">
      <div className="row align-items-center g-3">
        <div className="col-3 col-sm-2 text-center">
          <ImagenConRespaldo
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded"
            style={{ maxHeight: 75, objectFit: 'cover' }}
          />
        </div>
        <div className="col-9 col-sm-4">
          <h2 className="h6 fw-bold mb-1">
            <Link to={`/productos/${producto.id}`} className="text-dark text-decoration-none">
              {producto.nombre}
            </Link>
          </h2>
          <p className="small text-muted mb-0">{resumirTexto(producto.descripcion, 60) || 'Sin descripción disponible'}</p>
        </div>
        <div className="col-6 col-sm-2 text-sm-end">
          <span className="d-block small text-muted">{formatearMoneda(precioUnitario)} c/u</span>
          <span className="fw-bold text-dark">{formatearMoneda(subtotal)}</span>
        </div>
        <div className="col-6 col-sm-4 d-flex align-items-center justify-content-end gap-2">
          <button type="button" className="btn btn-sm btn-outline-secondary px-2" onClick={onDecrementar} aria-label={`Disminuir cantidad de ${producto.nombre}`}>
            &minus;
          </button>
          <span className="badge bg-light text-dark border px-3 py-2 fs-6" aria-live="polite">{cantidad}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary px-2"
            onClick={onIncrementar}
            disabled={cantidad >= producto.stock}
            aria-label={`Aumentar cantidad de ${producto.nombre}`}
          >
            &#43;
          </button>
          <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={onEliminar} aria-label={`Eliminar ${producto.nombre} del carrito`}>
            &times;
          </button>
        </div>
      </div>
    </article>
  );
}
