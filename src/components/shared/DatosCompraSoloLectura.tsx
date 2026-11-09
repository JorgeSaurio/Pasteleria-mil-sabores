import type { DatosCliente, DireccionEnvio } from '@/types';

interface DatosCompraSoloLecturaProps {
  cliente: DatosCliente;
  envio: DireccionEnvio;
}

function Campo({ etiqueta, valor, col = 'col-md-4' }: { etiqueta: string; valor?: string; col?: string }) {
  return (
    <div className={col}>
      <label className="form-label small text-muted mb-1">{etiqueta}</label>
      <input className="form-control" value={valor || '-'} disabled readOnly />
    </div>
  );
}

/** Datos del cliente y envío en solo lectura (Figuras 7 y 8). Reutilizado en la boleta del admin. */
export function DatosCompraSoloLectura({ cliente, envio }: DatosCompraSoloLecturaProps) {
  return (
    <>
      <div className="row g-3 mb-3">
        <Campo etiqueta="Nombre" valor={cliente.nombre} />
        <Campo etiqueta="Apellidos" valor={cliente.apellidos} />
        <Campo etiqueta="Correo" valor={cliente.email} />
      </div>
      <h3 className="h6 fw-bold mt-4">Dirección de entrega de los productos</h3>
      <div className="row g-3 mb-3">
        <Campo etiqueta="Calle" valor={envio.calle} col="col-md-8" />
        <Campo etiqueta="Departamento" valor={envio.departamento} />
        <Campo etiqueta="Región" valor={envio.region} col="col-md-6" />
        <Campo etiqueta="Comuna" valor={envio.comuna} col="col-md-6" />
        <div className="col-12">
          <label className="form-label small text-muted mb-1">Indicaciones para la entrega</label>
          <textarea className="form-control" value={envio.indicaciones || '-'} rows={2} disabled readOnly />
        </div>
      </div>
    </>
  );
}
