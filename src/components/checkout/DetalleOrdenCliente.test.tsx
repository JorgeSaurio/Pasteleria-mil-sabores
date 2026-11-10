import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Orden } from '@/types';
import { DetalleOrdenCliente } from './DetalleOrdenCliente';

test('debería mostrar el encabezado recibido, el descuento con su cupón y el total de la orden', () => {
  // Arrange
  const orden: Orden = {
    id: 'o1',
    numero: 1001,
    fecha: '2026-11-08T14:30:00.000Z',
    cliente: { nombre: 'Ana', apellidos: 'Pérez', email: 'ana@duoc.cl' },
    envio: { calle: 'Av. Siempre Viva 123', region: 'Tarapacá', comuna: 'Iquique' },
    items: [{ productoId: 'TC001', nombre: 'Torta de Chocolate', precioUnitario: 45000, cantidad: 1, imagen: '' }],
    cupon: 'FELICES50',
    subtotal: 45000,
    descuento: 4500,
    total: 40500,
    medioPago: 'tarjeta',
    estado: 'pagada',
  };

  // Act
  render(<DetalleOrdenCliente orden={orden} encabezado={<h1>Compra exitosa</h1>} etiquetaTotal="Total pagado" />);

  // Assert
  expect(screen.getByRole('heading', { name: 'Compra exitosa' })).toBeInTheDocument();
  expect(screen.getByText('Descuento FELICES50: -$4.500')).toBeInTheDocument();
  expect(screen.getByText('Total pagado: $40.500')).toBeInTheDocument();
});
