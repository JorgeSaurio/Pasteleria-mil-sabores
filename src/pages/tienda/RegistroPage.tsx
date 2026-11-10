import { Link, useNavigate } from 'react-router-dom';
import { FormularioUsuario } from '@/components/shared/FormularioUsuario';
import { useNotificacion } from '@/hooks/useNotificacion';
import { usuarioRepositorio } from '@/services';
import type { UsuarioNuevo } from '@/types';

/** Registro público: reutiliza FormularioUsuario en modo "registro" (rol fijo Cliente). */
export function RegistroPage() {
  const navigate = useNavigate();
  const { notificar } = useNotificacion();

  const registrar = async (datos: UsuarioNuevo) => {
    const resultado = await usuarioRepositorio.registrar(datos);
    if (resultado.ok) {
      notificar('¡Cuenta creada! Ya puedes iniciar sesión.');
      navigate('/login');
    }
    return resultado;
  };

  return (
    <div className="container my-5" style={{ maxWidth: 820 }}>
      <h1 className="text-center mb-2">Registro de usuario</h1>
      <p className="text-center text-muted mb-4">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
      <FormularioUsuario modo="registro" onEnviar={registrar} textoBoton="REGISTRAR" />
    </div>
  );
}
