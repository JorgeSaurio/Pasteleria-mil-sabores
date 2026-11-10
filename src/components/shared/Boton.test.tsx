import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Boton } from './Boton';

test('debería ejecutar onClick una vez al hacer clic', async () => {
  // Arrange
  const user = userEvent.setup();
  const alHacerClic = vi.fn();
  render(<Boton onClick={alHacerClic}>Pagar</Boton>);

  // Act
  await user.click(screen.getByRole('button', { name: 'Pagar' }));

  // Assert
  expect(alHacerClic).toHaveBeenCalledTimes(1);
});
