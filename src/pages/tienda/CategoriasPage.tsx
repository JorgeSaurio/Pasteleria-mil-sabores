import { useParams } from 'react-router-dom';
import { CategoriaCard } from '@/components/productos/CategoriaCard';
import { GrillaEsqueleto } from '@/components/productos/GrillaEsqueleto';
import { ProductoGrilla } from '@/components/productos/ProductoGrilla';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { useAsync } from '@/hooks/useAsync';
import { useCarrito } from '@/hooks/useCarrito';
import { categoriaRepositorio, productoRepositorio } from '@/services';

/**
 * Vista Categorías (nueva, Figura 4). La categoría seleccionada vive en la URL
 * (/categorias/:categoriaId); sin parámetro se muestra la primera.
 */
export function CategoriasPage() {
  const { categoriaId } = useParams();
  const { agregar } = useCarrito();

  const categorias = useAsync(() => categoriaRepositorio.listar(), []);
  const seleccionada = categorias.datos?.find((c) => c.id === categoriaId) ?? categorias.datos?.[0];

  const productos = useAsync(
    () =>
      seleccionada
        ? productoRepositorio.listar({ categoriaId: seleccionada.id }).then((pagina) => pagina.items)
        : Promise.resolve([]),
    [seleccionada?.id],
  );

  if (categorias.cargando) return <Cargando texto="Cargando categorías..." />;
  if (categorias.error) return <div className="container my-5"><Alerta mensaje={categorias.error} /></div>;

  return (
    <div className="container my-5">
      <header className="text-center mb-4">
        <h1 className="display-6 fw-bold">CATEGORÍAS</h1>
        <p className="text-muted">Encuentra tu próximo antojo según el tipo de preparación.</p>
      </header>

      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-8 g-3 mb-5">
        {(categorias.datos ?? []).map((categoria) => (
          <div className="col" key={categoria.id}>
            <CategoriaCard categoria={categoria} activa={categoria.id === seleccionada?.id} />
          </div>
        ))}
      </div>

      {seleccionada && <h2 className="h3 fw-bold mb-4">{seleccionada.nombre}</h2>}

      {productos.cargando ? (
        <GrillaEsqueleto cantidad={4} />
      ) : productos.datos && productos.datos.length > 0 ? (
        <ProductoGrilla productos={productos.datos} onAgregar={agregar} mostrarDescripcion />
      ) : (
        <EstadoVacio titulo="Sin productos" mensaje="Esta categoría aún no tiene productos publicados." />
      )}
    </div>
  );
}
