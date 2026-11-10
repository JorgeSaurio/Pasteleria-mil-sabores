import { test, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { DURACION_BOTON_AGREGADO_MS } from '@/config/constantes';
import { BotonAgregarCarrito } from './BotonAgregarCarrito';

test('debería mostrar "Agregado" tras agregar y volver a "Añadir" al pasar la duración', () => {
  // Arrange
  vi.useFakeTimers();
  const alAgregar = vi.fn(() => true);
  render(<BotonAgregarCarrito onAgregar={alAgregar} etiquetaAccesible="Agregar torta al carrito" />);
  const boton = screen.getByRole('button', { name: 'Agregar torta al carrito' });

  try {
    // Act
    fireEvent.click(boton);
    const textoTrasAgregar = boton.textContent;
    const deshabilitadoTrasAgregar = (boton as HTMLButtonElement).disabled;
    act(() => {
      vi.advanceTimersByTime(DURACION_BOTON_AGREGADO_MS);
    });

    // Assert
    expect(alAgregar).toHaveBeenCalledTimes(1);
    expect(textoTrasAgregar).toContain('Agregado');
    expect(deshabilitadoTrasAgregar).toBe(true);
    expect(boton).toHaveTextContent('Añadir');
    expect(boton).toBeEnabled();
  } finally {
    vi.useRealTimers();
  }
});
