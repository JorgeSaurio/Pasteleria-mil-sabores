import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ContenedorNotificaciones } from '@/components/shared/ContenedorNotificaciones';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

/**
 * Estructura de todas las páginas públicas. Se monta UNA vez: al navegar solo cambia
 * el <Outlet/>, por eso el navbar no se vuelve a montar (el contador no parpadea).
 */
export function TiendaLayout() {
  const { pathname } = useLocation();

  // Una SPA no vuelve arriba sola al cambiar de página.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <ContenedorNotificaciones />
    </div>
  );
}
