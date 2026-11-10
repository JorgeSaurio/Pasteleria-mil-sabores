import { useRoutes, type RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { RutaProtegida } from '@/components/layout/RutaProtegida';
import { TiendaLayout } from '@/components/layout/TiendaLayout';
import { NoEncontradoPage } from '@/pages/tienda/NoEncontradoPage';
import { rutasAdmin } from './rutasAdmin';
import { rutasCatalogo } from './rutasCatalogo';
import { rutasCompraCuenta } from './rutasCompraCuenta';

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
