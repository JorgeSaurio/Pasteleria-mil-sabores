import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrillaEsqueleto } from './GrillaEsqueleto';

test('debería renderizar tantas tarjetas fantasma como indique "cantidad", ocultas a lectores de pantalla', () => {
  // Arrange
  const cantidad = 3;

  // Act
  render(<GrillaEsqueleto cantidad={cantidad} />);

  // Assert
  expect(screen.queryAllByRole('article')).toHaveLength(0); // aria-hidden: no accesibles
  expect(screen.getAllByRole('article', { hidden: true })).toHaveLength(cantidad);
});
