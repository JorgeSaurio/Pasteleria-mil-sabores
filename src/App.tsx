import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CarritoProvider } from '@/context/CarritoContext';
import { NotificacionProvider } from '@/context/NotificacionContext';
import { AppRouter } from '@/routes/AppRouter';

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
