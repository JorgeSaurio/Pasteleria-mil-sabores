import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DURACION_NOTIFICACION_MS } from '@/config/constantes';
import type { Variante } from '@/types';

export interface Notificacion {
  id: number;
  mensaje: string;
  variante: Variante;
}

export interface NotificacionContextValor {
  notificaciones: Notificacion[];
  notificar: (mensaje: string, variante?: Variante) => void;
  descartar: (id: number) => void;
}

export const NotificacionContext = createContext<NotificacionContextValor | null>(null);

/**
 * Toasts globales: cualquier componente puede avisar algo sin pasar callbacks
 * por varios niveles (prop drilling). Reemplaza window.mostrarNotificacion.
 */
export function NotificacionProvider({ children }: { children: ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const temporizadores = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const siguienteId = useRef(1);

  const descartar = useCallback((id: number) => {
    setNotificaciones((lista) => lista.filter((n) => n.id !== id));
    clearTimeout(temporizadores.current.get(id));
    temporizadores.current.delete(id);
  }, []);

  const notificar = useCallback(
    (mensaje: string, variante: Variante = 'success') => {
      if (!mensaje) return;
      const id = siguienteId.current++;
      setNotificaciones((lista) => [...lista, { id, mensaje, variante }]);
      temporizadores.current.set(
        id,
        setTimeout(() => descartar(id), DURACION_NOTIFICACION_MS),
      );
    },
    [descartar],
  );

  // Limpia temporizadores pendientes si el provider se desmonta.
  useEffect(() => {
    const mapa = temporizadores.current;
    return () => mapa.forEach((t) => clearTimeout(t));
  }, []);

  const valor = useMemo(() => ({ notificaciones, notificar, descartar }), [notificaciones, notificar, descartar]);

  return <NotificacionContext.Provider value={valor}>{children}</NotificacionContext.Provider>;
}
