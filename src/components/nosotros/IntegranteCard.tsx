interface IntegranteCardProps {
  nombre: string;
  rol: string;
  descripcion: string;
}

export function IntegranteCard({ nombre, rol, descripcion }: IntegranteCardProps) {
  return (
    <div className="card border-0 shadow-sm p-3 h-100">
      <div className="card-body">
        <h3 className="h5 card-title fw-bold">{nombre}</h3>
        <p className="text-muted mb-2">{rol}</p>
        <p className="card-text small">{descripcion}</p>
      </div>
    </div>
  );
}
