import { ICONOS } from '@/config/constantes';

const MEDIOS_PAGO = [
  { nombre: 'Visa', icono: ICONOS.visa },
  { nombre: 'Pix', icono: ICONOS.pix },
];

const REDES = [
  { nombre: 'Instagram', icono: ICONOS.instagram, url: 'https://www.instagram.com/' },
  { nombre: 'Facebook', icono: ICONOS.facebook, url: 'https://www.facebook.com/' },
];

/** Footer estático. Medios de pago y redes como arreglos + .map (sin repetir marcado). */
export function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-md-4 text-center text-md-start">
            <span className="small d-block text-white mb-2">Medios de pago</span>
            <div className="d-inline-flex align-items-center gap-2">
              {MEDIOS_PAGO.map((medio) => (
                <img
                  key={medio.nombre}
                  src={medio.icono}
                  alt={medio.nombre}
                  className="img-fluid rounded border border-secondary"
                  style={{ maxHeight: 26 }}
                />
              ))}
            </div>
          </div>

          <div className="col-md-4 text-center">
            <p className="mb-1 fw-semibold">
              Pastelería 1000 Sabores &copy; {new Date().getFullYear()}
              <br />
              50 Años endulzando momentos
            </p>
          </div>

          <div className="col-md-4 text-center text-md-end">
            <span className="small d-block text-white mb-2">Síguenos en nuestras RRSS</span>
            <div className="d-inline-flex align-items-center gap-3">
              {REDES.map((red) => (
                <a
                  key={red.nombre}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                  aria-label={red.nombre}
                >
                  <img src={red.icono} alt={red.nombre} width={28} height={28} className="img-fluid rounded" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
