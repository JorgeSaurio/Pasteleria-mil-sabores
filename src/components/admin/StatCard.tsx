interface StatCardProps {
  titulo: string;
  valor: string | number;
  detalle: string;
  variante?: 'primary' | 'danger' | 'success' | 'warning' | 'dark';
}

export function StatCard({ titulo, valor, detalle, variante = 'primary' }: StatCardProps) {
  return (
    <div className="card border-0 shadow-sm p-3 bg-white h-100">
      <span className="text-muted small fw-semibold">{titulo}</span>
      <span className={`h3 fw-bold text-${variante} mb-1 d-block`}>{valor}</span>
      <span className="small text-muted">{detalle}</span>
    </div>
  );
}
