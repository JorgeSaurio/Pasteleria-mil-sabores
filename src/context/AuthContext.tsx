import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authRepositorio, EVENTO_SESION_EXPIRADA } from '@/services';
import type { Credenciales, ResultadoOperacion, Rol, Sesion, Usuario } from '@/types';

export type EstadoAuth = 'verificando' | 'autenticado' | 'anonimo';

export interface AuthContextValor {
  usuario: Usuario | null;
  token: string | null;
  /** "verificando" mientras se valida la sesión guardada al abrir la app. */
  estado: EstadoAuth;
  iniciarSesion: (credenciales: Credenciales) => Promise<ResultadoOperacion<Sesion>>;
  cerrarSesion: () => Promise<void>;
  /** Tras editar el perfil, refresca los datos en memoria sin re-loguear. */
  actualizarUsuario: (usuario: Usuario) => void;
  tieneRol: (...roles: Rol[]) => boolean;
}

export const AuthContext = createContext<AuthContextValor | null>(null);

/**
 * Sesión global. El rol aquí solo decide QUÉ SE MUESTRA;
 * quien autoriza de verdad es el backend en cada endpoint.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [estado, setEstado] = useState<EstadoAuth>('verificando');

  // Al abrir la app: recuperar y validar la sesión guardada.
  useEffect(() => {
    let vigente = true;
    authRepositorio
      .obtenerSesion()
      .then((guardada) => {
        if (!vigente) return;
        setSesion(guardada);
        setEstado(guardada ? 'autenticado' : 'anonimo');
      })
      .catch(() => vigente && setEstado('anonimo'));
    return () => {
      vigente = false;
    };
  }, []);

  // El cliente HTTP emite este evento ante un 401 (token vencido o inválido).
  useEffect(() => {
    const alExpirar = () => {
      setSesion(null);
      setEstado('anonimo');
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  const iniciarSesion = useCallback(async (credenciales: Credenciales) => {
    const resultado = await authRepositorio.iniciarSesion(credenciales);
    if (resultado.ok && resultado.dato) {
      setSesion(resultado.dato);
      setEstado('autenticado');
    }
    return resultado;
  }, []);

  const cerrarSesion = useCallback(async () => {
    await authRepositorio.cerrarSesion();
    setSesion(null);
    setEstado('anonimo');
  }, []);

  const actualizarUsuario = useCallback((usuario: Usuario) => {
    setSesion((actual) => (actual ? { ...actual, usuario } : actual));
  }, []);

  const tieneRol = useCallback((...roles: Rol[]) => !!sesion && roles.includes(sesion.usuario.rol), [sesion]);

  const valor = useMemo<AuthContextValor>(
    () => ({
      usuario: sesion?.usuario ?? null,
      token: sesion?.token ?? null,
      estado,
      iniciarSesion,
      cerrarSesion,
      actualizarUsuario,
      tieneRol,
    }),
    [sesion, estado, iniciarSesion, cerrarSesion, actualizarUsuario, tieneRol],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
