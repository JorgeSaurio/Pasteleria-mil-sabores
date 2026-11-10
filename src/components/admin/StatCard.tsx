interface StatCardProps {
  titulo: string;
  valor: string | number;
  detalle: string;
  /** Color del valor: primary, danger, success, warning, dark. */
  variante?: 'primary' | 'danger' | 'success' | 'warning' | 'dark';
}

/** Indicador numérico del dashboard (antes con números fijos escritos en el HTML). */
export function StatCard({ titulo, valor, detalle, variante = 'primary' }: StatCardProps) {
  return (
    <div className="card border-0 shadow-sm p-3 bg-white h-100">
      <span className="text-muted small fw-semibold">{titulo}</span>
      <span className={`h3 fw-bold text-${variante} mb-1 d-block`}>{valor}</span>
      <span className="small text-muted">{detalle}</span>
    </div>
  );
}
