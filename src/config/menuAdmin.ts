import type { Rol } from '@/types';

export interface ItemMenuAdmin {
  titulo: string;
  descripcion: string;
  ruta: string;
  roles: Rol[];
}

const TODOS: Rol[] = ['Administrador', 'Vendedor'];
const SOLO_ADMIN: Rol[] = ['Administrador'];

export const MENU_ADMIN: ItemMenuAdmin[] = [
  { titulo: 'Dashboard', descripcion: 'Visión general de las métricas clave del sistema.', ruta: '/admin', roles: TODOS },
  { titulo: 'Órdenes', descripcion: 'Seguimiento de las órdenes de compra y sus boletas.', ruta: '/admin/ordenes', roles: TODOS },
  { titulo: 'Productos', descripcion: 'Inventario, precios, ofertas y detalle de productos.', ruta: '/admin/productos', roles: TODOS },
  { titulo: 'Stock crítico', descripcion: 'Productos con stock igual o menor a su umbral crítico.', ruta: '/admin/productos/criticos', roles: TODOS },
  { titulo: 'Categorías', descripcion: 'Organiza los productos en categorías para facilitar la navegación.', ruta: '/admin/categorias', roles: SOLO_ADMIN },
  { titulo: 'Usuarios', descripcion: 'Gestión de cuentas de usuario y sus roles.', ruta: '/admin/usuarios', roles: SOLO_ADMIN },
  { titulo: 'Reportes', descripcion: 'Ventas, productos más vendidos y tasa de rechazo.', ruta: '/admin/reportes', roles: SOLO_ADMIN },
  { titulo: 'Perfil', descripcion: 'Tu información personal y datos de la cuenta.', ruta: '/admin/perfil', roles: TODOS },
];
