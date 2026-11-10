import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioCheckout } from './FormularioCheckout';

test('debería mostrar errores y no llamar a onPagar al enviar el formulario vacío', async () => {
  const user = userEvent.setup();
  const alPagar = vi.fn();
  render(<FormularioCheckout total={45000} procesando={false} onPagar={alPagar} />);

  await user.click(screen.getByRole('button', { name: 'Pagar ahora $45.000' }));

  expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
  expect(screen.getByText('Selecciona una región.')).toBeInTheDocument();
  expect(alPagar).not.toHaveBeenCalled();
});
