import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ContenedorNotificaciones } from '@/components/shared/ContenedorNotificaciones';
import { MENU_ADMIN } from '@/config/menuAdmin';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';

/**
 * Estructura del panel admin: barra superior + menú lateral + contenido.
 * "sidebarAbierto" solo importa en pantallas chicas (en md+ el menú siempre se ve).
 */
export function AdminLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!usuario) return null; // RutaProtegida ya garantiza sesión; esto solo satisface a TypeScript.

  const itemsVisibles = MENU_ADMIN.filter((item) => item.roles.includes(usuario.rol));

  const salir = async () => {
    await cerrarSesion();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <header className="navbar navbar-dark bg-dark px-3 py-2 no-imprimir">
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-md-none"
            aria-label="Mostrar menú"
            aria-expanded={sidebarAbierto}
            onClick={() => setSidebarAbierto((valor) => !valor)}
          >
            Menú
          </button>
          <Link to="/admin" className="navbar-brand mb-0 h1">
            Mil Sabores · Admin
          </Link>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-white-50 small d-none d-sm-inline">{usuario.nombre}</span>
          <Link to="/" className="btn btn-sm btn-outline-light">
            Ver tienda
          </Link>
          <button type="button" className="btn btn-sm btn-danger" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="container-fluid px-4 py-4 flex-grow-1">
        <div className="row g-4">
          <aside className={`col-lg-2 col-md-3 no-imprimir ${sidebarAbierto ? '' : 'd-none d-md-block'}`}>
            <AdminSidebar items={itemsVisibles} rol={usuario.rol} onNavegar={() => setSidebarAbierto(false)} />
          </aside>
          <section className="col-lg-10 col-md-9">
            <Outlet />
          </section>
        </div>
      </div>
      <ContenedorNotificaciones />
    </div>
  );
}
