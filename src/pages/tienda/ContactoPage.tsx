import { useState } from 'react';
import { Alerta } from '@/components/shared/Alerta';
import { Boton } from '@/components/shared/Boton';
import { CampoFormulario } from '@/components/shared/CampoFormulario';
import { useFormulario } from '@/hooks/useFormulario';
import { contactoRepositorio } from '@/services';
import type { Variante } from '@/types';
import { requerido, validarEmail } from '@/utils/validaciones';

const MAXIMO_COMENTARIO = 500;

/** Formulario de contacto con validación en vivo y contador de caracteres. */
export function ContactoPage() {
  const [resultado, setResultado] = useState<{ mensaje: string; variante: Variante } | null>(null);

  const { valores, errores, enviando, handleChange, manejarEnvio, reset } = useFormulario(
    { nombre: '', email: '', comentario: '' },
    {
      validadores: {
        nombre: requerido('El nombre', 100),
        email: validarEmail,
        comentario: requerido('El comentario', MAXIMO_COMENTARIO),
      },
    },
  );

  const enviar = manejarEnvio(async (v) => {
    const respuesta = await contactoRepositorio.enviar(v);
    setResultado({ mensaje: respuesta.mensaje, variante: respuesta.ok ? 'success' : 'danger' });
    if (respuesta.ok) reset();
  });

  return (
    <div className="container my-5" style={{ maxWidth: 720 }}>
      <h1 className="text-center mb-4">Contacto</h1>
      <form onSubmit={enviar} noValidate>
        <Alerta mensaje={resultado?.mensaje} variante={resultado?.variante} onCerrar={() => setResultado(null)} />
        <CampoFormulario id="contacto-nombre" name="nombre" label="Nombre" value={valores.nombre} onChange={handleChange} error={errores.nombre} placeholder="Juan Pérez" required />
        <CampoFormulario id="contacto-email" name="email" label="Correo" type="email" value={valores.email} onChange={handleChange} error={errores.email} placeholder="ejemplo@duoc.cl" required />
        <CampoFormulario
          id="contacto-comentario" name="comentario" label="Comentario" as="textarea" filas={5}
          value={valores.comentario} onChange={handleChange} error={errores.comentario}
          placeholder="Escribe tu comentario aquí" required
          ayuda={`${valores.comentario.length}/${MAXIMO_COMENTARIO} caracteres`}
        />
        <div className="d-grid">
          <Boton tipo="submit" variante="outline-dark" cargando={enviando}>
            Enviar comentario
          </Boton>
        </div>
      </form>
    </div>
  );
}
