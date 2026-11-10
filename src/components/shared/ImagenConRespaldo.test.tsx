import { test, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { IMAGEN_POR_DEFECTO } from '@/config/constantes';
import { ImagenConRespaldo } from './ImagenConRespaldo';

test('debería reemplazar la imagen por la de respaldo cuando falla la carga', () => {
  // Arrange
  render(<ImagenConRespaldo src="https://ejemplo.invalid/torta.png" alt="Torta de chocolate" />);
  const imagen = screen.getByRole('img', { name: 'Torta de chocolate' });

  // Act
  fireEvent.error(imagen); // jsdom no carga imágenes: el error se dispara a mano

  // Assert
  expect(imagen).toHaveAttribute('src', IMAGEN_POR_DEFECTO);
});
