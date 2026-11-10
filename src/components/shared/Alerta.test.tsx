import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alerta } from './Alerta';

test('debería mostrar el mensaje y llamar a onCerrar al pulsar Cerrar', async () => {
  // Arrange
  const user = userEvent.setup();
  const alCerrar = vi.fn();
  render(<Alerta mensaje="Credenciales inválidas" onCerrar={alCerrar} />);

  // Act
  await user.click(screen.getByRole('button', { name: 'Cerrar' }));

  // Assert
  expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas');
  expect(alCerrar).toHaveBeenCalledTimes(1);
});
