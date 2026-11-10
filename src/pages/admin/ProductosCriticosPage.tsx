import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { TablaProductosAdmin } from '@/components/admin/TablaProductosAdmin';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { useAsync } from '@/hooks/useAsync';
import { categoriaRepositorio, productoRepositorio } from '@/services';

export function ProductosCriticosPage() {
  const { datos, cargando, error } = useAsync(
    () => Promise.all([productoRepositorio.listarCriticos(), categoriaRepositorio.listar()]),
    [],
  );

  return (
    <>
      <EncabezadoAdmin titulo="Stock crítico" subtitulo="Productos que requieren reposición" />
      {cargando && <Cargando />}
      <Alerta mensaje={error} />
      {datos && datos[0].length === 0 && <EstadoVacio titulo="Todo en orden" mensaje="No hay productos en stock crítico." />}
      {datos && datos[0].length > 0 && <TablaProductosAdmin productos={datos[0]} categorias={datos[1]} />}
    </>
  );
}
