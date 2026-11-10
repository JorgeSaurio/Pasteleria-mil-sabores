import type { ItemOrden, Orden, ResultadoCupon } from '@/types';
import { calcularDescuento, calcularTotal, precioVigente, tieneStock } from '@/utils/carrito';
import type { PagoRepositorio } from '../contratos/PagoRepositorio';
import { registrarOrden } from './ordenLocal';
import { cargarProductos, guardarProductos } from './productoLocal';
import { limpiarRun } from './usuarioLocal';
import { exito, fallo, responder } from './utilidades';

// Simula el servidor. Esto lo hará el backend.
const CUPONES: Record<string, number> = { FELICES50: 0.1 };

function evaluarCupon(codigo: string): ResultadoCupon {
  const normalizado = (codigo ?? '').trim().toUpperCase();
  const porcentaje = CUPONES[normalizado];
  if (!normalizado) return { valido: false, codigo: '', porcentaje: 0, mensaje: '' };
  if (porcentaje === undefined) {
    return { valido: false, codigo: normalizado, porcentaje: 0, mensaje: 'Cupón inválido o caducado.' };
  }
  return {
    valido: true,
    codigo: normalizado,
    porcentaje,
    mensaje: `Cupón ${normalizado} aplicado: ${Math.round(porcentaje * 100)}% de descuento.`,
  };
}

export const pagoLocal: PagoRepositorio = {
  async validarCupon(codigo) {
    return responder(evaluarCupon(codigo));
  },

  async procesarPago(solicitud) {
    if (!solicitud.items.length) return responder(fallo<Orden>('El carrito está vacío.'));

    const productos = cargarProductos();
    const items: ItemOrden[] = [];
    let motivoRechazo: string | undefined;

    // El precio sale del catálogo, nunca del cliente.
    for (const item of solicitud.items) {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto) {
        motivoRechazo = `Un producto del carrito ya no está disponible (${item.productoId}).`;
        continue;
      }
      const cantidad = Math.max(1, Math.floor(item.cantidad));
      if (!tieneStock(producto, cantidad)) {
        motivoRechazo = `Stock insuficiente para ${producto.nombre} (disponible: ${producto.stock}).`;
      }
      items.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precioUnitario: precioVigente(producto),
        cantidad,
        imagen: producto.imagen,
      });
    }

    if (!motivoRechazo && solicitud.medioPago === 'prueba-rechazo') {
      motivoRechazo = 'El medio de pago fue rechazado por el emisor (simulación).';
    }

    const cupon = evaluarCupon(solicitud.cupon ?? '');
    const subtotal = items.reduce((suma, i) => suma + i.precioUnitario * i.cantidad, 0);
    const descuento = calcularDescuento(subtotal, cupon.valido ? cupon.porcentaje : 0);
    const estado = motivoRechazo ? 'rechazada' : 'pagada';

    const orden = registrarOrden({
      fecha: new Date().toISOString(),
      runCliente: solicitud.runCliente ? limpiarRun(solicitud.runCliente) : undefined,
      cliente: solicitud.cliente,
      envio: solicitud.envio,
      items,
      cupon: cupon.valido ? cupon.codigo : undefined,
      subtotal,
      descuento,
      total: calcularTotal(subtotal, descuento),
      medioPago: solicitud.medioPago,
      estado,
      motivoRechazo,
    });

    if (estado === 'pagada') {
      // El stock baja solo si el pago se concretó.
      guardarProductos(
        productos.map((p) => {
          const vendido = items.find((i) => i.productoId === p.id);
          return vendido ? { ...p, stock: p.stock - vendido.cantidad } : p;
        }),
      );
      return responder(exito(`¡Compra realizada! Orden #${orden.numero}`, orden));
    }

    return responder({ ok: false, mensaje: motivoRechazo ?? 'No se pudo realizar el pago.', dato: orden });
  },
};
