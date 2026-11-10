import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderConRouter } from '@/test/renderConProveedores';
import { ModuloAdminCard } from './ModuloAdminCard';

test('debería ser un enlace a la ruta del módulo con su título y descripción', () => {
  const modulo = { titulo: 'Órdenes', descripcion: 'Seguimiento de las órdenes de compra.', ruta: '/admin/ordenes' };

  renderConRouter(<ModuloAdminCard {...modulo} />);

  const enlace = screen.getByRole('link', { name: /Órdenes/ });
  expect(enlace).toHaveAttribute('href', '/admin/ordenes');
  expect(enlace).toHaveTextContent('Seguimiento de las órdenes de compra.');
});
