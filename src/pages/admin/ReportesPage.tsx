import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { StatCard } from '@/components/admin/StatCard';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { useAsync } from '@/hooks/useAsync';
import { categoriaRepositorio, ordenRepositorio, productoRepositorio } from '@/services';
import { formatearMoneda } from '@/utils/formato';

/**
 * Reportes (nuevo). Indicadores calculados en el frontend a partir de las órdenes.
 * Con backend, estos cálculos deberían venir agregados desde un endpoint de reportes.
 */
export function ReportesPage() {
  const { datos, cargando, error } = useAsync(async () => {
    const [ordenes, productos, categorias] = await Promise.all([
      ordenRepositorio.listar(),
      productoRepositorio.listar(),
      categoriaRepositorio.listar(),
    ]);
    const pagadas = ordenes.items.filter((o) => o.estado === 'pagada');
    const rechazadas = ordenes.items.length - pagadas.length;
    const ventas = pagadas.reduce((s, o) => s + o.total, 0);

    const categoriaDe = new Map(productos.items.map((p) => [p.id, p.categoriaId]));
    const nombreCategoria = new Map(categorias.map((c) => [c.id, c.nombre]));
    const porCategoria = new Map<string, number>();
    const porProducto = new Map<string, { nombre: string; unidades: number; monto: number }>();

    pagadas.forEach((o) =>
      o.items.forEach((i) => {
        const cat = nombreCategoria.get(categoriaDe.get(i.productoId) ?? '') ?? 'Sin categoría';
        porCategoria.set(cat, (porCategoria.get(cat) ?? 0) + i.precioUnitario * i.cantidad);
        const previo = porProducto.get(i.productoId) ?? { nombre: i.nombre, unidades: 0, monto: 0 };
        porProducto.set(i.productoId, {
          nombre: i.nombre,
          unidades: previo.unidades + i.cantidad,
          monto: previo.monto + i.precioUnitario * i.cantidad,
        });
      }),
    );

    return {
      ventas,
      pagadas: pagadas.length,
      rechazadas,
      ticketPromedio: pagadas.length ? Math.round(ventas / pagadas.length) : 0,
      tasaRechazo: ordenes.items.length ? Math.round((rechazadas / ordenes.items.length) * 100) : 0,
      categorias: [...porCategoria.entries()].sort((a, b) => b[1] - a[1]),
      top: [...porProducto.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 5),
    };
  }, []);

  return (
    <>
      <EncabezadoAdmin titulo="Reportes" subtitulo="Indicadores de ventas de la tienda" />
      {cargando && <Cargando />}
      <Alerta mensaje={error} />
      {datos && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3"><StatCard titulo="Ventas totales" valor={formatearMoneda(datos.ventas)} detalle={`${datos.pagadas} órdenes pagadas`} /></div>
            <div className="col-sm-6 col-xl-3"><StatCard titulo="Ticket promedio" valor={formatearMoneda(datos.ticketPromedio)} detalle="Por orden pagada" variante="success" /></div>
            <div className="col-sm-6 col-xl-3"><StatCard titulo="Pagos rechazados" valor={datos.rechazadas} detalle="Órdenes no concretadas" variante="danger" /></div>
            <div className="col-sm-6 col-xl-3"><StatCard titulo="Tasa de rechazo" valor={`${datos.tasaRechazo}%`} detalle="Sobre el total de intentos" variante="warning" /></div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm bg-white p-3 h-100">
                <h2 className="h6 fw-bold">Ventas por categoría</h2>
                {datos.categorias.length === 0 ? (
                  <p className="text-muted small mb-0">Aún no hay ventas.</p>
                ) : (
                  <table className="table table-sm mb-0">
                    <tbody>
                      {datos.categorias.map(([nombre, monto]) => (
                        <tr key={nombre}>
                          <td>{nombre}</td>
                          <td className="text-end">{formatearMoneda(monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm bg-white p-3 h-100">
                <h2 className="h6 fw-bold">Productos más vendidos</h2>
                {datos.top.length === 0 ? (
                  <p className="text-muted small mb-0">Aún no hay ventas.</p>
                ) : (
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr><th>Producto</th><th className="text-center">Unidades</th><th className="text-end">Monto</th></tr>
                    </thead>
                    <tbody>
                      {datos.top.map((p) => (
                        <tr key={p.nombre}>
                          <td>{p.nombre}</td>
                          <td className="text-center">{p.unidades}</td>
                          <td className="text-end">{formatearMoneda(p.monto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
