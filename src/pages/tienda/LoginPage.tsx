import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alerta } from '@/components/shared/Alerta';
import { Boton } from '@/components/shared/Boton';
import { CampoFormulario } from '@/components/shared/CampoFormulario';
import { useAuth } from '@/hooks/useAuth';
import { useFormulario } from '@/hooks/useFormulario';
import { useNotificacion } from '@/hooks/useNotificacion';
import { requerido } from '@/utils/validaciones';

/** Inicio de sesión. Redirige a la página que pidió login, o según el rol. */
export function LoginPage() {
  const { usuario, iniciarSesion, cerrarSesion } = useAuth();
  const { notificar } = useNotificacion();
  const navigate = useNavigate();
  const location = useLocation();
  const desde = (location.state as { desde?: string } | null)?.desde;
  const [error, setError] = useState<string | null>(null);

  const { valores, errores, enviando, handleChange, manejarEnvio } = useFormulario(
    { email: '', password: '' },
    { validadores: { email: requerido('El correo'), password: requerido('La contraseña') } },
  );

  const enviar = manejarEnvio(async (v) => {
    setError(null);
    const resultado = await iniciarSesion({ email: v.email, password: v.password });
    if (!resultado.ok || !resultado.dato) {
      setError(resultado.mensaje);
      return;
    }
    notificar(resultado.mensaje);
    const esPersonal = resultado.dato.usuario.rol !== 'Cliente';
    navigate(desde ?? (esPersonal ? '/admin' : '/'), { replace: true });
  });

  // Ya hay sesión: no se muestra el formulario (sin redirigir automáticamente para no
  // competir con la navegación que hace el propio login al completarse).
  if (usuario && !enviando) {
    return (
      <div className="container my-5" style={{ maxWidth: 520 }}>
        <div className="alert alert-info text-center">
          <p className="mb-3">
            Ya iniciaste sesión como <strong>{usuario.nombre}</strong>.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/" className="btn btn-dark btn-sm">Ir al inicio</Link>
            <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => void cerrarSesion()}>
              Cambiar de cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: 520 }}>
      <h1 className="text-center mb-4">Inicio de sesión</h1>
      <form onSubmit={enviar} noValidate>
        <Alerta mensaje={error} onCerrar={() => setError(null)} />
        <CampoFormulario id="login-email" name="email" label="Correo" type="email" value={valores.email} onChange={handleChange} error={errores.email} placeholder="ejemplo@duoc.cl" required autoComplete="email" />
        <CampoFormulario id="login-password" name="password" label="Contraseña" type="password" value={valores.password} onChange={handleChange} error={errores.password} required autoComplete="current-password" />
        <div className="d-grid gap-2">
          <Boton tipo="submit" variante="outline-dark" cargando={enviando}>
            INICIAR SESIÓN
          </Boton>
          <Link to="/registro" className="btn btn-dark">
            Deseo registrarme
          </Link>
        </div>
      </form>
    </div>
  );
}
