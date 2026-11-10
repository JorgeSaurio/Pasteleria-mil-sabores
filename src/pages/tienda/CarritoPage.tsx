import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarritoItem } from '@/components/carrito/CarritoItem';
import { CuponDescuento } from '@/components/carrito/CuponDescuento';
import { ResumenCompra } from '@/components/carrito/ResumenCompra';
import { Cargando } from '@/components/shared/Cargando';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { ModalConfirmacion } from '@/components/shared/ModalConfirmacion';
import { useCarrito } from '@/hooks/useCarrito';

/**
 * Carrito. Subtotal/descuento/total son DERIVADOS (vienen calculados del contexto),
 * nunca estado propio. El botón ya no hace alert(): lleva al checkout.
 */
export function CarritoPage() {
  const carrito = useCarrito();
  const navigate = useNavigate();
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);

  const vacio = carrito.items.length === 0;
  const cargando = !carrito.cargado || (carrito.cargandoLineas && carrito.lineas.length === 0);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="display-6 fw-bold mb-0">Mi carrito de compras</h1>
        {!vacio && (
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setConfirmarVaciar(true)}>
            Vaciar carrito
          </button>
        )}
      </div>

      <div className="row g-5">
        <section className="col-lg-8">
          {cargando && !vacio ? (
            <Cargando texto="Cargando tu carrito..." />
          ) : vacio ? (
            <EstadoVacio
              titulo="Tu carrito está vacío"
              mensaje="Aún no has añadido deliciosas tortas o postres a tu pedido."
              accion={{ texto: 'Explorar productos', ruta: '/productos' }}
            />
          ) : (
            <div className="d-flex flex-column gap-3">
              {carrito.lineas.map((linea) => (
                <CarritoItem
                  key={linea.productoId}
                  linea={linea}
                  onIncrementar={() => carrito.modificarCantidad(linea.productoId, 1)}
                  onDecrementar={() => carrito.modificarCantidad(linea.productoId, -1)}
                  onEliminar={() => carrito.eliminar(linea.productoId)}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="col-lg-4">
          <ResumenCompra
            subtotal={carrito.subtotal}
            descuento={carrito.descuento}
            total={carrito.total}
            textoAccion="IR A PAGAR"
            onAccion={() => navigate('/checkout')}
            accionDeshabilitada={vacio || cargando}
          >
            <CuponDescuento cuponActivo={carrito.cupon} onAplicar={carrito.aplicarCupon} />
          </ResumenCompra>
          <p className="small text-muted mt-2 mb-0">El total final se confirma al momento del pago.</p>
        </aside>
      </div>

      <ModalConfirmacion
        abierto={confirmarVaciar}
        titulo="Vaciar carrito"
        mensaje="¿Seguro que quieres quitar todos los productos del carrito?"
        textoConfirmar="Vaciar"
        onCancelar={() => setConfirmarVaciar(false)}
        onConfirmar={() => {
          carrito.vaciar();
          setConfirmarVaciar(false);
        }}
      />
    </div>
  );
}
