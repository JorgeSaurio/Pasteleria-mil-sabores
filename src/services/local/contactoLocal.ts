import type { Contacto } from '@/types';
import type { ContactoRepositorio } from '../contratos/ContactoRepositorio';
import { CLAVES, CLAVES_LEGADAS, eliminar, existe, guardar, leer } from './storage';
import { exito, fallo, responder } from './utilidades';

function cargarContactos(): Contacto[] {
  if (!existe(CLAVES.contactos)) {
    // Migración del formato HTML: {nombrecontacto, correocontacto, comentariocontacto, fecha}
    const legado = leer<Record<string, string>[]>(CLAVES_LEGADAS.contactos, []).map((c, i) => ({
      id: `CT-LEGADO-${i}`,
      nombre: c.nombrecontacto ?? '',
      email: c.correocontacto ?? '',
      comentario: (c.comentariocontacto ?? '').trim(),
      fecha: c.fecha ?? new Date().toISOString(),
    }));
    guardar(CLAVES.contactos, legado);
    eliminar(CLAVES_LEGADAS.contactos);
  }
  return leer<Contacto[]>(CLAVES.contactos, []);
}

export const contactoLocal: ContactoRepositorio = {
  async enviar(datos) {
    if (!datos.nombre.trim() || !datos.email.trim() || !datos.comentario.trim()) {
      return responder(fallo<Contacto>('Completa todos los campos.'));
    }
    const contacto: Contacto = {
      id: `CT-${Date.now().toString(36)}`,
      nombre: datos.nombre.trim(),
      email: datos.email.trim().toLowerCase(),
      comentario: datos.comentario.trim(),
      fecha: new Date().toISOString(),
    };
    guardar(CLAVES.contactos, [...cargarContactos(), contacto]);
    return responder(exito('Comentario enviado correctamente. ¡Gracias por escribirnos!', contacto));
  },

  async listar() {
    return responder(cargarContactos());
  },
};
