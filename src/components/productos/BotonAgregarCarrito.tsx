import { useEffect, useRef, useState } from 'react';
import { DURACION_BOTON_AGREGADO_MS } from '@/config/constantes';

interface BotonAgregarCarritoProps {
  /** Devuelve true si se agregó: solo entonces se muestra "✓ Agregado". */
  onAgregar: () => boolean;
  deshabilitado?: boolean;
  etiquetaAccesible: string;
  texto?: string;
}

/**
 * Porta marcarBotonAgregado(): tras agregar muestra "✓ Agregado" por 1,5 s.
 * Ese estado es LOCAL: si estuviera en el contexto global, agregar un producto
 * haría cambiar todos los botones de la grilla a la vez.
 */
export function BotonAgregarCarrito({
  onAgregar,
  deshabilitado = false,
  etiquetaAccesible,
  texto = 'Añadir',
}: BotonAgregarCarritoProps) {
  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();

  // Limpia el temporizador si la tarjeta se desmonta (ej. al filtrar).
  useEffect(() => () => clearTimeout(temporizador.current), []);

  const manejarClick = () => {
    if (agregado || !onAgregar()) return;
    setAgregado(true);
    temporizador.current = setTimeout(() => setAgregado(false), DURACION_BOTON_AGREGADO_MS);
  };

  return (
    <button
      type="button"
      className={`btn btn-sm btn-anadir position-relative z-2 ${agregado ? 'is-added' : ''}`}
      onClick={manejarClick}
      disabled={deshabilitado || agregado}
      aria-label={etiquetaAccesible}
    >
      {agregado ? (
        <>
          <span className="ms-check" aria-hidden="true">
            &#10003;
          </span>{' '}
          Agregado
        </>
      ) : (
        texto
      )}
    </button>
  );
}
