import { Link, Navigate, useParams } from 'react-router-dom';
import { DetalleOrdenCliente } from '@/components/checkout/DetalleOrdenCliente';
import { Cargando } from '@/components/shared/Cargando';
import { useAsync } from '@/hooks/useAsync';
import { ordenRepositorio } from '@/services';
import { NoEncontradoPage } from './NoEncontradoPage';

/**
 * Pago con error (nueva, Figura 8). NO vacía el carrito: el cliente puede
 * volver al checkout y reintentar sin perder su pedido.
 */
export function CompraFallidaPage() {
  const { ordenId = '' } = useParams();
  const { datos: orden, cargando } = useAsync(() => ordenRepositorio.obtenerPorId(ordenId), [ordenId]);

  if (cargando) return <Cargando />;
  if (!orden) return <NoEncontradoPage titulo="Orden no encontrada" mensaje="No encontramos la orden solicitada." />;
  if (orden.estado === 'pagada') return <Navigate to={`/compra/exito/${orden.id}`} replace />;

  return (
    <DetalleOrdenCliente
      orden={orden}
      etiquetaTotal="Total a pagar"
      encabezado={
        <div className="mb-3">
          <h1 className="h4 fw-bold text-danger mb-1">
            <span aria-hidden="true">&#10006;</span> No se pudo realizar el pago. Nro #{orden.numero}
          </h1>
          <p className="small text-muted mb-3">{orden.motivoRechazo ?? 'El pago fue rechazado.'}</p>
          <div className="text-center">
            <Link to="/checkout" className="btn btn-success">
              VOLVER A REALIZAR EL PAGO
            </Link>
          </div>
        </div>
      }
      acciones={
        <Link to="/carrito" className="btn btn-outline-dark btn-sm">
          Revisar mi carrito
        </Link>
      }
    />
  );
}
