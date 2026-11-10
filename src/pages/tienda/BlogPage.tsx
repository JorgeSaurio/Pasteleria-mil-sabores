import { BlogCard } from '@/components/blog/BlogCard';
import { BLOGS } from '@/data/blogs';

export function BlogPage() {
  return (
    <div className="container my-5">
      <header className="text-center mb-5">
        <h1 className="display-6 fw-bold">NOTICIAS IMPORTANTES</h1>
        <p className="text-muted">Descubre datos curiosos, historia y consejos de nuestra comunidad gastronómica.</p>
      </header>
      <div className="d-flex flex-column gap-4">
        {BLOGS.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
