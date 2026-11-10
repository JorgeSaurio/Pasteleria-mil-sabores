import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cargando } from './Cargando';

test('debería mostrar el texto por defecto dentro de un rol status', () => {
  // Arrange
  render(<Cargando />);

  // Act
  const indicador = screen.getByRole('status');

  // Assert
  expect(indicador).toHaveTextContent('Cargando...');
});
