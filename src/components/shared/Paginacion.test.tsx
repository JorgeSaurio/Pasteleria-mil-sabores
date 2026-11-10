import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Paginacion } from './Paginacion';

test('debería llamar a onCambiar con el número de la página pulsada', async () => {
  const user = userEvent.setup();
  const alCambiar = vi.fn();
  render(<Paginacion pagina={1} total={25} tamanoPagina={10} onCambiar={alCambiar} />);

  await user.click(screen.getByRole('button', { name: '3' }));

  expect(alCambiar).toHaveBeenCalledWith(3);
});
