export interface Contacto {
  id: string;
  nombre: string;
  email: string;
  comentario: string;
  fecha: string;
}

export type ContactoNuevo = Omit<Contacto, 'id' | 'fecha'>;
