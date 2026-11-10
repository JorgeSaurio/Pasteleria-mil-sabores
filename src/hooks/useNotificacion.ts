import { useContext } from 'react';
import { NotificacionContext } from '@/context/NotificacionContext';

export function useNotificacion() {
  const contexto = useContext(NotificacionContext);
  if (!contexto) throw new Error('useNotificacion debe usarse dentro de <NotificacionProvider>.');
  return contexto;
}
