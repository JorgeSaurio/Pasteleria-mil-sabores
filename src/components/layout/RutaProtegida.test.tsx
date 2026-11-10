import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderConContextos } from '@/test/renderConProveedores';
import { RutaProtegida } from './RutaProtegida';

test('debería redirigir a /login cuando no hay sesión iniciada', () => {
  const rutas = (
    <Routes>
      <Route
        path="/admin"
        element={
          <RutaProtegida rolesPermitidos={['Administrador']}>
            <p>Contenido privado</p>
          </RutaProtegida>
        }
      />
      <Route path="/login" element={<p>Pantalla de login</p>} />
    </Routes>
  );

  renderConContextos(rutas, { ruta: '/admin', auth: { estado: 'anonimo', usuario: null } });

  expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument();
});
