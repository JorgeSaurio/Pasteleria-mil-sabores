import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EncabezadoAdmin } from './EncabezadoAdmin';

test('debería mostrar el título como h1, el subtítulo y las acciones recibidas', () => {
  // Arrange
  const acciones = <button type="button">Nuevo producto</button>;

  // Act
  render(<EncabezadoAdmin titulo="Productos" subtitulo="Inventario de la tienda" acciones={acciones} />);

  // Assert
  expect(screen.getByRole('heading', { level: 1, name: 'Productos' })).toBeInTheDocument();
  expect(screen.getByText('Inventario de la tienda')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Nuevo producto' })).toBeInTheDocument();
});
