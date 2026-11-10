import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampoFormulario } from './CampoFormulario';

test('debería marcar el campo como inválido y asociarle el mensaje de error', () => {
  render(
    <CampoFormulario id="email" name="email" label="Correo" value="" onChange={() => {}} error="Correo obligatorio." />,
  );

  const campo = screen.getByLabelText('Correo');

  expect(campo).toHaveAttribute('aria-invalid', 'true');
  expect(campo).toHaveAccessibleDescription('Correo obligatorio.');
});
