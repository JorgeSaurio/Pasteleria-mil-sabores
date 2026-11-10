import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import type { ItemMenuAdmin } from '@/config/menuAdmin';
import { renderConRouter } from '@/test/renderConProveedores';
import { AdminSidebar } from './AdminSidebar';

test('debería marcar como activo solo el enlace de la ruta actual y mostrar el rol', () => {
  // Arrange
  const items: ItemMenuAdmin[] = [
    { titulo: 'Dashboard', descripcion: '', ruta: '/admin', roles: ['Vendedor'] },
    { titulo: 'Órdenes', descripcion: '', ruta: '/admin/ordenes', roles: ['Vendedor'] },
  ];

  // Act
  renderConRouter(<AdminSidebar items={items} rol="Vendedor" />, { ruta: '/admin/ordenes' });

  // Assert
  expect(screen.getByRole('link', { name: 'Órdenes' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  expect(screen.getByText('Vendedor')).toBeInTheDocument();
});
