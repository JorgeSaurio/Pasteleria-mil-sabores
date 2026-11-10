import type { ReactNode } from 'react';
import { DatosCompraSoloLectura } from '@/components/shared/DatosCompraSoloLectura';
import { TablaResumenItems } from '@/components/shared/TablaResumenItems';
import type { Orden } from '@/types';
import { formatearMoneda } from '@/utils/formato';

interface DetalleOrdenClienteProps {
  orden: Orden;
  /** Encabezado distinto para éxito / error. */
  encabezado: ReactNode;
  /** Botones al pie (imprimir, reintentar...). */
  acciones?: ReactNode;
  etiquetaTotal: string;
}

/**
 * Cuerpo común de las vistas "compra exitosa" y "pago con error" (Figuras 7 y 8):
 * mismos datos, distinto encabezado y acciones → se reciben por props (composición).
 */
export function DetalleOrdenCliente({ orden, encabezado, acciones, etiquetaTotal }: DetalleOrdenClienteProps) {
  return (
    <div className="container my-5">
      <div className="card border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: 900 }}>
        {encabezado}
        <DatosCompraSoloLectura cliente={orden.cliente} envio={orden.envio} />
        <TablaResumenItems
          items={orden.items.map((i) => ({ id: i.productoId, nombre: i.nombre, imagen: i.imagen, precioUnitario: i.precioUnitario, cantidad: i.cantidad }))}
        />
        <div className="card border-0 shadow-sm mt-3 p-3 text-center">
          {orden.descuento > 0 && (
            <p className="small text-success mb-1">
              Descuento {orden.cupon}: -{formatearMoneda(orden.descuento)}
            </p>
          )}
          <p className="h5 fw-bold mb-0">
            {etiquetaTotal}: {formatearMoneda(orden.total)}
          </p>
        </div>
        {acciones && <div className="d-flex justify-content-center flex-wrap gap-2 mt-4 no-imprimir">{acciones}</div>}
      </div>
    </div>
  );
}
