import { Link, useNavigate, useParams } from 'react-router-dom';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { FormularioProducto } from '@/components/admin/FormularioProducto';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { useAsync } from '@/hooks/useAsync';
import { useNotificacion } from '@/hooks/useNotificacion';
import { categoriaRepositorio, productoRepositorio } from '@/services';
import type { Producto } from '@/types';

/**
 * Una sola página para crear (/admin/productos/nuevo) y editar (/admin/productos/:id/editar).
 * El modo lo decide la presencia de :id, igual que hacía admin-productos.js con ?id=.
 */
export function ProductoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificar } = useNotificacion();

  const categorias = useAsync(() => categoriaRepositorio.listar(), []);
  const producto = useAsync(() => (id ? productoRepositorio.obtenerPorId(id) : Promise.resolve(null)), [id]);

  const guardar = async (datos: Producto) => {
    const resultado = id ? await productoRepositorio.actualizar(datos) : await productoRepositorio.crear(datos);
    if (resultado.ok) {
      notificar(resultado.mensaje);
      navigate('/admin/productos');
    }
    return resultado;
  };

  const volver = (
    <Link to="/admin/productos" className="btn btn-outline-secondary">
      &larr; Volver
    </Link>
  );

  if (categorias.cargando || producto.cargando) return <Cargando />;
  if (id && !producto.datos) {
    return (
      <>
        <EncabezadoAdmin titulo="Editar producto" acciones={volver} />
        <Alerta mensaje={`El producto ${id} no existe en el inventario.`} variante="warning" />
      </>
    );
  }

  return (
    <>
      <EncabezadoAdmin
        titulo={id ? 'Editar producto' : 'Nuevo producto'}
        subtitulo={id ? `Actualizando información del código ${id}` : 'Completa los datos del nuevo producto'}
        acciones={volver}
      />
      <FormularioProducto productoInicial={producto.datos ?? undefined} categorias={categorias.datos ?? []} onEnviar={guardar} />
    </>
  );
}
