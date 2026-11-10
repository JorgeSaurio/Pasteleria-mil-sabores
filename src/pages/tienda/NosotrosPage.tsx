import { IntegranteCard } from '@/components/nosotros/IntegranteCard';
import { IMAGEN_POR_DEFECTO } from '@/config/constantes';

const EQUIPO = [
  { nombre: 'Francisca', rol: 'Desarrolladora Frontend', descripcion: 'Especialista en experiencia visual de catálogo y capa de datos.' },
  { nombre: 'Felipe', rol: 'Desarrollador Frontend', descripcion: 'Responsable de autenticación, validación de formularios, roles y panel de administración.' },
  { nombre: 'Jorge', rol: 'Desarrollador Frontend', descripcion: 'Encargado de arquitectura, integración del carrito y flujo de compra.' },
];

const PILARES = [
  {
    titulo: 'Misión',
    texto:
      'Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.',
  },
  {
    titulo: 'Visión',
    texto:
      'Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.',
  },
];

export function NosotrosPage() {
  return (
    <div className="container my-5">
      <section className="row align-items-center mb-5">
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img src={IMAGEN_POR_DEFECTO} alt="Logo Pastelería Mil Sabores" className="img-fluid rounded shadow-sm" style={{ maxHeight: 320 }} />
        </div>
        <div className="col-md-7">
          <h1 className="display-5 fw-bold mb-3">Nuestra Tradición</h1>
          <p className="lead">Pastelería 1000 Sabores celebra su 50 aniversario como un referente indispensable en la repostería chilena.</p>
          <p>
            Famosa por su participación en un récord Guinness en 1995, cuando colaboró en la creación de la torta más
            grande del mundo, la pastelería busca renovar su sistema de ventas online para ofrecer una experiencia de
            compra moderna y accesible para sus clientes.
          </p>
        </div>
      </section>

      <section className="row g-4 mb-5">
        {PILARES.map((pilar) => (
          <div className="col-md-6" key={pilar.titulo}>
            <div className="card h-100 border-0 shadow-sm bg-light">
              <div className="card-body p-4">
                <h2 className="h3 card-title fw-bold text-dark">{pilar.titulo}</h2>
                <p className="card-text text-muted">{pilar.texto}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-5">
        <h2 className="text-center fw-bold mb-4">Equipo de Desarrollo</h2>
        <div className="row g-4 justify-content-center text-center">
          {EQUIPO.map((integrante) => (
            <div className="col-md-4" key={integrante.nombre}>
              <IntegranteCard {...integrante} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
