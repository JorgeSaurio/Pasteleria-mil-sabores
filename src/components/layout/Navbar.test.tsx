import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderConContextos } from '@/test/renderConProveedores';
import { Navbar } from './Navbar';

test('debería mostrar el contador del carrito y los accesos de visitante sin sesión', () => {
  const opciones = { carrito: { totalItems: 3 }, auth: { estado: 'anonimo' as const, usuario: null } };

  renderConContextos(<Navbar />, opciones);

  expect(screen.getByLabelText('3 productos en el carrito')).toHaveTextContent('3');
  expect(screen.getByRole('link', { name: /Iniciar sesión/ })).toHaveAttribute('href', '/login');
  expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument();
});
