import { useCallback, useEffect, useState, type DependencyList } from 'react';
import { mensajeDeError } from '@/services/http/errores';

interface EstadoAsync<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
}

/**
 * Estandariza el patrón "cargando / error / datos" de toda página que lee del repositorio.
 *
 *   const { datos, cargando, error, recargar } =
 *     useAsync(() => productoRepositorio.listar(filtro), [filtro.categoriaId]);
 *
 * Ignora respuestas que llegan tarde (componente desmontado o dependencias cambiadas),
 * así una búsqueda vieja nunca pisa a una nueva.
 * Si más adelante se adopta TanStack Query, este hook es el único punto a reemplazar.
 */
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
    // Las dependencias las define quien llama (igual que useEffect).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return { ...estado, recargar };
}
