import { test, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { BuscadorProductos } from './BuscadorProductos';

test('debería llamar a onBuscar una sola vez, con el texto recortado, tras el retardo', () => {
  // Arrange
  vi.useFakeTimers();
  const alBuscar = vi.fn();
  render(<BuscadorProductos valorInicial="" onBuscar={alBuscar} retardoMs={300} />);
  const campo = screen.getByRole('searchbox', { name: 'Buscar productos' });

  try {
    // Act
    fireEvent.change(campo, { target: { value: 'tor' } });
    fireEvent.change(campo, { target: { value: '  torta  ' } });
    const llamadasAntesDelRetardo = alBuscar.mock.calls.length;
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Assert
    expect(llamadasAntesDelRetardo).toBe(0);
    expect(alBuscar).toHaveBeenCalledTimes(1);
    expect(alBuscar).toHaveBeenCalledWith('torta');
  } finally {
    vi.useRealTimers();
  }
});
