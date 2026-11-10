import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioProducto } from './FormularioProducto';

test('debería rechazar un precio de oferta mayor o igual al precio normal sin llamar a onEnviar', async () => {
  const user = userEvent.setup();
  const alEnviar = vi.fn();
  render(<FormularioProducto categorias={[{ id: 'TC', nombre: 'Tortas Cuadradas' }]} onEnviar={alEnviar} />);
  await user.type(screen.getByLabelText(/^Código/), 'TC099');
  await user.type(screen.getByLabelText(/^Nombre/), 'Torta de prueba');
  await user.selectOptions(screen.getByLabelText(/^Categoría/), 'Tortas Cuadradas');
  await user.type(screen.getByLabelText(/^Precio \(CLP\)/), '10000');
  await user.type(screen.getByLabelText(/^Precio oferta/), '12000');
  await user.type(screen.getByLabelText(/^Stock(?! crítico)/), '5');
  await user.type(screen.getByLabelText(/^Descripción/), 'Descripción de prueba');

  await user.click(screen.getByRole('button', { name: 'Guardar producto' }));

  expect(screen.getByLabelText(/^Precio oferta/)).toHaveAccessibleDescription('Debe ser menor que el precio normal.');
  expect(alEnviar).not.toHaveBeenCalled();
});
