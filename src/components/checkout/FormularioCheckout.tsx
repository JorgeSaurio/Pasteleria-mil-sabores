import { Boton } from '@/components/shared/Boton';
import { CampoFormulario } from '@/components/shared/CampoFormulario';
import { CampoSelect } from '@/components/shared/CampoSelect';
import { SelectorRegionComuna } from '@/components/shared/SelectorRegionComuna';
import { useFormulario } from '@/hooks/useFormulario';
import type { DatosCliente, DireccionEnvio, MedioPago } from '@/types';
import { formatearMoneda } from '@/utils/formato';
import {
  requerido,
  validarApellidos,
  validarEmailFormato,
  validarNombre,
  validarSeleccion,
} from '@/utils/validaciones';

export interface DatosCheckout {
  cliente: DatosCliente;
  envio: DireccionEnvio;
  medioPago: MedioPago;
}

type ValoresCheckout = {
  nombre: string;
  apellidos: string;
  email: string;
  calle: string;
  departamento: string;
  region: string;
  comuna: string;
  indicaciones: string;
  medioPago: string;
};

interface FormularioCheckoutProps {
  /** Precarga desde el usuario en sesión (nota del instructivo). */
  valoresIniciales?: Partial<ValoresCheckout>;
  total: number;
  /** Mientras es true el botón queda bloqueado: evita pagar dos veces. */
  procesando: boolean;
  onPagar: (datos: DatosCheckout) => Promise<void>;
}

const MEDIOS_PAGO: { valor: MedioPago; etiqueta: string }[] = [
  { valor: 'tarjeta', etiqueta: 'Tarjeta de crédito / débito' },
  { valor: 'transferencia', etiqueta: 'Transferencia bancaria' },
  { valor: 'prueba-rechazo', etiqueta: 'Tarjeta de prueba (siempre rechazada - demo)' },
];

/** Datos del cliente + dirección de entrega + medio de pago (Figura 6). */
export function FormularioCheckout({ valoresIniciales = {}, total, procesando, onPagar }: FormularioCheckoutProps) {
  const { valores, errores, handleChange, setVarios, manejarEnvio } = useFormulario<ValoresCheckout>(
    {
      nombre: '',
      apellidos: '',
      email: '',
      calle: '',
      departamento: '',
      region: '',
      comuna: '',
      indicaciones: '',
      medioPago: 'tarjeta',
      ...valoresIniciales,
    },
    {
      validadores: {
        nombre: validarNombre,
        apellidos: validarApellidos,
        email: validarEmailFormato,
        calle: requerido('La calle', 300),
        region: validarSeleccion('Selecciona una región.'),
        comuna: validarSeleccion('Selecciona una comuna.'),
        medioPago: validarSeleccion('Selecciona un medio de pago.'),
      },
    },
  );

  const enviar = manejarEnvio((v) =>
    onPagar({
      cliente: { nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), email: v.email.trim().toLowerCase() },
      envio: {
        calle: v.calle.trim(),
        departamento: v.departamento.trim() || undefined,
        region: v.region,
        comuna: v.comuna,
        indicaciones: v.indicaciones.trim() || undefined,
      },
      medioPago: v.medioPago as MedioPago,
    }),
  );

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="h5 fw-bold mt-4">Información del cliente</h2>
      <p className="small text-muted">Completa la siguiente información</p>
      <div className="row g-3">
        <div className="col-md-6">
          <CampoFormulario id="checkout-nombre" name="nombre" label="Nombre" value={valores.nombre} onChange={handleChange} error={errores.nombre} required autoComplete="given-name" />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="checkout-apellidos" name="apellidos" label="Apellidos" value={valores.apellidos} onChange={handleChange} error={errores.apellidos} required autoComplete="family-name" />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="checkout-email" name="email" label="Correo" type="email" value={valores.email} onChange={handleChange} error={errores.email} required autoComplete="email" />
        </div>
      </div>

      <h2 className="h5 fw-bold mt-3">Dirección de entrega de los productos</h2>
      <p className="small text-muted">Ingrese la dirección de forma detallada</p>
      <div className="row g-3">
        <div className="col-md-8">
          <CampoFormulario id="checkout-calle" name="calle" label="Calle" value={valores.calle} onChange={handleChange} error={errores.calle} required autoComplete="street-address" />
        </div>
        <div className="col-md-4">
          <CampoFormulario id="checkout-depto" name="departamento" label="Departamento (opcional)" value={valores.departamento} onChange={handleChange} placeholder="Ej: 603" />
        </div>
      </div>

      <SelectorRegionComuna
        idPrefijo="checkout"
        region={valores.region}
        comuna={valores.comuna}
        onChange={(region, comuna) => setVarios({ region, comuna })}
        errores={{ region: errores.region, comuna: errores.comuna }}
      />

      <CampoFormulario
        id="checkout-indicaciones" name="indicaciones" label="Indicaciones para la entrega (opcional)" as="textarea" filas={2}
        value={valores.indicaciones} onChange={handleChange} placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
      />

      <CampoSelect
        id="checkout-medio" name="medioPago" label="Medio de pago" value={valores.medioPago} onChange={handleChange}
        opciones={MEDIOS_PAGO} error={errores.medioPago} required
      />

      <div className="d-flex justify-content-end">
        <Boton tipo="submit" variante="success" className="btn-lg" cargando={procesando}>
          Pagar ahora {formatearMoneda(total)}
        </Boton>
      </div>
    </form>
  );
}
