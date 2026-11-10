import type { RouteObject } from 'react-router-dom';
import { CarritoPage } from '@/pages/tienda/CarritoPage';
import { CheckoutPage } from '@/pages/tienda/CheckoutPage';
import { CompraExitosaPage } from '@/pages/tienda/CompraExitosaPage';
import { CompraFallidaPage } from '@/pages/tienda/CompraFallidaPage';
import { LoginPage } from '@/pages/tienda/LoginPage';
import { RegistroPage } from '@/pages/tienda/RegistroPage';

/**
 * Rutas de compra y cuenta (Sección 5): carrito, checkout, resultado de compra, login y registro.
 * Reemplaza el stub creado en la Sección 3.
 * Rutas relativas: son hijas de "/" (TiendaLayout).
 */
export const rutasCompraCuenta: RouteObject[] = [
  { path: 'carrito', element: <CarritoPage /> },
  { path: 'checkout', element: <CheckoutPage /> },
  { path: 'compra/exito/:ordenId', element: <CompraExitosaPage /> },
  { path: 'compra/error/:ordenId', element: <CompraFallidaPage /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'registro', element: <RegistroPage /> },
];
