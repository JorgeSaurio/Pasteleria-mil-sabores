import { test, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import type { Usuario } from '@/types';
import { renderConRouter } from '@/test/renderConProveedores';
import { TablaUsuarios } from './TablaUsuarios';

const base: Omit<Usuario, 'run' | 'nombre' | 'rol'> = {
  apellidos: 'Pérez',
  email: 'correo@duoc.cl',
  region: 'Tarapacá',
  comuna: 'Iquique',
  direccion: 'Calle 1',
};

test('debería ocultar el botón Eliminar en la fila del usuario en sesión', () => {
  const usuarios: Usuario[] = [
    { ...base, run: '111111111', nombre: 'Admin', rol: 'Administrador' },
    { ...base, run: '123456785', nombre: 'Cliente', rol: 'Cliente' },
  ];

  renderConRouter(<TablaUsuarios usuarios={usuarios} runActual="111111111" onEliminar={vi.fn()} />);

  const filaPropia = screen.getByRole('row', { name: /11\.111\.111-1/ });
  const filaOtra = screen.getByRole('row', { name: /12\.345\.678-5/ });
  expect(within(filaPropia).queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
  expect(within(filaOtra).getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
});
