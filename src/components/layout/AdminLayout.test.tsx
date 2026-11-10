import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import type { Usuario } from '@/types';
import { renderConContextos } from '@/test/renderConProveedores';
import { AdminLayout } from './AdminLayout';

test('debería mostrar al Vendedor solo los módulos permitidos y la página actual', () => {
  const vendedor: Usuario = {
    run: '123456785',
    nombre: 'Vera',
    apellidos: 'Vendedora',
    email: 'vera@duoc.cl',
    region: 'Tarapacá',
    comuna: 'Iquique',
    direccion: 'Calle 1',
    rol: 'Vendedor',
  };
  const rutas = (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<h1>Dashboard</h1>} />
      </Route>
    </Routes>
  );

  renderConContextos(rutas, { ruta: '/admin', auth: { estado: 'autenticado', usuario: vendedor } });

  expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Órdenes' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument();
});
