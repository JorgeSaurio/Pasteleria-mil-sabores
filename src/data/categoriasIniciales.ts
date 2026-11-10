import type { Categoria } from '@/types';

const IMG = 'https://objectstorage.sa-santiago-1.oraclecloud.com/n/ax2isdqimwmu/b/bucket_jorge/o/images%2Fcatalogo%2F';

export const CATEGORIAS_INICIALES: Categoria[] = [
  { id: 'tortas-cuadradas', nombre: 'Tortas Cuadradas', imagen: `${IMG}torta-cuadrada-chocolate.png` },
  { id: 'tortas-circulares', nombre: 'Tortas Circulares', imagen: `${IMG}torta-circular-vainilla.jpg` },
  { id: 'postres-individuales', nombre: 'Postres Individuales', imagen: `${IMG}mousse-chocolate.webp` },
  { id: 'sin-azucar', nombre: 'Productos Sin Azúcar', imagen: `${IMG}torta-naranja.jpg` },
  { id: 'tradicional', nombre: 'Pastelería Tradicional', imagen: `${IMG}empanadas-manzana.jpg` },
  { id: 'sin-gluten', nombre: 'Productos Sin Gluten', imagen: `${IMG}brownie-sin-gluten.jpg` },
  { id: 'veganos', nombre: 'Productos Veganos', imagen: `${IMG}torta-vegana-chocolate.webp` },
  { id: 'tortas-especiales', nombre: 'Tortas Especiales', imagen: `${IMG}torta-cumpleanios.jpg` },
];
