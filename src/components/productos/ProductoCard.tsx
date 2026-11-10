import { Link } from 'react-router-dom';
import { ImagenConRespaldo } from '@/components/shared/ImagenConRespaldo';
import type { Producto } from '@/types';
import { estaEnOferta, precioVigente, tieneStock } from '@/utils/carrito';
import { formatearMoneda, resumirTexto } from '@/utils/formato';
import { BotonAgregarCarrito } from './BotonAgregarCarrito';

export interface ProductoCardProps {
  producto: Producto;
  onAgregar?: (producto: Producto) => boolean;
  nombreCategoria?: string;
  mostrarDescripcion?: boolean;
  altoImagen?: number;
  compacta?: boolean;
}

export function ProductoCard({
  producto,
  onAgregar,
  nombreCategoria,
  mostrarDescripcion = false,
  altoImagen = 180,
  compacta = false,
}: ProductoCardProps) {
  const disponible = tieneStock(producto, 1);
  const enOferta = estaEnOferta(producto);
  const ruta = `/productos/${producto.id}`;

  return (
    <article className={`card h-100 border-0 shadow-sm product-card ${compacta ? 'text-center p-2' : ''}`}>
      <Link to={ruta} className="text-decoration-none d-block position-relative">
        {enOferta && <span className="badge badge-oferta position-absolute top-0 start-0 m-2">Oferta</span>}
        <ImagenConRespaldo
          src={producto.imagen}
          alt={producto.nombre}
          className="card-img-top p-3"
          style={{ height: altoImagen, objectFit: 'contain' }}
        />
      </Link>

      <div className={`card-body d-flex flex-column ${compacta ? 'p-2' : ''}`}>
        {nombreCategoria && (
          <span className="badge bg-light text-muted border mb-2 align-self-start">{nombreCategoria}</span>
        )}
        <h3 className={`card-title fw-bold mb-1 ${compacta ? 'small' : 'fs-6'}`}>
          <Link to={ruta} className="text-dark text-decoration-none stretched-link">
            {producto.nombre}
          </Link>
        </h3>
        {mostrarDescripcion && (
          <p className="card-text text-muted small flex-grow-1">{resumirTexto(producto.descripcion)}</p>
        )}

        <div className={`d-flex align-items-center gap-2 mt-auto pt-2 ${compacta ? 'justify-content-center' : 'justify-content-between'}`}>
          <div>
            {enOferta && <span className="precio-anterior d-block">{formatearMoneda(producto.precio)}</span>}
            <span className={`fw-bold text-dark ${compacta ? 'small' : 'fs-6'}`}>
              {formatearMoneda(precioVigente(producto))}
            </span>
          </div>
          {!compacta && onAgregar && (
            <BotonAgregarCarrito
              onAgregar={() => onAgregar(producto)}
              deshabilitado={!disponible}
              texto={disponible ? 'Añadir' : 'Sin stock'}
              etiquetaAccesible={disponible ? `Agregar ${producto.nombre} al carrito` : `${producto.nombre} sin stock`}
            />
          )}
        </div>
      </div>
    </article>
  );
}
