import { Link, useParams } from 'react-router-dom';
import { ImagenConRespaldo } from '@/components/shared/ImagenConRespaldo';
import { BLOGS } from '@/data/blogs';
import { NoEncontradoPage } from './NoEncontradoPage';

/**
 * Detalle de UN blog (/blog/:id). El HTML original mostraba los dos artículos a la vez.
 * Renderizado condicional: video si tiene videoUrl, si no imagen.
 */
export function DetalleBlogPage() {
  const { id } = useParams();
  const blog = BLOGS.find((b) => b.id === id);

  if (!blog) return <NoEncontradoPage titulo="Artículo no encontrado" mensaje="El artículo que buscas no existe." />;

  return (
    <div className="container my-5">
      <div className="mb-4">
        <Link to="/blog" className="btn btn-outline-secondary btn-sm">
          &larr; Volver al listado de blogs
        </Link>
      </div>

      <article className="blog-entry mb-5">
        <header className="mb-4">
          <span className={`badge ${blog.claseEtiqueta} mb-2`}>{blog.etiqueta}</span>
          <h1 className="display-6 fw-bold">{blog.titulo}</h1>
          <p className="text-muted">{blog.autor}</p>
        </header>

        {blog.videoUrl ? (
          <div className="ratio ratio-16x9 mb-4 shadow rounded overflow-hidden">
            <iframe
              src={blog.videoUrl}
              title={blog.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="text-center mb-4">
            <ImagenConRespaldo src={blog.imagen ?? ''} alt={blog.titulo} className="img-fluid rounded shadow-sm" style={{ maxHeight: 280 }} />
          </div>
        )}

        <div className="lead mb-4">{blog.introduccion}</div>
        {blog.parrafos.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
      </article>
    </div>
  );
}
