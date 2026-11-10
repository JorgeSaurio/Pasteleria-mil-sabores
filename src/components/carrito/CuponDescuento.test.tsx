import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CuponDescuento } from './CuponDescuento';

test('debería enviar el código a onAplicar y mostrar el mensaje que devuelve', async () => {
  // Arrange
  const user = userEvent.setup();
  const alAplicar = vi.fn().mockResolvedValue({
    valido: true,
    codigo: 'FELICES50',
    porcentaje: 10,
    mensaje: 'Cupón aplicado: 10% de descuento.',
  });
  render(<CuponDescuento cuponActivo={null} onAplicar={alAplicar} />);

  // Act
  await user.type(screen.getByLabelText('Ingrese el cupón de descuento'), 'FELICES50');
  await user.click(screen.getByRole('button', { name: 'APLICAR' }));

  // Assert
  expect(alAplicar).toHaveBeenCalledWith('FELICES50');
  expect(await screen.findByText('Cupón aplicado: 10% de descuento.')).toBeInTheDocument();
});
