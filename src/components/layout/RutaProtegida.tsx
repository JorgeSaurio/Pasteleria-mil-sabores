import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Cargando } from '@/components/shared/Cargando';
import { useAuth } from '@/hooks/useAuth';
import type { Rol } from '@/types';

interface RutaProtegidaProps {
  /** Por props para reutilizarla con distintos niveles de acceso. */
  rolesPermitidos: Rol[];
  /** Si no se pasa children, renderiza las rutas hijas (<Outlet/>). */
  children?: ReactNode;
}

/**
 * Protege rutas en el frontend. Es una ayuda de UX: la autorización real
 * la debe hacer el backend en cada endpoint.
 */
export function RutaProtegida({ rolesPermitidos, children }: RutaProtegidaProps) {
  const { estado, usuario, tieneRol } = useAuth();
  const location = useLocation();

  // Mientras se valida la sesión guardada no se expulsa a nadie.
  if (estado === 'verificando') return <Cargando texto="Verificando sesión..." />;

  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;

  if (!tieneRol(...rolesPermitidos)) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h1 className="h4">Acceso denegado</h1>
          <p className="mb-0">Tu rol ({usuario.rol}) no tiene permiso para ver esta sección.</p>
        </div>
      </div>
    );
  }

  return <>{children ?? <Outlet />}</>;
}
