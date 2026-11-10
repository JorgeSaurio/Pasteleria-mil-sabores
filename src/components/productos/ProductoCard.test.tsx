import { test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Producto } from '@/types';
import { renderConRouter } from '@/test/renderConProveedores';
import { ProductoCard } from './ProductoCard';

test('debería mostrar el precio de oferta y entregar el producto a onAgregar al pulsar Añadir', async () => {
  // Arrange
  const user = userEvent.setup();
  const producto: Producto = {
    id: 'TC001',
    nombre: 'Torta Cuadrada de Chocolate',
    categoriaId: 'TC',
    precio: 45000,
    precioOferta: 40000,
    imagen: '',
    descripcion: 'Bizcocho de chocolate con ganache.',
    stock: 5,
    stockCritico: 2,
  };
  const alAgregar = vi.fn(() => true);
  renderConRouter(<ProductoCard producto={producto} onAgregar={alAgregar} />);

  // Act
  await user.click(screen.getByRole('button', { name: 'Agregar Torta Cuadrada de Chocolate al carrito' }));

  // Assert
  expect(screen.getByText('Oferta')).toBeInTheDocument();
  expect(screen.getByText('$40.000')).toBeInTheDocument();
  expect(alAgregar).toHaveBeenCalledWith(producto);
});
