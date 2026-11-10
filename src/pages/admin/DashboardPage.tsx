import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { ModuloAdminCard } from '@/components/admin/ModuloAdminCard';
import { StatCard } from '@/components/admin/StatCard';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { MENU_ADMIN } from '@/config/menuAdmin';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { ordenRepositorio, productoRepositorio, usuarioRepositorio } from '@/services';
import { formatearMoneda } from '@/utils/formato';

/**
 * Dashboard. Los indicadores se CALCULAN desde los repositorios
 * (el HTML tenía 16 / 0 / 3 escritos a mano). Las tarjetas salen de MENU_ADMIN.
 */
export function DashboardPage() {
  const { usuario, tieneRol } = useAuth();
  const esAdmin = tieneRol('Administrador');

  const { datos, cargando, error } = useAsync(async () => {
    const [productos, criticos, ordenes, usuarios] = await Promise.all([
      productoRepositorio.listar({ tamanoPagina: 1 }),
      productoRepositorio.listarCriticos(),
      ordenRepositorio.listar({ estado: 'pagada' }),
      // Listar usuarios es exclusivo del administrador (con backend: endpoint protegido).
      esAdmin ? usuarioRepositorio.listar({ tamanoPagina: 1 }) : Promise.resolve(null),
    ]);
    return {
      totalProductos: productos.total,
      criticos: criticos.length,
      ordenesPagadas: ordenes.total,
      ventas: ordenes.items.reduce((suma, o) => suma + o.total, 0),
      totalUsuarios: usuarios?.total ?? null,
    };
  }, [esAdmin]);

  const modulos = MENU_ADMIN.filter((m) => m.ruta !== '/admin' && usuario && m.roles.includes(usuario.rol));

  return (
    <>
      <EncabezadoAdmin titulo={`¡Hola, ${usuario?.nombre ?? 'Administrador'}!`} subtitulo="Resumen de las actividades de la tienda" />

      {cargando && <Cargando />}
      <Alerta mensaje={error} />
      {datos && (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3">
            <StatCard titulo="Ventas" valor={formatearMoneda(datos.ventas)} detalle={`${datos.ordenesPagadas} órdenes pagadas`} variante="primary" />
          </div>
          <div className="col-sm-6 col-xl-3">
            <StatCard titulo="Catálogo activo" valor={datos.totalProductos} detalle="Productos en inventario" variante="success" />
          </div>
          <div className="col-sm-6 col-xl-3">
            <StatCard titulo="Alerta de inventario" valor={datos.criticos} detalle="Productos en stock crítico" variante="danger" />
          </div>
          <div className="col-sm-6 col-xl-3">
            <StatCard
              titulo="Usuarios registrados"
              valor={datos.totalUsuarios ?? '—'}
              detalle={datos.totalUsuarios === null ? 'Solo visible para administradores' : 'Admin, Vendedor, Cliente'}
              variante="warning"
            />
          </div>
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
        {modulos.map((m) => (
          <div className="col" key={m.ruta}>
            <ModuloAdminCard titulo={m.titulo} descripcion={m.descripcion} ruta={m.ruta} />
          </div>
        ))}
      </div>
    </>
  );
}
