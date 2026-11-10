import { useContext } from 'react';
import { NotificacionContext } from '@/context/NotificacionContext';

/** Acceso tipado al contexto. Falla con un mensaje claro si falta el Provider. */
export function useNotificacion() {
  const contexto = useContext(NotificacionContext);
  if (!contexto) throw new Error('useNotificacion debe usarse dentro de <NotificacionProvider>.');
  return contexto;
}
