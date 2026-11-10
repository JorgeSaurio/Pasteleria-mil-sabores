import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ICONOS } from '@/config/constantes';
import { useAuth } from '@/hooks/useAuth';
import { useCarrito } from '@/hooks/useCarrito';

const ENLACES = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blog', texto: 'Blog' },
  { ruta: '/contacto', texto: 'Contacto' },
];

export function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { totalItems } = useCarrito();
  const { usuario, tieneRol, cerrarSesion } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setAbierto(false);
  }, [location.pathname]);

  const salir = async () => {
    await cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Mil Sabores
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbar-principal"
          aria-expanded={abierto}
          aria-label="Mostrar navegación"
          onClick={() => setAbierto((valor) => !valor)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${abierto ? 'show' : ''}`} id="navbar-principal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {ENLACES.map((enlace) => (
              <li className="nav-item" key={enlace.ruta}>
                <NavLink className="nav-link" to={enlace.ruta} end={enlace.ruta === '/'}>
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
          </ul>

          <ul className="navbar-nav align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito">
                <img src={ICONOS.carrito} alt="" width={28} height={28} className="navbar-icon" /> Carrito
                {totalItems > 0 && (
                  <span className="ms-carrito-contador" aria-label={`${totalItems} productos en el carrito`}>
                    {totalItems}
                  </span>
                )}
              </NavLink>
            </li>

            {usuario ? (
              <>
                {tieneRol('Administrador', 'Vendedor') && (
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/admin">
                      Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link disabled text-dark">Hola, {usuario.nombre}</span>
                </li>
                <li className="nav-item">
                  <button type="button" className="btn btn-sm btn-outline-dark" onClick={salir}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    <img src={ICONOS.usuario} alt="" width={28} height={28} className="navbar-icon" /> Iniciar sesión
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-sm btn-dark" to="/registro">
                    Crear cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
