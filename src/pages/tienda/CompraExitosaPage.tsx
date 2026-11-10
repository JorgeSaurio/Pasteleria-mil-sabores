import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DetalleOrdenCliente } from '@/components/checkout/DetalleOrdenCliente';
import { Cargando } from '@/components/shared/Cargando';
import { useAsync } from '@/hooks/useAsync';
import { useCarrito } from '@/hooks/useCarrito';
import { useNotificacion } from '@/hooks/useNotificacion';
import { ordenRepositorio } from '@/services';
import { formatearFecha } from '@/utils/formato';
import { NoEncontradoPage } from './NoEncontradoPage';

export function CompraExitosaPage() {
  const { ordenId = '' } = useParams();
  const { vaciar } = useCarrito();
  const { notificar } = useNotificacion();
  const { datos: orden, cargando } = useAsync(() => ordenRepositorio.obtenerPorId(ordenId), [ordenId]);

  // El pago se concretó. Ahora se vacía el carrito.
  const pagada = orden?.estado === 'pagada';
  useEffect(() => {
    if (pagada) vaciar();
  }, [pagada, vaciar]);

  if (cargando) return <Cargando texto="Cargando tu compra..." />;
  if (!orden) return <NoEncontradoPage titulo="Orden no encontrada" mensaje="No encontramos la orden solicitada." />;
  if (!pagada) return <Navigate to={`/compra/error/${orden.id}`} replace />;

  return (
    <DetalleOrdenCliente
      orden={orden}
      etiquetaTotal="Total pagado"
      encabezado={
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h1 className="h4 fw-bold text-success mb-1">
              <span aria-hidden="true">&#10004;</span> Se ha realizado la compra. Nro #{orden.numero}
            </h1>
            <p className="small text-muted mb-0">{formatearFecha(orden.fecha)}</p>
          </div>
          <span className="small text-muted">Código orden: {orden.id}</span>
        </div>
      }
      acciones={
        <>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => window.print()}>
            Imprimir boleta en PDF
          </button>
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => notificar(`Boleta enviada a ${orden.cliente.email} (simulado).`, 'info')}
          >
            Enviar boleta por email
          </button>
          <Link to="/productos" className="btn btn-outline-dark btn-sm">
            Seguir comprando
          </Link>
        </>
      }
    />
  );
}
