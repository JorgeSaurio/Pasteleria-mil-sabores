import { Link } from 'react-router-dom';
import type { Orden } from '@/types';
import { formatearFecha, formatearMoneda } from '@/utils/formato';

interface TablaOrdenesProps {
  ordenes: Orden[];
  /** En el historial de UN usuario la columna cliente sería redundante. */
  mostrarCliente?: boolean;
}

export function TablaOrdenes({ ordenes, mostrarCliente = true }: TablaOrdenesProps) {
  return (
    <div className="card border-0 shadow-sm bg-white">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              {mostrarCliente && <th>Cliente</th>}
              <th>Ítems</th>
              <th>Total</th>
              <th>Estado</th>
              <th className="text-end">Boleta</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td className="fw-bold">#{o.numero}</td>
                <td className="text-nowrap">{formatearFecha(o.fecha)}</td>
                {mostrarCliente && <td>{`${o.cliente.nombre} ${o.cliente.apellidos}`}</td>}
                <td>{o.items.reduce((suma, i) => suma + i.cantidad, 0)}</td>
                <td>{formatearMoneda(o.total)}</td>
                <td>
                  <span className={`badge ${o.estado === 'pagada' ? 'bg-success' : 'bg-danger'}`}>{o.estado}</span>
                </td>
                <td className="text-end">
                  <Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-dark">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
