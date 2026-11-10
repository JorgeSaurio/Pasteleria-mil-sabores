import { EstadoVacio } from '@/components/shared/EstadoVacio';

interface NoEncontradoPageProps {
  titulo?: string;
  mensaje?: string;
}

export function NoEncontradoPage({
  titulo = 'Página no encontrada',
  mensaje = 'La página que buscas no existe o fue movida.',
}: NoEncontradoPageProps) {
  return (
    <div className="container my-5">
      <EstadoVacio titulo={titulo} mensaje={mensaje} accion={{ texto: 'Volver al inicio', ruta: '/' }} />
    </div>
  );
}
