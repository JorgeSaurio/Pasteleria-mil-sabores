import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { TablaProductosAdmin } from '@/components/admin/TablaProductosAdmin';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { ModalConfirmacion } from '@/components/shared/ModalConfirmacion';
import { Paginacion } from '@/components/shared/Paginacion';
import { useAsync } from '@/hooks/useAsync';
import { useNotificacion } from '@/hooks/useNotificacion';
import { categoriaRepositorio, productoRepositorio } from '@/services';
import type { Producto } from '@/types';

const TAMANO_PAGINA = 10;

/** Listado de inventario con búsqueda, paginación y eliminación confirmada por modal. */
export function ProductosAdminPage() {
  const [parametros, setParametros] = useSearchParams();
  const pagina = Number(parametros.get('pagina') ?? '1') || 1;
  const busqueda = parametros.get('q') ?? '';
  const [aEliminar, setAEliminar] = useState<Producto | null>(null);
  const { notificar } = useNotificacion();

  const categorias = useAsync(() => categoriaRepositorio.listar(), []);
  const productos = useAsync(
    () => productoRepositorio.listar({ pagina, busqueda, tamanoPagina: TAMANO_PAGINA }),
    [pagina, busqueda],
  );

  const confirmarEliminacion = async () => {
    if (!aEliminar) return;
    const resultado = await productoRepositorio.eliminar(aEliminar.id);
    notificar(resultado.ok ? `${aEliminar.nombre} eliminado.` : resultado.mensaje, resultado.ok ? 'success' : 'danger');
    setAEliminar(null);
    productos.recargar();
  };

  return (
    <>
      <EncabezadoAdmin
        titulo="Inventario de productos"
        acciones={
          <Link to="/admin/productos/nuevo" className="btn btn-dark">
            + Nuevo producto
          </Link>
        }
      />

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Buscar por nombre o descripción..."
        aria-label="Buscar productos"
        defaultValue={busqueda}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setParametros(e.currentTarget.value ? { q: e.currentTarget.value } : {});
        }}
      />

      {productos.cargando && <Cargando />}
      <Alerta mensaje={productos.error} />
      {productos.datos && productos.datos.items.length === 0 && (
        <EstadoVacio titulo="Sin productos" mensaje="No hay productos que coincidan." />
      )}
      {productos.datos && productos.datos.items.length > 0 && (
        <>
          <TablaProductosAdmin productos={productos.datos.items} categorias={categorias.datos ?? []} onEliminar={setAEliminar} />
          <Paginacion
            pagina={productos.datos.pagina}
            total={productos.datos.total}
            tamanoPagina={productos.datos.tamanoPagina}
            onCambiar={(nueva) => setParametros({ ...(busqueda ? { q: busqueda } : {}), pagina: String(nueva) })}
          />
        </>
      )}

      <ModalConfirmacion
        abierto={!!aEliminar}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminacion}
      />
    </>
  );
}
