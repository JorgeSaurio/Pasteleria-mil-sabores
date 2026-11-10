import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioUsuario } from './FormularioUsuario';

test('debería mostrar errores y no llamar a onEnviar al registrar con el formulario vacío', async () => {
  const user = userEvent.setup();
  const alEnviar = vi.fn();
  render(<FormularioUsuario modo="registro" onEnviar={alEnviar} />);

  await user.click(screen.getByRole('button', { name: 'Registrar' }));

  expect(screen.getByText('El RUN es obligatorio.')).toBeInTheDocument();
  expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument();
  expect(alEnviar).not.toHaveBeenCalled();
});
