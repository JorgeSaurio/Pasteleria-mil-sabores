import { useCallback, useEffect, useState, type DependencyList } from 'react';
import { mensajeDeError } from '@/services/http/errores';

interface EstadoAsync<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
}

export function useAsync<T>(funcion: () => Promise<T>, dependencias: DependencyList) {
  const [estado, setEstado] = useState<EstadoAsync<T>>({ datos: null, cargando: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let vigente = true;
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));

    funcion()
      .then((datos) => {
        if (vigente) setEstado({ datos, cargando: false, error: null });
      })
      .catch((error: unknown) => {
        if (vigente) setEstado({ datos: null, cargando: false, error: mensajeDeError(error) });
      });

    return () => {
      vigente = false;
    };
    // Las dependencias las define quien llama.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return { ...estado, recargar };
}
