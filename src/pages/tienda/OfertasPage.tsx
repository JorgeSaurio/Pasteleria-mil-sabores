import { GrillaEsqueleto } from '@/components/productos/GrillaEsqueleto';
import { ProductoGrilla } from '@/components/productos/ProductoGrilla';
import { Alerta } from '@/components/shared/Alerta';
import { EstadoVacio } from '@/components/shared/EstadoVacio';
import { useAsync } from '@/hooks/useAsync';
import { useCarrito } from '@/hooks/useCarrito';
import { productoRepositorio } from '@/services';

/** Vista Ofertas (nueva): productos con precioOferta vigente. */
export function OfertasPage() {
  const { agregar } = useCarrito();
  const { datos, cargando, error, recargar } = useAsync(() => productoRepositorio.listarOfertas(), []);

  return (
    <div className="container my-5">
      <header className="text-center mb-5">
        <h1 className="display-6 fw-bold">OFERTAS</h1>
        <p className="text-muted">Precios especiales por tiempo limitado.</p>
      </header>

      {cargando && <GrillaEsqueleto cantidad={4} />}
      {error && <Alerta mensaje={error} onCerrar={recargar} />}
      {!cargando && !error && datos && datos.length === 0 && (
        <EstadoVacio
          titulo="Sin ofertas por ahora"
          mensaje="Vuelve pronto: renovamos nuestras ofertas constantemente."
          accion={{ texto: 'Ver catálogo', ruta: '/productos' }}
        />
      )}
      {!cargando && datos && datos.length > 0 && <ProductoGrilla productos={datos} onAgregar={agregar} mostrarDescripcion />}
    </div>
  );
}
