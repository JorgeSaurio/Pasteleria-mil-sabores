import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/** Acceso tipado al contexto. Falla con un mensaje claro si falta el Provider. */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return contexto;
}
