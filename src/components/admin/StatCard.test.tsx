import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

test('debería mostrar título, valor y detalle, coloreando el valor según la variante', () => {
  // Arrange
  const props = { titulo: 'Stock crítico', valor: 4, detalle: 'Productos bajo el umbral', variante: 'danger' as const };

  // Act
  render(<StatCard {...props} />);

  // Assert
  expect(screen.getByText('Stock crítico')).toBeInTheDocument();
  expect(screen.getByText('Productos bajo el umbral')).toBeInTheDocument();
  expect(screen.getByText('4')).toHaveClass('text-danger');
});
