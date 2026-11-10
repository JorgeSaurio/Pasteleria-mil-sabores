import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderConContextos } from '@/test/renderConProveedores';
import { TiendaLayout } from './TiendaLayout';

test('debería envolver la página actual entre el navbar y el footer', () => {
  // Arrange
  const rutas = (
    <Routes>
      <Route element={<TiendaLayout />}>
        <Route path="/productos" element={<h1>Catálogo</h1>} />
      </Route>
    </Routes>
  );

  // Act
  renderConContextos(rutas, { ruta: '/productos' });

  // Assert
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByRole('main')).toHaveTextContent('Catálogo');
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});
