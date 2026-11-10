import { Link, useParams } from 'react-router-dom';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { DatosCompraSoloLectura } from '@/components/shared/DatosCompraSoloLectura';
import { TablaResumenItems } from '@/components/shared/TablaResumenItems';
import { useAsync } from '@/hooks/useAsync';
import { ordenRepositorio } from '@/services';
import { formatearFecha, formatearMoneda, formatearRun } from '@/utils/formato';

/**
 * Boleta (nuevo). Reutiliza DatosCompraSoloLectura y TablaResumenItems:
 * una boleta se ve igual para el cliente y para el administrador.
 */
export function DetalleOrdenPage() {
  const { id = '' } = useParams();
  const { datos: orden, cargando } = useAsync(() => ordenRepositorio.obtenerPorId(id), [id]);

  const volver = (
    <>
      <button type="button" className="btn btn-outline-dark no-imprimir" onClick={() => window.print()}>
        Imprimir
      </button>
      <Link to="/admin/ordenes" className="btn btn-outline-secondary no-imprimir">
        &larr; Volver
      </Link>
    </>
  );

  if (cargando) return <Cargando />;
  if (!orden) return <Alerta mensaje="La orden no existe." variante="warning" />;

  return (
    <>
      <EncabezadoAdmin titulo={`Boleta #${orden.numero}`} subtitulo={`${orden.id} · ${formatearFecha(orden.fecha)}`} acciones={volver} />
      <div className="card border-0 shadow-sm bg-white p-4">
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
          <span className={`badge fs-6 ${orden.estado === 'pagada' ? 'bg-success' : 'bg-danger'}`}>{orden.estado.toUpperCase()}</span>
          <span className="small text-muted">
            Medio de pago: {orden.medioPago}
            {orden.runCliente && ` · Cliente registrado: ${formatearRun(orden.runCliente)}`}
          </span>
        </div>
        {orden.motivoRechazo && <Alerta mensaje={`Motivo de rechazo: ${orden.motivoRechazo}`} variante="warning" />}
        <DatosCompraSoloLectura cliente={orden.cliente} envio={orden.envio} />
        <TablaResumenItems
          items={orden.items.map((i) => ({ id: i.productoId, nombre: i.nombre, imagen: i.imagen, precioUnitario: i.precioUnitario, cantidad: i.cantidad }))}
        />
        <div className="text-end mt-3">
          <p className="mb-1">Subtotal: {formatearMoneda(orden.subtotal)}</p>
          {orden.descuento > 0 && <p className="mb-1 text-success">Descuento ({orden.cupon}): -{formatearMoneda(orden.descuento)}</p>}
          <p className="h5 fw-bold">Total: {formatearMoneda(orden.total)}</p>
        </div>
      </div>
    </>
  );
}
