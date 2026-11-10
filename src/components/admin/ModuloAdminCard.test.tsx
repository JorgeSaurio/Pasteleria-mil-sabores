import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderConRouter } from '@/test/renderConProveedores';
import { ModuloAdminCard } from './ModuloAdminCard';

test('debería ser un enlace a la ruta del módulo con su título y descripción', () => {
  // Arrange
  const modulo = { titulo: 'Órdenes', descripcion: 'Seguimiento de las órdenes de compra.', ruta: '/admin/ordenes' };

  // Act
  renderConRouter(<ModuloAdminCard {...modulo} />);

  // Assert
  const enlace = screen.getByRole('link', { name: /Órdenes/ });
  expect(enlace).toHaveAttribute('href', '/admin/ordenes');
  expect(enlace).toHaveTextContent('Seguimiento de las órdenes de compra.');
});
