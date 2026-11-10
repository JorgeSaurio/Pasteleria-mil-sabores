import { useEffect, useRef, useState } from 'react';
import { DURACION_BOTON_AGREGADO_MS } from '@/config/constantes';

interface BotonAgregarCarritoProps {
  onAgregar: () => boolean;
  deshabilitado?: boolean;
  etiquetaAccesible: string;
  texto?: string;
}

export function BotonAgregarCarrito({
  onAgregar,
  deshabilitado = false,
  etiquetaAccesible,
  texto = 'Añadir',
}: BotonAgregarCarritoProps) {
  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();

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
