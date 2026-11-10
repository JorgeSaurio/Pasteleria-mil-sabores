import { test, expect, vi } from 'vitest';
import type { ChangeEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampoSelect } from './CampoSelect';

test('debería avisar con onChange el valor de la opción seleccionada', async () => {
  // Arrange
  const user = userEvent.setup();
  const valores: string[] = [];
  const alCambiar = vi.fn((e: ChangeEvent<HTMLSelectElement>) => valores.push(e.target.value));
  const opciones = [
    { valor: 'TC', etiqueta: 'Tortas cuadradas' },
    { valor: 'TT', etiqueta: 'Tortas circulares' },
  ];
  render(
    <CampoSelect
      id="cat"
      name="categoria"
      label="Categoría"
      value=""
      opciones={opciones}
      placeholder="Selecciona"
      onChange={alCambiar}
    />,
  );

  // Act
  await user.selectOptions(screen.getByLabelText('Categoría'), 'Tortas circulares');

  // Assert
  expect(alCambiar).toHaveBeenCalledTimes(1);
  expect(valores).toEqual(['TT']);
});
