interface ModalConfirmacionProps {
  /** Controlado por el padre: es el padre quien sabe qué se está por confirmar. */
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  varianteConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Reemplaza confirm(): no bloquea el navegador y respeta el estilo del sitio. */
export function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  varianteConfirmar = 'danger',
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  if (!abierto) return null;
  return (
    <>
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="modal-titulo" className="modal-title h5">
                {titulo}
              </h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancelar} />
            </div>
            <div className="modal-body">
              <p className="mb-0">{mensaje}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
                Cancelar
              </button>
              <button type="button" className={`btn btn-${varianteConfirmar}`} onClick={onConfirmar}>
                {textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onCancelar} />
    </>
  );
}
