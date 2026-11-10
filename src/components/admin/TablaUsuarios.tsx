import { Link } from 'react-router-dom';
import type { Usuario } from '@/types';
import { formatearRun } from '@/utils/formato';

interface TablaUsuariosProps {
  usuarios: Usuario[];
  runActual: string;
  onEliminar: (usuario: Usuario) => void;
}

const COLOR_ROL: Record<Usuario['rol'], string> = {
  Administrador: 'bg-danger',
  Vendedor: 'bg-warning text-dark',
  Cliente: 'bg-secondary',
};

export function TablaUsuarios({ usuarios, runActual, onEliminar }: TablaUsuariosProps) {
  return (
    <div className="card border-0 shadow-sm bg-white">
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.run}>
                <td className="text-nowrap">{formatearRun(u.run)}</td>
                <td>{`${u.nombre} ${u.apellidos}`.trim()}</td>
                <td>{u.email}</td>
                <td>{u.telefono || '-'}</td>
                <td>
                  <span className={`badge ${COLOR_ROL[u.rol]}`}>{u.rol}</span>
                </td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/usuarios/${u.run}/compras`} className="btn btn-sm btn-outline-secondary me-1">
                    Compras
                  </Link>
                  <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-sm btn-outline-primary me-1">
                    Editar
                  </Link>
                  {u.run !== runActual && (
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(u)}>
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
