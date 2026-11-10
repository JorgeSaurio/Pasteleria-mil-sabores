import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BuscadorProductos } from '@/components/productos/BuscadorProductos';
import { FiltroCategoria } from '@/components/productos/FiltroCategoria';
import { GrillaEsqueleto } from '@/components/productos/GrillaEsqueleto';
import { ProductoGrilla } from '@/components/productos/ProductoGrilla';
import { Alerta } from '@/components/shared/Alerta';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { Paginacion } from '@/components/shared/Paginacion';
import { useAsync } from '@/hooks/useAsync';
import { useCarrito } from '@/hooks/useCarrito';
import { categoriaRepositorio, productoRepositorio } from '@/services';

const TAMANO_PAGINA = 12;

/**
 * Catálogo con filtro, buscador y paginación.
 * Los filtros viven en la URL (?categoria=&q=&pagina=), no en useState:
 * el enlace es compartible y "atrás" restaura el filtro.
 * El filtrado lo hace el REPOSITORIO (en memoria hoy, en el servidor mañana), no la página.
 */
export function ProductosPage() {
  const [parametros, setParametros] = useSearchParams();
  const categoria = parametros.get('categoria') ?? '';
  const busqueda = parametros.get('q') ?? '';
  const pagina = Number(parametros.get('pagina') ?? '1') || 1;
  const { agregar } = useCarrito();

  const categorias = useAsync(() => categoriaRepositorio.listar(), []);
  const productos = useAsync(
    () => productoRepositorio.listar({ categoriaId: categoria, busqueda, pagina, tamanoPagina: TAMANO_PAGINA }),
    [categoria, busqueda, pagina],
  );

  /** Cambia un filtro y vuelve a la página 1 (salvo que se cambie la página misma). */
  const actualizar = useCallback(
    (cambios: Record<string, string>) => {
      setParametros((previos) => {
        const siguientes = new URLSearchParams(previos);
        Object.entries(cambios).forEach(([clave, valor]) => (valor ? siguientes.set(clave, valor) : siguientes.delete(clave)));
        if (!('pagina' in cambios)) siguientes.delete('pagina');
        return siguientes;
      });
    },
    [setParametros],
  );

  const buscar = useCallback((texto: string) => actualizar({ q: texto }), [actualizar]);

  const renderResultados = () => {
    if (productos.cargando) return <GrillaEsqueleto cantidad={8} />;
    if (productos.error) return <Alerta mensaje={productos.error} onCerrar={productos.recargar} />;
    if (!productos.datos || productos.datos.items.length === 0) {
      return (
        <EstadoVacio
          titulo="Sin resultados"
          mensaje={busqueda || categoria ? 'No encontramos productos con esos filtros.' : 'El catálogo se está actualizando.'}
        />
      );
    }
    return (
      <>
        <ProductoGrilla
          productos={productos.datos.items}
          onAgregar={agregar}
          categorias={categorias.datos ?? undefined}
          mostrarDescripcion
        />
        <Paginacion
          pagina={productos.datos.pagina}
          total={productos.datos.total}
          tamanoPagina={productos.datos.tamanoPagina}
          onCambiar={(nueva) => actualizar({ pagina: String(nueva) })}
        />
      </>
    );
  };

  return (
    <div className="container my-5">
      <header className="text-center mb-5">
        <h1 className="display-6 fw-bold">NUESTROS PRODUCTOS</h1>
        <p className="text-muted">Explora nuestras tortas tradicionales, postres artesanales y opciones especiales.</p>
      </header>

      <div className="row g-3 mb-4 justify-content-center">
        <div className="col-md-5">
          <BuscadorProductos valorInicial={busqueda} onBuscar={buscar} />
        </div>
        <div className="col-md-4">
          <FiltroCategoria
            categorias={categorias.datos ?? []}
            valor={categoria}
            onChange={(id) => actualizar({ categoria: id })}
          />
        </div>
      </div>

      {renderResultados()}
    </div>
  );
}
