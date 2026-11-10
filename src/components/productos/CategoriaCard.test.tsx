import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderConRouter } from '@/test/renderConProveedores';
import { CategoriaCard } from './CategoriaCard';

test('debería enlazar a la URL de la categoría y marcarla como página actual si está activa', () => {
  const categoria = { id: 'TC', nombre: 'Tortas Cuadradas' };

  renderConRouter(<CategoriaCard categoria={categoria} activa />);

  const enlace = screen.getByRole('link', { name: /Tortas Cuadradas/ });
  expect(enlace).toHaveAttribute('href', '/categorias/TC');
  expect(enlace).toHaveAttribute('aria-current', 'page');
});
