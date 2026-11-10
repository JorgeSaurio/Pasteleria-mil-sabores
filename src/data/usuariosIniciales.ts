import type { UsuarioNuevo } from '@/types';

export const USUARIOS_INICIALES: UsuarioNuevo[] = [
  {
    run: '173743882', nombre: 'Jorge', apellidos: 'Soto', email: 'jorgesoto@gmail.com', password: 'admin1',
    region: 'Región Metropolitana', comuna: 'Santiago', direccion: 'Sin dirección', rol: 'Administrador',
  },
  {
    run: '222222222', nombre: 'Valentina', apellidos: 'Rojas', email: 'vendedor@duoc.cl', password: 'vende1',
    region: 'Región Metropolitana', comuna: 'Providencia', direccion: 'Av. Providencia 1234', rol: 'Vendedor',
  },
  {
    run: '111111111', nombre: 'Pedro', apellidos: 'González', email: 'cliente@gmail.com', password: 'cliente1',
    region: 'Valparaiso', comuna: 'Viña del Mar', direccion: 'Calle Valparaíso 456', telefono: '+56912345678', rol: 'Cliente',
  },
];
