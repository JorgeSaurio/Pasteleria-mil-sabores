import { test, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Producto } from '@/types';
import { renderConRouter } from '@/test/renderConProveedores';
import { TablaProductosAdmin } from './TablaProductosAdmin';

test('debería marcar el stock crítico y entregar el producto a onEliminar', async () => {
  const user = userEvent.setup();
  const producto: Producto = {
    id: 'TC001',
    nombre: 'Torta de Chocolate',
    categoriaId: 'TC',
    precio: 45000,
    imagen: '',
    descripcion: '',
    stock: 2,
    stockCritico: 3,
  };
  const alEliminar = vi.fn();
  renderConRouter(
    <TablaProductosAdmin productos={[producto]} categorias={[{ id: 'TC', nombre: 'Tortas Cuadradas' }]} onEliminar={alEliminar} />,
  );
  const fila = screen.getByRole('row', { name: /TC001/ });

  await user.click(within(fila).getByRole('button', { name: 'Eliminar' }));

  expect(within(fila).getByText('Crítico (2)')).toBeInTheDocument();
  expect(within(fila).getByText('Tortas Cuadradas')).toBeInTheDocument();
  expect(alEliminar).toHaveBeenCalledWith(producto);
});
