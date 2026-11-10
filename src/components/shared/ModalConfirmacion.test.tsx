import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalConfirmacion } from './ModalConfirmacion';

test('debería llamar solo a onConfirmar al pulsar el botón de confirmación', async () => {
  // Arrange
  const user = userEvent.setup();
  const alConfirmar = vi.fn();
  const alCancelar = vi.fn();
  render(
    <ModalConfirmacion
      abierto
      titulo="Eliminar producto"
      mensaje="¿Seguro que deseas eliminarlo?"
      textoConfirmar="Eliminar"
      onConfirmar={alConfirmar}
      onCancelar={alCancelar}
    />,
  );

  // Act
  await user.click(screen.getByRole('button', { name: 'Eliminar' }));

  // Assert
  expect(screen.getByRole('dialog', { name: 'Eliminar producto' })).toBeInTheDocument();
  expect(alConfirmar).toHaveBeenCalledTimes(1);
  expect(alCancelar).not.toHaveBeenCalled();
});
