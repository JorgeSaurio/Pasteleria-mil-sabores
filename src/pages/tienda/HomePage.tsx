import { Link } from 'react-router-dom';
import { GrillaEsqueleto } from '@/components/productos/GrillaEsqueleto';
import { ProductoGrilla } from '@/components/productos/ProductoGrilla';
import { Alerta } from '@/components/shared/Alerta';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { IMAGEN_POR_DEFECTO } from '@/config/constantes';
import { useAsync } from '@/hooks/useAsync';
import { useCarrito } from '@/hooks/useCarrito';
import { productoRepositorio } from '@/services';

const CANTIDAD_DESTACADOS = 8;

export function HomePage() {
  const { agregar } = useCarrito();
  const { datos, cargando, error, recargar } = useAsync(
    () => productoRepositorio.listar({ soloDisponibles: true, tamanoPagina: CANTIDAD_DESTACADOS }),
    [],
  );

  const renderDestacados = () => {
    if (cargando) return <GrillaEsqueleto cantidad={CANTIDAD_DESTACADOS} columnas="row-cols-1 row-cols-sm-2 row-cols-md-4" />;
    if (error) return <Alerta mensaje={`No se pudieron cargar los productos: ${error}`} onCerrar={recargar} />;
    if (!datos || datos.items.length === 0) {
      return (
        <EstadoVacio
          titulo="Pronto habrá novedades"
          mensaje="No tenemos favoritos publicados por el momento."
          accion={{ texto: 'Explorar el catálogo', ruta: '/productos' }}
        />
      );
    }
    return <ProductoGrilla productos={datos.items} onAgregar={agregar} columnas="row-cols-1 row-cols-sm-2 row-cols-md-4" />;
  };

  return (
    <>
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h1 className="display-4 font-titulo mb-3">Pastelería Mil Sabores</h1>
              <p className="lead">
                Celebrando 50 años como referente de la repostería chilena. Descubre tortas tradicionales,
                postres artesanales y opciones especiales para cada ocasión.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <Link to="/productos" className="btn btn-lg btn-anadir">
                  Ver productos
                </Link>
                <Link to="/ofertas" className="btn btn-lg btn-outline-dark">
                  Ver ofertas
                </Link>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img src={IMAGEN_POR_DEFECTO} alt="Repostería Pastelería Mil Sabores" className="img-fluid rounded shadow-sm" style={{ maxHeight: 280 }} />
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5" id="destacados">
        <h2 className="text-center font-titulo mb-4">Nuestros Favoritos</h2>
        {renderDestacados()}
        <div className="text-center mt-4">
          <Link to="/productos" className="btn btn-outline-dark">
            Ver todo el catálogo
          </Link>
        </div>
      </section>

      <section className="py-5 bg-comunidad">
        <div className="container">
          <article className="row align-items-center g-4">
            <div className="col-md-7">
              <h2 className="font-titulo mb-3">Impacto en la comunidad</h2>
              <p>
                Cada compra en Pastelería Mil Sabores ayuda a formar nuevos talentos: colaboramos con estudiantes de
                gastronomía de Duoc UC, quienes participan en el desarrollo de nuevas recetas y en la atención de
                nuestra tienda online.
              </p>
              <p className="mb-0">
                Mantenemos viva la receta con la que ayudamos a crear la torta más grande del mundo en 1995, un hito
                Guinness que sigue inspirando cada creación que sale de nuestra cocina.
              </p>
            </div>
            <div className="col-md-5 text-center">
              <img
                src={IMAGEN_POR_DEFECTO}
                alt="Estudiantes de gastronomía Duoc UC colaborando con la tienda"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: 220 }}
              />
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
