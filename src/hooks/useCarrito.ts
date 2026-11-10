import { useContext } from 'react';
import { CarritoContext } from '@/context/CarritoContext';

/** Acceso tipado al contexto. Falla con un mensaje claro si falta el Provider. */
export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>.');
  return contexto;
}
