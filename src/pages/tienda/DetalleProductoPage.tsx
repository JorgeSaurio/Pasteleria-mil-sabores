import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductoGrilla } from '@/components/productos/ProductoGrilla';
import { Boton } from '@/components/shared/Boton';
import { Cargando } from '@/components/shared/Cargando';
import { ImagenConRespaldo } from '@/components/shared/ImagenConRespaldo';
import { CANTIDAD_MAXIMA_ITEM } from '@/config/constantes';
import { useAsync } from '@/hooks/useAsync';
import { useCarrito } from '@/hooks/useCarrito';
import { categoriaRepositorio, productoRepositorio } from '@/services';
import { estaEnOferta, precioVigente, tieneStock } from '@/utils/carrito';
import { formatearMoneda } from '@/utils/formato';
import { NoEncontradoPage } from './NoEncontradoPage';

const MAXIMO_RELACIONADOS = 4;

/**
 * Detalle de producto. El id viene de la URL (/productos/:id).
 * Si no existe se muestra "no encontrado" (el HTML mostraba el primer producto en silencio).
 */
export function DetalleProductoPage() {
  const { id = '' } = useParams();
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);

  const { datos: producto, cargando } = useAsync(() => productoRepositorio.obtenerPorId(id), [id]);
  const { datos: categoria } = useAsync(
    () => (producto ? categoriaRepositorio.obtenerPorId(producto.categoriaId) : Promise.resolve(null)),
    [producto?.categoriaId],
  );
  // Relacionados: primero los de la misma categoría, con stock, sin el producto actual.
  const { datos: relacionados } = useAsync(async () => {
    if (!producto) return [];
    const { items } = await productoRepositorio.listar({ soloDisponibles: true });
    return items
      .filter((p) => p.id !== producto.id)
      .sort((a, b) => Number(b.categoriaId === producto.categoriaId) - Number(a.categoriaId === producto.categoriaId))
      .slice(0, MAXIMO_RELACIONADOS);
  }, [producto?.id]);

  useEffect(() => {
    setCantidad(1);
    if (producto) document.title = `Pastelería Mil Sabores | ${producto.nombre}`;
    return () => {
      document.title = 'Pastelería Mil Sabores';
    };
  }, [producto]);

  if (cargando) return <Cargando texto="Cargando producto..." />;
  if (!producto) {
    return <NoEncontradoPage titulo="Producto no encontrado" mensaje="El producto que buscas no existe o fue retirado." />;
  }

  const disponible = tieneStock(producto, 1);
  const maximo = Math.max(1, Math.min(producto.stock, CANTIDAD_MAXIMA_ITEM));

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos" className="text-decoration-none">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-5 mb-5 align-items-center">
        <div className="col-md-6 text-center">
          <div className="card border-0 shadow-sm p-4 bg-light">
            <ImagenConRespaldo
              src={producto.imagen}
              alt={producto.nombre}
              loading="eager"
              className="img-fluid rounded"
              style={{ maxHeight: 380, objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="col-md-6">
          {categoria && (
            <Link to={`/categorias/${categoria.id}`} className="badge bg-secondary mb-2 text-decoration-none">
              {categoria.nombre}
            </Link>
          )}
          <h1 className="display-6 fw-bold mb-2">{producto.nombre}</h1>
          <div className="h3 text-success fw-bold mb-4">
            {estaEnOferta(producto) && <span className="precio-anterior me-2">{formatearMoneda(producto.precio)}</span>}
            {formatearMoneda(precioVigente(producto))}
          </div>
          <p className="lead fs-6 text-muted mb-4">{producto.descripcion}</p>
          <p className={`small ${disponible ? 'text-muted' : 'text-danger fw-semibold'}`}>
            {disponible ? `Stock disponible: ${producto.stock} unidades` : 'Producto sin stock'}
          </p>

          <div className="row align-items-center g-3 mb-4">
            <div className="col-auto">
              <label htmlFor="cantidad-producto" className="col-form-label fw-bold">Cantidad:</label>
            </div>
            <div className="col-auto">
              <input
                type="number"
                id="cantidad-producto"
                className="form-control text-center"
                style={{ width: 90 }}
                min={1}
                max={maximo}
                value={cantidad}
                disabled={!disponible}
                onChange={(e) => setCantidad(Math.min(maximo, Math.max(1, Number(e.target.value) || 1)))}
              />
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex">
            <Boton variante="primary" className="btn-lg px-4 fw-bold" deshabilitado={!disponible} onClick={() => agregar(producto, cantidad)}>
              {disponible ? 'Añadir al carrito' : 'Sin stock'}
            </Boton>
            <Link to="/carrito" className="btn btn-outline-dark btn-lg px-4">Ir al carrito</Link>
          </div>
        </div>
      </div>

      {relacionados && relacionados.length > 0 && (
        <section className="mt-5 border-top pt-4">
          <h2 className="h4 fw-bold mb-4">Productos relacionados</h2>
          <ProductoGrilla productos={relacionados} columnas="row-cols-2 row-cols-md-4" compacta />
        </section>
      )}
    </div>
  );
}
