import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DatosCompraSoloLectura } from './DatosCompraSoloLectura';

test('debería mostrar los datos deshabilitados y "-" en los campos opcionales vacíos', () => {
  // Arrange
  const cliente = { nombre: 'Ana', apellidos: 'Pérez Soto', email: 'ana@duoc.cl' };
  const envio = { calle: 'Av. Siempre Viva 123', region: 'Tarapacá', comuna: 'Iquique' };

  // Act
  render(<DatosCompraSoloLectura cliente={cliente} envio={envio} />);

  // Assert
  expect(screen.getByDisplayValue('ana@duoc.cl')).toBeDisabled();
  expect(screen.getByDisplayValue('Iquique')).toBeDisabled();
  expect(screen.getAllByDisplayValue('-')).toHaveLength(2); // departamento e indicaciones
});
