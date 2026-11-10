import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CarritoProvider } from '@/context/CarritoContext';
import { NotificacionProvider } from '@/context/NotificacionContext';
import { AppRouter } from '@/routes/AppRouter';

/**
 * Raíz de la app (reemplaza al App provisional de la Sección 1).
 * Orden de providers: Notificación envuelve a Carrito porque el carrito notifica
 * al agregar productos; Auth va antes porque Navbar y Checkout leen la sesión.
 */
export default function App() {
  return (
    <BrowserRouter>
      <NotificacionProvider>
        <AuthProvider>
          <CarritoProvider>
            <AppRouter />
          </CarritoProvider>
        </AuthProvider>
      </NotificacionProvider>
    </BrowserRouter>
  );
}
