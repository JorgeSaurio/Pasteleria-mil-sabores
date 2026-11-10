import { test, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import type { Orden } from '@/types';
import { renderConRouter } from '@/test/renderConProveedores';
import { TablaOrdenes } from './TablaOrdenes';

test('debería ocultar la columna Cliente con mostrarCliente=false y sumar los ítems de la orden', () => {
  // Arrange
  const orden: Orden = {
    id: 'o1',
    numero: 1001,
    fecha: '2026-11-08T14:30:00.000Z',
    cliente: { nombre: 'Ana', apellidos: 'Pérez', email: 'ana@duoc.cl' },
    envio: { calle: 'Av. Siempre Viva 123', region: 'Tarapacá', comuna: 'Iquique' },
    items: [
      { productoId: 'TC001', nombre: 'Torta', precioUnitario: 10000, cantidad: 2, imagen: '' },
      { productoId: 'PI001', nombre: 'Mousse', precioUnitario: 5000, cantidad: 3, imagen: '' },
    ],
    subtotal: 35000,
    descuento: 0,
    total: 35000,
    medioPago: 'tarjeta',
    estado: 'pagada',
  };

  // Act
  renderConRouter(<TablaOrdenes ordenes={[orden]} mostrarCliente={false} />);

  // Assert
  expect(screen.queryByRole('columnheader', { name: 'Cliente' })).not.toBeInTheDocument();
  const fila = screen.getByRole('row', { name: /#1001/ });
  expect(within(fila).getByRole('cell', { name: '5' })).toBeInTheDocument();
  expect(within(fila).getByRole('cell', { name: '$35.000' })).toBeInTheDocument();
  expect(within(fila).getByRole('link', { name: 'Ver' })).toHaveAttribute('href', '/admin/ordenes/o1');
});
