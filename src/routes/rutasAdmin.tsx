import type { RouteObject } from 'react-router-dom';
import { RutaProtegida } from '@/components/layout/RutaProtegida';
import { CategoriasAdminPage } from '@/pages/admin/CategoriasAdminPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { DetalleOrdenPage } from '@/pages/admin/DetalleOrdenPage';
import { HistorialComprasPage } from '@/pages/admin/HistorialComprasPage';
import { OrdenesPage } from '@/pages/admin/OrdenesPage';
import { PerfilPage } from '@/pages/admin/PerfilPage';
import { ProductoFormPage } from '@/pages/admin/ProductoFormPage';
import { ProductosAdminPage } from '@/pages/admin/ProductosAdminPage';
import { ProductosCriticosPage } from '@/pages/admin/ProductosCriticosPage';
import { ReportesPage } from '@/pages/admin/ReportesPage';
import { UsuarioFormPage } from '@/pages/admin/UsuarioFormPage';
import { UsuariosAdminPage } from '@/pages/admin/UsuariosAdminPage';

/**
 * Rutas del panel (Sección 6). Reemplaza el stub creado en la Sección 3.
 * Son hijas de "/admin", que ya exige rol Administrador o Vendedor.
 * Categorías, usuarios y reportes además exigen Administrador (RutaProtegida anidada).
 */
export const rutasAdmin: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'ordenes', element: <OrdenesPage /> },
  { path: 'ordenes/:id', element: <DetalleOrdenPage /> },
  { path: 'productos', element: <ProductosAdminPage /> },
  { path: 'productos/nuevo', element: <ProductoFormPage /> },
  { path: 'productos/criticos', element: <ProductosCriticosPage /> },
  { path: 'productos/:id/editar', element: <ProductoFormPage /> },
  { path: 'perfil', element: <PerfilPage /> },
  {
    element: <RutaProtegida rolesPermitidos={['Administrador']} />,
    children: [
      { path: 'categorias', element: <CategoriasAdminPage /> },
      { path: 'usuarios', element: <UsuariosAdminPage /> },
      { path: 'usuarios/nuevo', element: <UsuarioFormPage /> },
      { path: 'usuarios/:run/editar', element: <UsuarioFormPage /> },
      { path: 'usuarios/:run/compras', element: <HistorialComprasPage /> },
      { path: 'reportes', element: <ReportesPage /> },
    ],
  },
];
