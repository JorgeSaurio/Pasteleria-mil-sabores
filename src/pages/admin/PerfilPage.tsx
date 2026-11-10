import { EncabezadoAdmin } from '@/components/admin/EncabezadoAdmin';
import { FormularioUsuario } from '@/components/shared/FormularioUsuario';
import { useAuth } from '@/hooks/useAuth';
import { useNotificacion } from '@/hooks/useNotificacion';
import { usuarioRepositorio } from '@/services';
import type { UsuarioNuevo } from '@/types';

export function PerfilPage() {
  const { usuario, actualizarUsuario } = useAuth();
  const { notificar } = useNotificacion();

  if (!usuario) return null;

  const guardar = async (datos: UsuarioNuevo) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { run, rol, password, ...cambios } = datos;
    const resultado = await usuarioRepositorio.actualizar(usuario.run, { ...cambios, password: password || undefined });
    if (resultado.ok && resultado.dato) {
      actualizarUsuario(resultado.dato);
      notificar('Perfil actualizado.');
    }
    return resultado;
  };

  return (
    <>
      <EncabezadoAdmin titulo="Mi perfil" subtitulo={`Rol: ${usuario.rol}`} />
      <div className="card border-0 shadow-sm bg-white p-4">
        <FormularioUsuario modo="perfil" usuarioInicial={usuario} onEnviar={guardar} />
      </div>
    </>
  );
}
