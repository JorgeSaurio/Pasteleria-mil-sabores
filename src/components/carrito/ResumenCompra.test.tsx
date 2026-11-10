import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumenCompra } from './ResumenCompra';

test('debería mostrar subtotal, descuento y total formateados en pesos chilenos', () => {
  const montos = { subtotal: 50000, descuento: 5000, total: 45000 };

  render(<ResumenCompra {...montos} textoAccion="Ir a pagar" onAccion={() => {}} />);

  expect(screen.getByText('$50.000')).toBeInTheDocument();
  expect(screen.getByText('-$5.000')).toBeInTheDocument();
  expect(screen.getByText('$45.000')).toBeInTheDocument();
});
