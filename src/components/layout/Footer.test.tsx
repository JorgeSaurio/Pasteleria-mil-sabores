import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

test('debería mostrar el año actual y abrir las redes sociales en una pestaña nueva', () => {
  // Arrange
  const anioActual = new Date().getFullYear();

  // Act
  render(<Footer />);

  // Assert
  expect(screen.getByText(new RegExp(`Pastelería 1000 Sabores © ${anioActual}`))).toBeInTheDocument();
  const instagram = screen.getByRole('link', { name: 'Instagram' });
  expect(instagram).toHaveAttribute('target', '_blank');
  expect(instagram).toHaveAttribute('rel', 'noopener noreferrer');
});
