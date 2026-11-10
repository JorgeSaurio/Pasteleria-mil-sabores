import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ContenedorNotificaciones } from '@/components/shared/ContenedorNotificaciones';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function TiendaLayout() {
  const { pathname } = useLocation();

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
