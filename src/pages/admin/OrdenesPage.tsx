import { useSearchParams } from 'react-router-dom';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { TablaOrdenes } from '@/components/admin/TablaOrdenes';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { Paginacion } from '@/components/shared/Paginacion';
import { useAsync } from '@/hooks/useAsync';
import { ordenRepositorio } from '@/services';
import type { EstadoOrden } from '@/types';

const TAMANO_PAGINA = 10;

export function OrdenesPage() {
  const [parametros, setParametros] = useSearchParams();
  const estado = (parametros.get('estado') ?? '') as EstadoOrden | '';
  const pagina = Number(parametros.get('pagina') ?? '1') || 1;

  const { datos, cargando, error } = useAsync(
    () => ordenRepositorio.listar({ estado: estado || undefined, pagina, tamanoPagina: TAMANO_PAGINA }),
    [estado, pagina],
  );

  return (
    <>
      <EncabezadoAdmin titulo="Órdenes" subtitulo="Seguimiento de compras realizadas" />
      <div className="mb-3" style={{ maxWidth: 260 }}>
        <select
          className="form-select"
          aria-label="Filtrar por estado"
          value={estado}
          onChange={(e) => setParametros(e.target.value ? { estado: e.target.value } : {})}
        >
          <option value="">Todos los estados</option>
          <option value="pagada">Pagadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>
      {cargando && <Cargando />}
      <Alerta mensaje={error} />
      {datos && datos.items.length === 0 && <EstadoVacio titulo="Sin órdenes" mensaje="Aún no hay órdenes con este filtro." />}
      {datos && datos.items.length > 0 && (
        <>
          <TablaOrdenes ordenes={datos.items} />
          <Paginacion
            pagina={datos.pagina}
            total={datos.total}
            tamanoPagina={datos.tamanoPagina}
            onCambiar={(nueva) => setParametros({ ...(estado ? { estado } : {}), pagina: String(nueva) })}
          />
        </>
      )}
    </>
  );
}
