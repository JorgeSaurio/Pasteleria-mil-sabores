import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FormularioCheckout, type DatosCheckout } from '@/components/checkout/FormularioCheckout';
import { Cargando } from '@/components/shared/Cargando';
import { TablaResumenItems } from '@/components/shared/TablaResumenItems';
import { useAuth } from '@/hooks/useAuth';
import { useCarrito } from '@/hooks/useCarrito';
import { useNotificacion } from '@/hooks/useNotificacion';
import { mensajeDeError, pagoRepositorio } from '@/services';
import { formatearMoneda } from '@/utils/formato';

export function CheckoutPage() {
  const carrito = useCarrito();
  const { usuario, estado } = useAuth();
  const { notificar } = useNotificacion();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  if (!carrito.cargado || estado === 'verificando') return <Cargando />;
  if (carrito.items.length === 0 && !procesando) return <Navigate to="/carrito" replace />;

  const pagar = async (datos: DatosCheckout) => {
    setProcesando(true);
    try {
      const resultado = await pagoRepositorio.procesarPago({
        items: carrito.items,
        cupon: carrito.cupon?.codigo,
        runCliente: usuario?.run,
        ...datos,
      });
      if (resultado.dato) {
        navigate(`/compra/${resultado.ok ? 'exito' : 'error'}/${resultado.dato.id}`);
      } else {
        notificar(resultado.mensaje, 'danger');
      }
    } catch (error) {
      notificar(mensajeDeError(error), 'danger');
    } finally {
      setProcesando(false);
    }
  };

  const items = carrito.lineas.map((l) => ({
    id: l.productoId,
    nombre: l.producto.nombre,
    imagen: l.producto.imagen,
    precioUnitario: l.precioUnitario,
    cantidad: l.cantidad,
  }));

  return (
    <div className="container my-5">
      <div className="card border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
          <div>
            <h1 className="h4 fw-bold mb-1">Carrito de compra</h1>
            <p className="small text-muted mb-0">Revisa tu pedido y completa tus datos</p>
          </div>
          <span className="badge bg-primary fs-6 px-3 py-2">Total a pagar: {formatearMoneda(carrito.total)}</span>
        </div>

        <TablaResumenItems items={items} />
        {carrito.descuento > 0 && (
          <p className="text-success small text-end mt-2 mb-0">
            Incluye descuento {carrito.cupon?.codigo}: -{formatearMoneda(carrito.descuento)}
          </p>
        )}

        <FormularioCheckout
          key={usuario?.run ?? 'anonimo'}
          valoresIniciales={
            usuario
              ? {
                  nombre: usuario.nombre,
                  apellidos: usuario.apellidos,
                  email: usuario.email,
                  calle: usuario.direccion,
                  region: usuario.region,
                  comuna: usuario.comuna,
                }
              : undefined
          }
          total={carrito.total}
          procesando={procesando}
          onPagar={pagar}
        />
      </div>
    </div>
  );
}
