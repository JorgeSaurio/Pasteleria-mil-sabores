import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { TablaUsuarios } from '@/components/admin/TablaUsuarios';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { ModalConfirmacion } from '@/components/shared/ModalConfirmacion';
import { Paginacion } from '@/components/shared/Paginacion';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useNotificacion } from '@/hooks/useNotificacion';
import { usuarioRepositorio } from '@/services';
import type { Usuario } from '@/types';

const TAMANO_PAGINA = 10;

export function UsuariosAdminPage() {
  const { usuario } = useAuth();
  const { notificar } = useNotificacion();
  const [parametros, setParametros] = useSearchParams();
  const pagina = Number(parametros.get('pagina') ?? '1') || 1;
  const busqueda = parametros.get('q') ?? '';
  const [aEliminar, setAEliminar] = useState<Usuario | null>(null);

  const { datos, cargando, error, recargar } = useAsync(
    () => usuarioRepositorio.listar({ pagina, busqueda, tamanoPagina: TAMANO_PAGINA }),
    [pagina, busqueda],
  );

  const eliminar = async () => {
    if (!aEliminar) return;
    const resultado = await usuarioRepositorio.eliminar(aEliminar.run);
    notificar(resultado.mensaje, resultado.ok ? 'success' : 'danger');
    setAEliminar(null);
    if (resultado.ok) recargar();
  };

  return (
    <>
      <EncabezadoAdmin
        titulo="Usuarios"
        acciones={
          <Link to="/admin/usuarios/nuevo" className="btn btn-dark">
            + Nuevo usuario
          </Link>
        }
      />
      <input
        type="search"
        className="form-control mb-3"
        placeholder="Buscar por nombre, correo o RUN (Enter)..."
        aria-label="Buscar usuarios"
        defaultValue={busqueda}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setParametros(e.currentTarget.value ? { q: e.currentTarget.value } : {});
        }}
      />
      {cargando && <Cargando />}
      <Alerta mensaje={error} />
      {datos && (
        <>
          <TablaUsuarios usuarios={datos.items} runActual={usuario?.run ?? ''} onEliminar={setAEliminar} />
          <Paginacion
            pagina={datos.pagina}
            total={datos.total}
            tamanoPagina={datos.tamanoPagina}
            onCambiar={(nueva) => setParametros({ ...(busqueda ? { q: busqueda } : {}), pagina: String(nueva) })}
          />
        </>
      )}
      <ModalConfirmacion
        abierto={!!aEliminar}
        titulo="Eliminar usuario"
        mensaje={`¿Eliminar la cuenta de ${aEliminar?.nombre} ${aEliminar?.apellidos}?`}
        textoConfirmar="Eliminar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={eliminar}
      />
    </>
  );
}
