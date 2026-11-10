import { Link, useNavigate, useParams } from 'react-router-dom';
import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { Alerta } from '@/components/shared/Alerta';
import { Cargando } from '@/components/shared/Cargando';
import { FormularioUsuario } from '@/components/shared/FormularioUsuario';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useNotificacion } from '@/hooks/useNotificacion';
import { usuarioRepositorio } from '@/services';
import type { UsuarioNuevo } from '@/types';

/** Alta (/admin/usuarios/nuevo) y edición (/admin/usuarios/:run/editar) con el mismo formulario del registro. */
export function UsuarioFormPage() {
  const { run } = useParams();
  const navigate = useNavigate();
  const { notificar } = useNotificacion();
  const { usuario: actual, actualizarUsuario } = useAuth();
  const { datos: usuario, cargando } = useAsync(
    () => (run ? usuarioRepositorio.obtenerPorRun(run) : Promise.resolve(null)),
    [run],
  );

  const guardar = async (datos: UsuarioNuevo) => {
    let resultado;
    if (run) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { run: _run, password, ...cambios } = datos;
      resultado = await usuarioRepositorio.actualizar(run, { ...cambios, password: password || undefined });
    } else {
      resultado = await usuarioRepositorio.crear(datos);
    }
    if (resultado.ok) {
      // Si el admin se editó a sí mismo, la sesión en memoria se actualiza.
      if (resultado.dato && resultado.dato.run === actual?.run) actualizarUsuario(resultado.dato);
      notificar(resultado.mensaje);
      navigate('/admin/usuarios');
    }
    return resultado;
  };

  const volver = (
    <Link to="/admin/usuarios" className="btn btn-outline-secondary">
      &larr; Volver
    </Link>
  );

  if (cargando) return <Cargando />;
  if (run && !usuario) {
    return (
      <>
        <EncabezadoAdmin titulo="Editar usuario" acciones={volver} />
        <Alerta mensaje="El usuario no existe." variante="warning" />
      </>
    );
  }

  return (
    <>
      <EncabezadoAdmin titulo={run ? 'Editar usuario' : 'Nuevo usuario'} acciones={volver} />
      <div className="card border-0 shadow-sm bg-white p-4">
        <FormularioUsuario modo="admin" usuarioInicial={usuario ?? undefined} onEnviar={guardar} />
      </div>
    </>
  );
}
