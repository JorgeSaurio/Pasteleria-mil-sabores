import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authRepositorio, EVENTO_SESION_EXPIRADA } from '@/services';
import type { Credenciales, ResultadoOperacion, Rol, Sesion, Usuario } from '@/types';

export type EstadoAuth = 'verificando' | 'autenticado' | 'anonimo';

export interface AuthContextValor {
  usuario: Usuario | null;
  token: string | null;
  estado: EstadoAuth;
  iniciarSesion: (credenciales: Credenciales) => Promise<ResultadoOperacion<Sesion>>;
  cerrarSesion: () => Promise<void>;
  actualizarUsuario: (usuario: Usuario) => void;
  tieneRol: (...roles: Rol[]) => boolean;
}

export const AuthContext = createContext<AuthContextValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [estado, setEstado] = useState<EstadoAuth>('verificando');

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

  // El cliente HTTP avisa cuando hay un 401.
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
