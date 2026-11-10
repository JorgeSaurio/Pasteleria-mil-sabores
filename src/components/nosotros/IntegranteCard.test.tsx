import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntegranteCard } from './IntegranteCard';

test('debería mostrar el nombre como encabezado junto a su rol y descripción', () => {
  // Arrange
  const integrante = { nombre: 'Ana Pérez', rol: 'Maestra pastelera', descripcion: 'Especialista en tortas.' };

  // Act
  render(<IntegranteCard {...integrante} />);

  // Assert
  expect(screen.getByRole('heading', { name: 'Ana Pérez' })).toBeInTheDocument();
  expect(screen.getByText('Maestra pastelera')).toBeInTheDocument();
  expect(screen.getByText('Especialista en tortas.')).toBeInTheDocument();
});
