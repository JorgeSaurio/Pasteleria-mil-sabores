import { Link } from 'react-router-dom';

interface ModuloAdminCardProps {
  titulo: string;
  descripcion: string;
  ruta: string;
}

export function ModuloAdminCard({ titulo, descripcion, ruta }: ModuloAdminCardProps) {
  return (
    <Link to={ruta} className="card border-0 shadow-sm h-100 text-decoration-none text-dark categoria-card">
      <div className="card-body text-center p-4">
        <h2 className="h6 fw-bold">{titulo}</h2>
        <p className="small text-muted mb-0">{descripcion}</p>
      </div>
    </Link>
  );
}
