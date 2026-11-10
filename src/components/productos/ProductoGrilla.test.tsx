import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import type { Producto } from '@/types';
import { renderConRouter } from '@/test/renderConProveedores';
import { ProductoGrilla } from './ProductoGrilla';

const base: Omit<Producto, 'id' | 'nombre' | 'categoriaId'> = {
  precio: 10000,
  imagen: '',
  descripcion: '',
  stock: 3,
  stockCritico: 1,
};

test('debería renderizar una tarjeta por producto con el nombre de su categoría', () => {
  const productos: Producto[] = [
    { ...base, id: 'TC001', nombre: 'Torta de Chocolate', categoriaId: 'TC' },
    { ...base, id: 'PSA001', nombre: 'Torta sin Azúcar', categoriaId: 'PSA' },
  ];
  const categorias = [
    { id: 'TC', nombre: 'Tortas Cuadradas' },
    { id: 'PSA', nombre: 'Productos sin azúcar' },
  ];

  renderConRouter(<ProductoGrilla productos={productos} categorias={categorias} />);

  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByText('Tortas Cuadradas')).toBeInTheDocument();
  expect(screen.getByText('Productos sin azúcar')).toBeInTheDocument();
});
