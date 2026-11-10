import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderConContextos } from '@/test/renderConProveedores';
import { ContenedorNotificaciones } from './ContenedorNotificaciones';

test('debería mostrar las notificaciones y descartar por id la que se pulsa', async () => {
  // Arrange
  const user = userEvent.setup();
  const { notificacion } = renderConContextos(<ContenedorNotificaciones />, {
    notificacion: {
      notificaciones: [
        { id: 1, mensaje: 'Torta agregada al carrito', variante: 'success' },
        { id: 2, mensaje: 'Producto eliminado del carrito', variante: 'info' },
      ],
    },
  });

  // Act
  await user.click(screen.getByText('Producto eliminado del carrito'));

  // Assert
  expect(screen.getByText('Torta agregada al carrito')).toBeInTheDocument();
  expect(notificacion.descartar).toHaveBeenCalledWith(2);
});
