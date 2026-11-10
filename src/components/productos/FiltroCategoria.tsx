import type { Categoria } from '@/types';

interface FiltroCategoriaProps {
  categorias: Categoria[];
  valor: string;
  onChange: (categoriaId: string) => void;
}

export function FiltroCategoria({ categorias, valor, onChange }: FiltroCategoriaProps) {
  return (
    <select
      className="form-select shadow-sm"
      aria-label="Filtrar por categoría"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Todas las categorías</option>
      {categorias.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nombre}
        </option>
      ))}
    </select>
  );
}
