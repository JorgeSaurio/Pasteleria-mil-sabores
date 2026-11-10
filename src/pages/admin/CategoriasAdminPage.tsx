import { useState, type FormEvent } from 'react';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { Alerta } from '@/components/shared/Alerta';
import { Boton } from '@/components/shared/Boton';
import { Cargando } from '@/components/shared/Cargando';
import { ModalConfirmacion } from '@/components/shared/ModalConfirmacion';
import { useAsync } from '@/hooks/useAsync';
import { useNotificacion } from '@/hooks/useNotificacion';
import { categoriaRepositorio, productoRepositorio } from '@/services';
import type { Categoria } from '@/types';

export function CategoriasAdminPage() {
  const { notificar } = useNotificacion();
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [aEliminar, setAEliminar] = useState<Categoria | null>(null);

  const { datos, cargando, recargar } = useAsync(async () => {
    const [categorias, productos] = await Promise.all([categoriaRepositorio.listar(), productoRepositorio.listar()]);
    const conteo = new Map<string, number>();
    productos.items.forEach((p) => conteo.set(p.categoriaId, (conteo.get(p.categoriaId) ?? 0) + 1));
    return categorias.map((c) => ({ ...c, cantidad: conteo.get(c.id) ?? 0 }));
  }, []);

  const limpiar = () => {
    setEditando(null);
    setNombre('');
    setError(null);
  };

  const guardar = async (evento: FormEvent) => {
    evento.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setGuardando(true);
    const resultado = editando
      ? await categoriaRepositorio.actualizar({ ...editando, nombre })
      : await categoriaRepositorio.crear({ nombre });
    setGuardando(false);
    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }
    notificar(resultado.mensaje);
    limpiar();
    recargar();
  };

  const eliminar = async () => {
    if (!aEliminar) return;
    const resultado = await categoriaRepositorio.eliminar(aEliminar.id);
    notificar(resultado.mensaje, resultado.ok ? 'success' : 'danger');
    setAEliminar(null);
    if (resultado.ok) recargar();
  };

  return (
    <>
      <EncabezadoAdmin titulo="Categorías" subtitulo="Organiza los productos del catálogo" />

      <form onSubmit={guardar} className="card border-0 shadow-sm bg-white p-3 mb-4" noValidate>
        <label htmlFor="categoria-nombre" className="form-label fw-semibold">
          {editando ? `Editar categoría "${editando.nombre}"` : 'Nueva categoría'}
        </label>
        <div className="d-flex gap-2 flex-wrap">
          <input
            id="categoria-nombre"
            className={`form-control flex-grow-1 ${error ? 'is-invalid' : ''}`}
            style={{ maxWidth: 420 }}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError(null);
            }}
            placeholder="Ej: Tortas Infantiles"
          />
          <Boton tipo="submit" cargando={guardando}>{editando ? 'Actualizar' : 'Crear'}</Boton>
          {editando && (
            <Boton variante="outline-secondary" onClick={limpiar}>
              Cancelar
            </Boton>
          )}
        </div>
        {error && <div className="text-danger small mt-1">{error}</div>}
      </form>

      {cargando && <Cargando />}
      {datos && (
        <div className="card border-0 shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Identificador</th>
                  <th>Productos</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-semibold">{c.nombre}</td>
                    <td><code>{c.id}</code></td>
                    <td>{c.cantidad}</td>
                    <td className="text-end text-nowrap">
                      <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => { setEditando(c); setNombre(c.nombre); setError(null); }}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setAEliminar(c)}
                        disabled={c.cantidad > 0}
                        title={c.cantidad > 0 ? 'Tiene productos asociados' : undefined}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Alerta className="mt-3" variante="info" mensaje="Solo se pueden eliminar categorías sin productos asociados." />

      <ModalConfirmacion
        abierto={!!aEliminar}
        titulo="Eliminar categoría"
        mensaje={`¿Eliminar la categoría "${aEliminar?.nombre}"?`}
        textoConfirmar="Eliminar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={eliminar}
      />
    </>
  );
}
