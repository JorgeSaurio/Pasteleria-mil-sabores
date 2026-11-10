import { Link, useParams } from 'react-router-dom';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { TablaOrdenes } from '@/components/admin/TablaOrdenes';
import { Cargando } from '@/components/shared/Cargando';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { useAsync } from '@/hooks/useAsync';
import { ordenRepositorio, usuarioRepositorio } from '@/services';
import { formatearRun } from '@/utils/formato';

/** Historial de compras de un usuario (nuevo, Figura 10). */
export function HistorialComprasPage() {
  const { run = '' } = useParams();
  const { datos, cargando } = useAsync(
    () => Promise.all([usuarioRepositorio.obtenerPorRun(run), ordenRepositorio.listarPorRun(run)]),
    [run],
  );
  const [usuario, ordenes] = datos ?? [null, []];

  return (
    <>
      <EncabezadoAdmin
        titulo="Historial de compras"
        subtitulo={usuario ? `${usuario.nombre} ${usuario.apellidos} · ${formatearRun(usuario.run)}` : formatearRun(run)}
        acciones={<Link to="/admin/usuarios" className="btn btn-outline-secondary">&larr; Volver</Link>}
      />
      {cargando && <Cargando />}
      {!cargando && ordenes.length === 0 && <EstadoVacio titulo="Sin compras" mensaje="Este usuario aún no registra compras." />}
      {ordenes.length > 0 && <TablaOrdenes ordenes={ordenes} mostrarCliente={false} />}
    </>
  );
}
