import { useNotificacion } from '@/hooks/useNotificacion';

export function ContenedorNotificaciones() {
  const { notificaciones, descartar } = useNotificacion();

  return (
    <div className="ms-notificaciones" role="status" aria-live="polite">
      {notificaciones.map((n) => (
        <div
          key={n.id}
          className={`ms-notificacion ms-notificacion--${n.variante} is-visible`}
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={() => descartar(n.id)}
          title="Clic para cerrar"
        >
          {n.mensaje}
        </div>
      ))}
    </div>
  );
}
