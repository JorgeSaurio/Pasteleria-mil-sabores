import type { Categoria, Producto } from '@/types';
import { ProductoCard } from './ProductoCard';

export const COLUMNAS_POR_DEFECTO = 'row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4';

interface ProductoGrillaProps {
  productos: Producto[];
  onAgregar?: (producto: Producto) => boolean;
  categorias?: Categoria[];
  mostrarDescripcion?: boolean;
  columnas?: string;
  compacta?: boolean;
}

export function ProductoGrilla({
  productos,
  onAgregar,
  categorias,
  mostrarDescripcion,
  columnas = COLUMNAS_POR_DEFECTO,
  compacta,
}: ProductoGrillaProps) {
  const nombres = new Map(categorias?.map((c) => [c.id, c.nombre]));

  return (
    <div className={`row ${columnas} g-4`}>
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <ProductoCard
            producto={producto}
            onAgregar={onAgregar}
            nombreCategoria={categorias ? nombres.get(producto.categoriaId) : undefined}
            mostrarDescripcion={mostrarDescripcion}
            compacta={compacta}
            altoImagen={compacta ? 100 : 180}
          />
        </div>
      ))}
    </div>
  );
}
