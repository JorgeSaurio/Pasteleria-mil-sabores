import { Link } from 'react-router-dom';
import { ImagenConRespaldo } from '@/components/shared/ImagenConRespaldo';
import type { Categoria, Producto } from '@/types';
import { esStockCritico, estaEnOferta } from '@/utils/carrito';
import { formatearMoneda } from '@/utils/formato';

interface TablaProductosAdminProps {
  productos: Producto[];
  categorias: Categoria[];
  onEliminar?: (producto: Producto) => void;
}

export function TablaProductosAdmin({ productos, categorias, onEliminar }: TablaProductosAdminProps) {
  const nombreCategoria = new Map(categorias.map((c) => [c.id, c.nombre]));

  return (
    <div className="card border-0 shadow-sm bg-white">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 table-admin">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Crítico</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td className="fw-bold">{p.id}</td>
                <td>
                  <ImagenConRespaldo src={p.imagen} alt="" className="rounded me-2 border" style={{ width: 42, height: 42, objectFit: 'contain' }} />
                  {p.nombre}
                </td>
                <td>
                  <span className="badge bg-light text-dark border">{nombreCategoria.get(p.categoriaId) ?? 'Sin categoría'}</span>
                </td>
                <td>
                  {estaEnOferta(p) ? (
                    <>
                      <span className="precio-anterior d-block">{formatearMoneda(p.precio)}</span>
                      <span className="text-danger fw-semibold">{formatearMoneda(p.precioOferta ?? p.precio)}</span>
                    </>
                  ) : (
                    formatearMoneda(p.precio)
                  )}
                </td>
                <td>
                  <span className={`badge ${esStockCritico(p) ? 'badge-stock-critico' : 'badge-stock-ok'}`}>
                    {esStockCritico(p) ? `Crítico (${p.stock})` : `${p.stock} un.`}
                  </span>
                </td>
                <td>{p.stockCritico} un.</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-1">
                    Editar
                  </Link>
                  {onEliminar && (
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(p)}>
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
