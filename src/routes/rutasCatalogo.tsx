import type { RouteObject } from 'react-router-dom';
import { BlogPage } from '@/pages/tienda/BlogPage';
import { CategoriasPage } from '@/pages/tienda/CategoriasPage';
import { ContactoPage } from '@/pages/tienda/ContactoPage';
import { DetalleBlogPage } from '@/pages/tienda/DetalleBlogPage';
import { DetalleProductoPage } from '@/pages/tienda/DetalleProductoPage';
import { HomePage } from '@/pages/tienda/HomePage';
import { NosotrosPage } from '@/pages/tienda/NosotrosPage';
import { OfertasPage } from '@/pages/tienda/OfertasPage';
import { ProductosPage } from '@/pages/tienda/ProductosPage';

export const rutasCatalogo: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'productos', element: <ProductosPage /> },
  { path: 'productos/:id', element: <DetalleProductoPage /> },
  { path: 'categorias', element: <CategoriasPage /> },
  { path: 'categorias/:categoriaId', element: <CategoriasPage /> },
  { path: 'ofertas', element: <OfertasPage /> },
  { path: 'blog', element: <BlogPage /> },
  { path: 'blog/:id', element: <DetalleBlogPage /> },
  { path: 'nosotros', element: <NosotrosPage /> },
  { path: 'contacto', element: <ContactoPage /> },
];
