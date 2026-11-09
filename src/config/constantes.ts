/** Constantes de presentación compartidas por toda la app. */

const BUCKET = 'https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images';

/** URL absoluta a propósito: funciona desde cualquier ruta de la SPA. */
export const IMAGEN_POR_DEFECTO = `${BUCKET}%2Flogo.jpeg`;

export const ICONOS = {
  carrito: `${BUCKET}%2Fcarrito-de-compras.png`,
  usuario: `${BUCKET}%2Fuser-interface.png`,
  visa: `${BUCKET}%2Fvisa-icon.png`,
  pix: `${BUCKET}%2Fpix-icon.png`,
  instagram: `${BUCKET}%2Finstagram-icon.png`,
  facebook: `${BUCKET}%2Ffacebook-icon.png`,
} as const;

/** Tope de unidades por producto en el carrito (regla heredada del proyecto HTML). */
export const CANTIDAD_MAXIMA_ITEM = 50;

/** Duraciones de feedback visual (ms). */
export const DURACION_NOTIFICACION_MS = 2600;
export const DURACION_BOTON_AGREGADO_MS = 1500;
