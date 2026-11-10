import { Link } from 'react-router-dom';
import { ImagenConRespaldo } from '@/components/shared/ImagenConRespaldo';
import type { Categoria } from '@/types';

interface CategoriaCardProps {
  categoria: Categoria;
  activa: boolean;
}

/** Tarjeta de la vista Categorías (Figura 4). Navega por URL para que el enlace sea compartible. */
export function CategoriaCard({ categoria, activa }: CategoriaCardProps) {
  return (
    <Link
      to={`/categorias/${categoria.id}`}
      className={`card border-0 shadow-sm text-center text-decoration-none text-dark h-100 categoria-card ${activa ? 'activa' : ''}`}
      aria-current={activa ? 'page' : undefined}
    >
      <ImagenConRespaldo
        src={categoria.imagen ?? ''}
        alt={categoria.nombre}
        className="card-img-top p-2"
        style={{ height: 90, objectFit: 'contain' }}
      />
      <div className="card-body p-2">
        <span className="small fw-bold">{categoria.nombre}</span>
      </div>
    </Link>
  );
}
