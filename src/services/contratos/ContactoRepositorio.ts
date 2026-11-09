import type { Contacto, ContactoNuevo, ResultadoOperacion } from '@/types';

export interface ContactoRepositorio {
  enviar(datos: ContactoNuevo): Promise<ResultadoOperacion<Contacto>>;
  listar(): Promise<Contacto[]>;
}
