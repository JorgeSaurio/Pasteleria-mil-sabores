import { createContext, useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { CANTIDAD_MAXIMA_ITEM } from '@/config/constantes';
import { useNotificacion } from '@/hooks/useNotificacion';
import { carritoRepositorio, pagoRepositorio, productoRepositorio } from '@/services';
import type { ItemCarrito, LineaCarrito, Producto, ResultadoCupon } from '@/types';
import { calcularDescuento, calcularSubtotal, calcularTotal, precioVigente } from '@/utils/carrito';
import { carritoReducer, ESTADO_INICIAL_CARRITO } from './carritoReducer';

export interface CarritoContextValor {
  /** false hasta leer el carrito guardado (evita redirigir "por carrito vacío" al recargar). */
  cargado: boolean;
  items: ItemCarrito[];
  /** Items + producto actual del catálogo (derivado, nunca se persiste). */
  lineas: LineaCarrito[];
  cargandoLineas: boolean;
  totalItems: number;
  cupon: ResultadoCupon | null;
  /** Montos ESTIMADOS para mostrar; el total oficial lo calcula procesarPago. */
  subtotal: number;
  descuento: number;
  total: number;
  /** Recibe el producto completo (la tarjeta ya lo tiene) para validar stock sin otra petición. */
  agregar: (producto: Producto, cantidad?: number) => boolean;
  modificarCantidad: (productoId: string, delta: number) => boolean;
  eliminar: (productoId: string) => void;
  vaciar: () => void;
  aplicarCupon: (codigo: string) => Promise<ResultadoCupon>;
}

export const CarritoContext = createContext<CarritoContextValor | null>(null);

const CUPON_VACIO: ResultadoCupon = { valido: false, codigo: '', porcentaje: 0, mensaje: '' };

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(carritoReducer, ESTADO_INICIAL_CARRITO);
  const [productos, setProductos] = useState<Record<string, Producto>>({});
  const [cargandoLineas, setCargandoLineas] = useState(false);
  const { notificar } = useNotificacion();

  // 1) Cargar lo guardado (y revalidar el cupón: pudo caducar).
  useEffect(() => {
    let vigente = true;
    (async () => {
      const guardado = await carritoRepositorio.obtener();
      const cupon = guardado.cupon ? await pagoRepositorio.validarCupon(guardado.cupon) : null;
      if (vigente) dispatch({ tipo: 'CARGAR', items: guardado.items, cupon: cupon?.valido ? cupon : null });
    })();
    return () => {
      vigente = false;
    };
  }, []);

  // 2) Persistir cada cambio (solo después de haber cargado).
  useEffect(() => {
    if (!estado.cargado) return;
    void carritoRepositorio.guardar({ items: estado.items, cupon: estado.cupon?.codigo ?? null });
  }, [estado.items, estado.cupon, estado.cargado]);

  // 3) Traer los productos actuales de los ids del carrito (precio y stock al día).
  const claveIds = estado.items
    .map((i) => i.productoId)
    .sort()
    .join('|');

  useEffect(() => {
    if (!claveIds) {
      setProductos({});
      return;
    }
    let vigente = true;
    const ids = claveIds.split('|');
    setCargandoLineas(true);
    productoRepositorio
      .obtenerPorIds(ids)
      .then((lista) => {
        if (!vigente) return;
        setProductos(Object.fromEntries(lista.map((p) => [p.id, p])));
        // Productos eliminados del catálogo salen del carrito.
        if (lista.length < ids.length) dispatch({ tipo: 'QUITAR_INEXISTENTES', idsValidos: lista.map((p) => p.id) });
      })
      .finally(() => vigente && setCargandoLineas(false));
    return () => {
      vigente = false;
    };
  }, [claveIds]);

  const lineas = useMemo<LineaCarrito[]>(
    () =>
      estado.items.flatMap((item) => {
        const producto = productos[item.productoId];
        if (!producto) return [];
        const precioUnitario = precioVigente(producto);
        return [{ ...item, producto, precioUnitario, subtotal: precioUnitario * item.cantidad }];
      }),
    [estado.items, productos],
  );

  const agregar = useCallback(
    (producto: Producto, cantidad = 1) => {
      const enCarrito = estado.items.find((i) => i.productoId === producto.id)?.cantidad ?? 0;
      const pedido = enCarrito + Math.floor(cantidad);

      if (cantidad < 1) {
        notificar('Cantidad inválida.', 'danger');
        return false;
      }
      if (pedido > producto.stock) {
        notificar(
          producto.stock <= 0
            ? `${producto.nombre} no tiene stock disponible.`
            : `Solo quedan ${producto.stock} unidades de ${producto.nombre}.`,
          'warning',
        );
        return false;
      }
      if (pedido > CANTIDAD_MAXIMA_ITEM) {
        notificar(`Máximo ${CANTIDAD_MAXIMA_ITEM} unidades por producto.`, 'warning');
        return false;
      }

      setProductos((previos) => ({ ...previos, [producto.id]: producto }));
      dispatch({ tipo: 'AGREGAR', productoId: producto.id, cantidad });
      notificar(`${producto.nombre} agregado al carrito (${pedido} ${pedido === 1 ? 'unidad' : 'unidades'}).`);
      return true;
    },
    [estado.items, notificar],
  );

  const modificarCantidad = useCallback(
    (productoId: string, delta: number) => {
      const item = estado.items.find((i) => i.productoId === productoId);
      const producto = productos[productoId];
      if (!item) return false;
      if (delta > 0 && producto && item.cantidad + delta > Math.min(producto.stock, CANTIDAD_MAXIMA_ITEM)) {
        notificar(`Solo quedan ${producto.stock} unidades de ${producto.nombre}.`, 'warning');
        return false;
      }
      dispatch({ tipo: 'MODIFICAR', productoId, delta });
      return true;
    },
    [estado.items, productos, notificar],
  );

  const eliminar = useCallback(
    (productoId: string) => {
      dispatch({ tipo: 'ELIMINAR', productoId });
      notificar('Producto eliminado del carrito.', 'info');
    },
    [notificar],
  );

  const vaciar = useCallback(() => dispatch({ tipo: 'VACIAR' }), []);

  const aplicarCupon = useCallback(async (codigo: string) => {
    if (!codigo.trim()) {
      dispatch({ tipo: 'CUPON', cupon: null });
      return CUPON_VACIO;
    }
    const resultado = await pagoRepositorio.validarCupon(codigo);
    dispatch({ tipo: 'CUPON', cupon: resultado.valido ? resultado : null });
    return resultado;
  }, []);

  const subtotal = calcularSubtotal(lineas);
  const descuento = calcularDescuento(subtotal, estado.cupon?.porcentaje ?? 0);
  const total = calcularTotal(subtotal, descuento);
  const totalItems = estado.items.reduce((suma, i) => suma + i.cantidad, 0);

  const valor = useMemo<CarritoContextValor>(
    () => ({
      cargado: estado.cargado,
      items: estado.items,
      lineas,
      cargandoLineas,
      totalItems,
      cupon: estado.cupon,
      subtotal,
      descuento,
      total,
      agregar,
      modificarCantidad,
      eliminar,
      vaciar,
      aplicarCupon,
    }),
    [estado.cargado, estado.items, estado.cupon, lineas, cargandoLineas, totalItems, subtotal, descuento, total, agregar, modificarCantidad, eliminar, vaciar, aplicarCupon],
  );

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}
