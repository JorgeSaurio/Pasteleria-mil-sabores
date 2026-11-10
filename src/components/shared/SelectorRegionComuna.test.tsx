import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SelectorRegionComuna } from './SelectorRegionComuna';

test('debería ofrecer solo las comunas de la región seleccionada', () => {
  // Arrange
  render(<SelectorRegionComuna region="Tarapacá" comuna="" onChange={() => {}} />);

  // Act
  const comuna = screen.getByLabelText(/Comuna/);

  // Assert
  expect(comuna).toBeEnabled();
  expect(screen.getByRole('option', { name: 'Iquique' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: 'Arica' })).not.toBeInTheDocument();
});
