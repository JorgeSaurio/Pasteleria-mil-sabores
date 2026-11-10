import { test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { TablaResumenItems } from './TablaResumenItems';

test('debería mostrar precio unitario y subtotal en pesos chilenos', () => {
  // Arrange
  const items = [{ id: 'TC001', nombre: 'Torta Cuadrada de Chocolate', imagen: '', precioUnitario: 45000, cantidad: 2 }];

  // Act
  render(<TablaResumenItems items={items} />);

  // Assert
  const fila = screen.getByRole('row', { name: /Torta Cuadrada de Chocolate/ });
  expect(within(fila).getByText('$45.000')).toBeInTheDocument();
  expect(within(fila).getByText('$90.000')).toBeInTheDocument();
});
