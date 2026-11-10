import { test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { LineaCarrito } from '@/types';
import { renderConRouter } from '@/test/renderConProveedores';
import { CarritoItem } from './CarritoItem';

test('debería avisar con el callback correcto al pulsar aumentar, disminuir y eliminar', async () => {
  // Arrange
  const user = userEvent.setup();
  const linea: LineaCarrito = {
    productoId: 'TC001',
    cantidad: 2,
    precioUnitario: 45000,
    subtotal: 90000,
    producto: {
      id: 'TC001',
      nombre: 'Torta de Chocolate',
      categoriaId: 'TC',
      precio: 45000,
      imagen: '',
      descripcion: 'Bizcocho húmedo.',
      stock: 10,
      stockCritico: 2,
    },
  };
  const alIncrementar = vi.fn();
  const alDecrementar = vi.fn();
  const alEliminar = vi.fn();
  renderConRouter(
    <CarritoItem linea={linea} onIncrementar={alIncrementar} onDecrementar={alDecrementar} onEliminar={alEliminar} />,
  );

  // Act
  await user.click(screen.getByRole('button', { name: 'Aumentar cantidad de Torta de Chocolate' }));
  await user.click(screen.getByRole('button', { name: 'Disminuir cantidad de Torta de Chocolate' }));
  await user.click(screen.getByRole('button', { name: 'Eliminar Torta de Chocolate del carrito' }));

  // Assert
  expect(alIncrementar).toHaveBeenCalledTimes(1);
  expect(alDecrementar).toHaveBeenCalledTimes(1);
  expect(alEliminar).toHaveBeenCalledTimes(1);
});
