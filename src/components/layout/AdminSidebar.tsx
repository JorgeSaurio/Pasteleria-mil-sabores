import { NavLink } from 'react-router-dom';
import type { ItemMenuAdmin } from '@/config/menuAdmin';

interface AdminSidebarProps {
  items: ItemMenuAdmin[];
  rol: string;
  onNavegar?: () => void;
}

export function AdminSidebar({ items, rol, onNavegar }: AdminSidebarProps) {
  return (
    <div className="card border-0 shadow-sm p-3 bg-white h-100">
      <h2 className="text-uppercase text-muted fw-bold small mb-3">Navegación admin</h2>
      <nav className="nav flex-column nav-pills gap-1">
        {items.map((item) => (
          <NavLink
            key={item.ruta}
            to={item.ruta}
            end
            onClick={onNavegar}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active bg-dark text-white fw-semibold' : 'text-dark'}`
            }
          >
            {item.titulo}
          </NavLink>
        ))}
      </nav>
      <hr className="my-4" />
      <div className="small text-muted">
        <p className="mb-1">
          <strong>Rol actual:</strong>
        </p>
        <span className="badge bg-success">{rol}</span>
      </div>
    </div>
  );
}
