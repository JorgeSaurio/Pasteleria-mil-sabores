import { test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import type { Blog } from '@/types';
import { renderConRouter } from '@/test/renderConProveedores';
import { BlogCard } from './BlogCard';

test('debería mostrar la miniatura de video y enlazar al detalle del blog', () => {
  const blog: Blog = {
    id: 'torta-gigante',
    etiqueta: 'Historia',
    claseEtiqueta: 'bg-warning',
    titulo: 'La torta más grande del mundo',
    subtitulo: 'Un récord de 1995',
    resumen: 'Cómo se logró el récord.',
    autor: 'Equipo Mil Sabores',
    videoUrl: 'https://ejemplo.invalid/video',
    introduccion: '',
    parrafos: [],
  };

  renderConRouter(<BlogCard blog={blog} />);

  expect(screen.getByRole('heading', { name: 'La torta más grande del mundo' })).toBeInTheDocument();
  expect(screen.getByText('Reportaje en video')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Ver caso' })).toHaveAttribute('href', '/blog/torta-gigante');
});
