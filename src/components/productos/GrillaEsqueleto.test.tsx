import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrillaEsqueleto } from './GrillaEsqueleto';

test('debería renderizar tantas tarjetas fantasma como indique "cantidad", ocultas a lectores de pantalla', () => {
  const cantidad = 3;

  render(<GrillaEsqueleto cantidad={cantidad} />);

  expect(screen.queryAllByRole('article')).toHaveLength(0);
  expect(screen.getAllByRole('article', { hidden: true })).toHaveLength(cantidad);
});
