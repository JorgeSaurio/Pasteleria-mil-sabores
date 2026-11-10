import { formatearMoneda } from '@/utils/formato';
import { ImagenConRespaldo } from './ImagenConRespaldo';

export interface ItemResumen {
  id: string;
  nombre: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
}

interface TablaResumenItemsProps {
  items: ItemResumen[];
}

export function TablaResumenItems({ items }: TablaResumenItemsProps) {
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col" className="text-end">Precio</th>
            <th scope="col" className="text-center">Cantidad</th>
            <th scope="col" className="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={{ width: 70 }}>
                <ImagenConRespaldo
                  src={item.imagen}
                  alt={item.nombre}
                  className="rounded border"
                  style={{ width: 48, height: 48, objectFit: 'cover' }}
                />
              </td>
              <td>{item.nombre}</td>
              <td className="text-end">{formatearMoneda(item.precioUnitario)}</td>
              <td className="text-center">{item.cantidad}</td>
              <td className="text-end fw-semibold">{formatearMoneda(item.precioUnitario * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
