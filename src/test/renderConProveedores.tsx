import type { ReactElement } from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextValor } from '@/context/AuthContext';
import { CarritoContext, type CarritoContextValor } from '@/context/CarritoContext';
import { NotificacionContext, type NotificacionContextValor } from '@/context/NotificacionContext';

export const FLAGS_ROUTER = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

interface OpcionesRouter {
  ruta?: string;
}

export function renderConRouter(ui: ReactElement, { ruta = '/' }: OpcionesRouter = {}) {
  return render(<MemoryRouter initialEntries={[ruta]} future={FLAGS_ROUTER}>{ui}</MemoryRouter>);
}

export function crearAuthFalso(valores: Partial<AuthContextValor> = {}): AuthContextValor {
  return {
    usuario: null,
    token: null,
    estado: 'anonimo',
    iniciarSesion: vi.fn(),
    cerrarSesion: vi.fn().mockResolvedValue(undefined),
    actualizarUsuario: vi.fn(),
    tieneRol: vi.fn().mockReturnValue(false),
    ...valores,
  };
}

export function crearCarritoFalso(valores: Partial<CarritoContextValor> = {}): CarritoContextValor {
  return {
    cargado: true,
    items: [],
    lineas: [],
    cargandoLineas: false,
    totalItems: 0,
    cupon: null,
    subtotal: 0,
    descuento: 0,
    total: 0,
    agregar: vi.fn().mockReturnValue(true),
    modificarCantidad: vi.fn().mockReturnValue(true),
    eliminar: vi.fn(),
    vaciar: vi.fn(),
    aplicarCupon: vi.fn(),
    ...valores,
  };
}

export function crearNotificacionFalsa(valores: Partial<NotificacionContextValor> = {}): NotificacionContextValor {
  return {
    notificaciones: [],
    notificar: vi.fn(),
    descartar: vi.fn(),
    ...valores,
  };
}

interface OpcionesContextos extends OpcionesRouter {
  auth?: Partial<AuthContextValor>;
  carrito?: Partial<CarritoContextValor>;
  notificacion?: Partial<NotificacionContextValor>;
}

export function renderConContextos(
  ui: ReactElement,
  { auth, carrito, notificacion, ruta = '/' }: OpcionesContextos = {},
) {
  const valores = {
    auth: crearAuthFalso(auth),
    carrito: crearCarritoFalso(carrito),
    notificacion: crearNotificacionFalsa(notificacion),
  };
  const resultado = render(
    <MemoryRouter initialEntries={[ruta]} future={FLAGS_ROUTER}>
      <AuthContext.Provider value={valores.auth}>
        <CarritoContext.Provider value={valores.carrito}>
          <NotificacionContext.Provider value={valores.notificacion}>{ui}</NotificacionContext.Provider>
        </CarritoContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
  return { ...resultado, ...valores };
}
