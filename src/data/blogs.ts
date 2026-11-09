import type { Blog } from '@/types';

const LOGO = 'https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Flogo.jpeg';

/** Contenido estático del blog (antes repetido en blog.html y detalle-blog.html). */
export const BLOGS: Blog[] = [
  {
    id: '1',
    etiqueta: 'Video Reportaje',
    claseEtiqueta: 'bg-danger',
    titulo: 'El Gran Récord Guinness de 1995',
    subtitulo: 'Nuestra participación en el Récord Guinness de 1995',
    resumen:
      'Descubre la historia documental detrás de la torta más grande del mundo y cómo nuestra pastelería marcó un hito en la historia de la gastronomía nacional e internacional.',
    autor: 'Publicado por el Equipo Editorial Mil Sabores | Celebrando 50 años de historia',
    videoUrl: 'https://www.youtube.com/embed/AKziG426S2I?si=3M6DFylH4-qndtnR',
    introduccion:
      'En 1995, Pastelería 1000 Sabores asumió el reto colectivo de fabricar la torta más grande del mundo, congregando a maestros pasteleros de todo el país y marcando un récord imborrable en nuestra historia gastronómica.',
    parrafos: [
      'La hazaña exigió semanas de planificación logística, toneladas de harina seleccionada, manjar artesanal y miles de huevos frescos. Más allá de las dimensiones titánicas del pastel, el verdadero logro residió en mantener intacto el sabor tradicional chileno en cada porción distribuida entre miles de asistentes a la celebración comunitaria.',
      'Este hito forjó la identidad de innovación y excelencia técnica que caracteriza a nuestro taller hasta el día de hoy, demostrando que la repostería artesanal chilena es capaz de posicionarse en los más altos escenarios internacionales sin perder su calidez familiar.',
    ],
  },
  {
    id: '2',
    etiqueta: 'Comunidad y Técnicas',
    claseEtiqueta: 'bg-warning text-dark',
    titulo: 'La Ciencia del Bizcocho Tradicional',
    subtitulo: 'Secretos de Repostería y Comunidad Duoc UC',
    resumen:
      'Conoce las técnicas artesanales de horneado tradicional y el impacto colaborativo que desarrollamos junto a los jóvenes talentos gastronómicos de la comunidad local.',
    autor: 'Publicado en colaboración con estudiantes de Gastronomía Duoc UC',
    imagen: LOGO,
    introduccion:
      'La textura inconfundible de nuestras preparaciones reside en el batido manual, el control milimétrico de la temperatura y el respeto irrestricto por fórmulas tradicionales preservadas por medio siglo.',
    parrafos: [
      'En el marco de nuestra alianza formativa con estudiantes de la Escuela de Gastronomía de Duoc UC, realizamos talleres experimentales enfocados en rescatar masas patrimoniales y adaptar recetas tradicionales a estándares modernos, incluyendo técnicas avanzadas de aireado natural y emulsión sin aditivos industriales.',
      'El resultado es una pastelería consciente que apoya a los jóvenes talentos culinarios locales y ofrece al consumidor opciones innovadoras que van desde bizcochos libres de azúcar hasta recetas tradicionales elaboradas con el mismo rigor técnico que nos ha distinguido durante 50 años.',
    ],
  },
];
