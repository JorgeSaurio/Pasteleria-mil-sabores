import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltroCategoria } from './FiltroCategoria';

test('debería llamar a onChange con el id de la categoría elegida', async () => {
  // Arrange
  const user = userEvent.setup();
  const alCambiar = vi.fn();
  const categorias = [
    { id: 'TC', nombre: 'Tortas Cuadradas' },
    { id: 'PSA', nombre: 'Productos sin azúcar' },
  ];
  render(<FiltroCategoria categorias={categorias} valor="" onChange={alCambiar} />);

  // Act
  await user.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por categoría' }), 'Productos sin azúcar');

  // Assert
  expect(alCambiar).toHaveBeenCalledWith('PSA');
});
