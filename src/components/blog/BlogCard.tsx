import { Link } from 'react-router-dom';
import { ImagenConRespaldo } from '@/components/shared/ImagenConRespaldo';
import type { Blog } from '@/types';

interface BlogCardProps {
  blog: Blog;
}

/** Elemento del listado de blogs. Si el artículo es un video, muestra una miniatura informativa. */
export function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="card border-0 shadow-sm p-3">
      <div className="row g-4 align-items-center">
        <div className="col-md-7">
          <div className="card-body">
            <span className={`badge ${blog.claseEtiqueta} mb-2`}>{blog.etiqueta}</span>
            <h2 className="card-title h3 fw-bold">{blog.titulo}</h2>
            <p className="h5 text-secondary mb-3">{blog.subtitulo}</p>
            <p className="card-text text-muted">{blog.resumen}</p>
            <Link to={`/blog/${blog.id}`} className="btn btn-outline-dark px-4 mt-2">
              Ver caso
            </Link>
          </div>
        </div>
        <div className="col-md-5 text-center">
          {blog.videoUrl ? (
            <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
              <div className="d-flex justify-content-center align-items-center bg-dark text-white text-center p-3">
                <div>
                  <p className="mb-1 fw-bold">Reportaje en video</p>
                  <small className="text-white-50">Haz clic en "Ver caso" para reproducir</small>
                </div>
              </div>
            </div>
          ) : (
            <ImagenConRespaldo
              src={blog.imagen ?? ''}
              alt={blog.titulo}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: 220 }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
