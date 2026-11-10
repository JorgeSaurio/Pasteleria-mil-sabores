import { useRoutes, type RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { RutaProtegida } from '@/components/layout/RutaProtegida';
import { TiendaLayout } from '@/components/layout/TiendaLayout';
import { NoEncontradoPage } from '@/pages/tienda/NoEncontradoPage';
import { rutasAdmin } from './rutasAdmin';
import { rutasCatalogo } from './rutasCatalogo';
import { rutasCompraCuenta } from './rutasCompraCuenta';

/**
 * Árbol de rutas. Cada área aporta su propio arreglo de rutas en un archivo aparte
 * (rutasCatalogo, rutasCompraCuenta, rutasAdmin): así cada integrante edita SOLO su
 * archivo y los merges no chocan en este.
 */
const rutas: RouteObject[] = [
  {
    path: '/',
    element: <TiendaLayout />,
    children: [...rutasCatalogo, ...rutasCompraCuenta, { path: '*', element: <NoEncontradoPage /> }],
  },
  {
    path: '/admin',
    element: (
      <RutaProtegida rolesPermitidos={['Administrador', 'Vendedor']}>
        <AdminLayout />
      </RutaProtegida>
    ),
    children: rutasAdmin,
  },
];

export function AppRouter() {
  return useRoutes(rutas);
}
