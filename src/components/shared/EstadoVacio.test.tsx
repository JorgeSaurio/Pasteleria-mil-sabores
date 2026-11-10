import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderConRouter } from '@/test/renderConProveedores';
import { EstadoVacio } from './EstadoVacio';

test('debería mostrar título, mensaje y un enlace a la ruta de la acción', () => {
  // Arrange
  renderConRouter(
    <EstadoVacio
      titulo="Tu carrito está vacío"
      mensaje="Agrega productos para continuar."
      accion={{ texto: 'Explorar productos', ruta: '/productos' }}
    />,
  );

  // Act
  const enlace = screen.getByRole('link', { name: 'Explorar productos' });

  // Assert
  expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument();
  expect(screen.getByText('Agrega productos para continuar.')).toBeInTheDocument();
  expect(enlace).toHaveAttribute('href', '/productos');
});
