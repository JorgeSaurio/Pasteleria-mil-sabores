import { useState } from 'react';
import { useFormulario, type Validadores } from '@/hooks/useFormulario';
import type { ResultadoOperacion, Rol, Usuario, UsuarioNuevo, Variante } from '@/types';
import { ROLES } from '@/types';
import {
  limpiarRun,
  validarApellidos,
  validarConfirmacion,
  validarDireccion,
  validarEmail,
  validarNombre,
  validarPassword,
  validarRun,
  validarSeleccion,
  validarTelefono,
} from '@/utils/validaciones';
import { Alerta } from './Alerta';
import { Boton } from './Boton';
import { CampoFormulario } from './CampoFormulario';
import { CampoSelect } from './CampoSelect';
import { SelectorRegionComuna } from './SelectorRegionComuna';

export type ModoFormularioUsuario = 'registro' | 'admin' | 'perfil';

interface FormularioUsuarioProps {
  modo: ModoFormularioUsuario;
  usuarioInicial?: Usuario;
  onEnviar: (datos: UsuarioNuevo) => Promise<ResultadoOperacion<Usuario>>;
  textoBoton?: string;
}

type ValoresUsuario = {
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  email2: string;
  fechaNacimiento: string;
  rol: string;
  region: string;
  comuna: string;
  password: string;
  password2: string;
  telefono: string;
  direccion: string;
};

function valoresDesde(usuario?: Usuario): ValoresUsuario {
  return {
    run: usuario?.run ?? '',
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    email: usuario?.email ?? '',
    email2: usuario?.email ?? '',
    fechaNacimiento: usuario?.fechaNacimiento ?? '',
    rol: usuario?.rol ?? '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    password: '',
    password2: '',
    telefono: usuario?.telefono ?? '',
    direccion: usuario?.direccion ?? '',
  };
}

export function FormularioUsuario({ modo, usuarioInicial, onEnviar, textoBoton }: FormularioUsuarioProps) {
  const esEdicion = !!usuarioInicial;
  const [resultado, setResultado] = useState<{ mensaje: string; variante: Variante } | null>(null);

  const validadores: Validadores<ValoresUsuario> = {
    run: esEdicion ? undefined : validarRun,
    nombre: validarNombre,
    apellidos: validarApellidos,
    email: validarEmail,
    email2: (valor, valores) => validarConfirmacion(valor, valores.email, 'Los correos no coinciden.'),
    rol: modo === 'admin' ? validarSeleccion('Selecciona un tipo de usuario.') : undefined,
    region: validarSeleccion('Selecciona una región.'),
    comuna: validarSeleccion('Selecciona una comuna.'),
    password: (valor) => (esEdicion && !valor ? null : validarPassword(valor)),
    password2: (valor, valores) =>
      esEdicion && !valores.password ? null : validarConfirmacion(valor, valores.password, 'Las contraseñas no coinciden.'),
    telefono: validarTelefono,
    direccion: validarDireccion,
  };

  const { valores, errores, enviando, handleChange, setVarios, manejarEnvio, aplicarErroresServidor, reset } =
    useFormulario(valoresDesde(usuarioInicial), {
      validadores,
      dependientes: { email: ['email2'], password: ['password2'] },
    });

  const enviar = manejarEnvio(async (v) => {
    setResultado(null);
    const rol: Rol = modo === 'admin' ? (v.rol as Rol) : (usuarioInicial?.rol ?? 'Cliente');
    const respuesta = await onEnviar({
      run: limpiarRun(v.run),
      nombre: v.nombre.trim(),
      apellidos: v.apellidos.trim(),
      email: v.email.trim().toLowerCase(),
      fechaNacimiento: v.fechaNacimiento || undefined,
      rol,
      region: v.region,
      comuna: v.comuna,
      password: v.password,
      telefono: v.telefono.trim() || undefined,
      direccion: v.direccion.trim(),
    });
    setResultado({ mensaje: respuesta.mensaje, variante: respuesta.ok ? 'success' : 'danger' });
    aplicarErroresServidor(respuesta.errores);
    if (respuesta.ok && !esEdicion) reset();
  });

  return (
    <form onSubmit={enviar} noValidate>
      <Alerta mensaje={resultado?.mensaje} variante={resultado?.variante} onCerrar={() => setResultado(null)} />

      <div className="row g-3">
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-run" name="run" label="RUN" value={valores.run} onChange={handleChange}
            error={errores.run} placeholder="12345678K" required readOnly={esEdicion}
            ayuda={esEdicion ? 'El RUN no se puede modificar.' : 'Sin puntos ni guion.'}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-nacimiento" name="fechaNacimiento" label="Fecha de nacimiento" type="date"
            value={valores.fechaNacimiento} onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-nombre" name="nombre" label="Nombre" value={valores.nombre} onChange={handleChange}
            error={errores.nombre} placeholder="John" required autoComplete="given-name"
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-apellidos" name="apellidos" label="Apellidos" value={valores.apellidos} onChange={handleChange}
            error={errores.apellidos} placeholder="Doe Salinas" required autoComplete="family-name"
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-email" name="email" label="Correo" type="email" value={valores.email} onChange={handleChange}
            error={errores.email} placeholder="ejemplo@duoc.cl" required autoComplete="email"
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-email2" name="email2" label="Confirmar correo" type="email" value={valores.email2}
            onChange={handleChange} error={errores.email2} placeholder="ejemplo@duoc.cl" required
          />
        </div>

        {modo === 'admin' && (
          <div className="col-md-6">
            <CampoSelect
              id="usuario-rol" name="rol" label="Tipo de usuario" value={valores.rol} onChange={handleChange}
              opciones={ROLES.map((r) => ({ valor: r, etiqueta: r }))} placeholder="Selecciona un perfil"
              error={errores.rol} required
            />
          </div>
        )}

        <div className="col-md-6">
          <CampoFormulario
            id="usuario-telefono" name="telefono" label="Teléfono (opcional)" type="tel" value={valores.telefono}
            onChange={handleChange} error={errores.telefono} placeholder="+56912345678" autoComplete="tel"
          />
        </div>
      </div>

      <SelectorRegionComuna
        idPrefijo="usuario"
        region={valores.region}
        comuna={valores.comuna}
        onChange={(region, comuna) => setVarios({ region, comuna })}
        errores={{ region: errores.region, comuna: errores.comuna }}
      />

      <CampoFormulario
        id="usuario-direccion" name="direccion" label="Dirección" value={valores.direccion} onChange={handleChange}
        error={errores.direccion} placeholder="Avenida Siempre Viva 123" required autoComplete="street-address"
      />

      <div className="row g-3">
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-password" name="password" label={esEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            type="password" value={valores.password} onChange={handleChange} error={errores.password}
            required={!esEdicion} autoComplete="new-password" ayuda="Entre 4 y 10 caracteres."
          />
        </div>
        <div className="col-md-6">
          <CampoFormulario
            id="usuario-password2" name="password2" label="Confirmar contraseña" type="password"
            value={valores.password2} onChange={handleChange} error={errores.password2}
            required={!esEdicion} autoComplete="new-password"
          />
        </div>
      </div>

      <div className="d-grid mt-2">
        <Boton tipo="submit" variante="dark" cargando={enviando}>
          {textoBoton ?? (esEdicion ? 'Guardar cambios' : 'Registrar')}
        </Boton>
      </div>
    </form>
  );
}
