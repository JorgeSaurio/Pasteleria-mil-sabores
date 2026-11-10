import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampoFormulario } from './CampoFormulario';

test('debería marcar el campo como inválido y asociarle el mensaje de error', () => {
  // Arrange
  render(
    <CampoFormulario id="email" name="email" label="Correo" value="" onChange={() => {}} error="Correo obligatorio." />,
  );

  // Act
  const campo = screen.getByLabelText('Correo');

  // Assert
  expect(campo).toHaveAttribute('aria-invalid', 'true');
  expect(campo).toHaveAccessibleDescription('Correo obligatorio.');
});
