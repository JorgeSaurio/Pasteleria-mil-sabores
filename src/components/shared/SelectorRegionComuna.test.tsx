import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SelectorRegionComuna } from './SelectorRegionComuna';

test('debería ofrecer solo las comunas de la región seleccionada', () => {
  render(<SelectorRegionComuna region="Tarapacá" comuna="" onChange={() => {}} />);

  const comuna = screen.getByLabelText(/Comuna/);

  expect(comuna).toBeEnabled();
  expect(screen.getByRole('option', { name: 'Iquique' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: 'Arica' })).not.toBeInTheDocument();
});
