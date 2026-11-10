import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltroCategoria } from './FiltroCategoria';

test('debería llamar a onChange con el id de la categoría elegida', async () => {
  const user = userEvent.setup();
  const alCambiar = vi.fn();
  const categorias = [
    { id: 'TC', nombre: 'Tortas Cuadradas' },
    { id: 'PSA', nombre: 'Productos sin azúcar' },
  ];
  render(<FiltroCategoria categorias={categorias} valor="" onChange={alCambiar} />);

  await user.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por categoría' }), 'Productos sin azúcar');

  expect(alCambiar).toHaveBeenCalledWith('PSA');
});
