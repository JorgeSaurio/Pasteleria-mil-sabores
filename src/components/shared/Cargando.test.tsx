import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cargando } from './Cargando';

test('debería mostrar el texto por defecto dentro de un rol status', () => {
  render(<Cargando />);

  const indicador = screen.getByRole('status');

  expect(indicador).toHaveTextContent('Cargando...');
});
