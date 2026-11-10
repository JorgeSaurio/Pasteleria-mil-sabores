import { useState } from 'react';
import { Alerta } from '@/components/shared/Alerta';
import { Boton } from '@/components/shared/Boton';
import { CampoFormulario } from '@/components/shared/CampoFormulario';
import { CampoSelect } from '@/components/shared/CampoSelect';
import { IMAGEN_POR_DEFECTO } from '@/config/constantes';
import { useFormulario } from '@/hooks/useFormulario';
import type { Categoria, Producto, ResultadoOperacion } from '@/types';
import { requerido, validarEntero, validarSeleccion } from '@/utils/validaciones';

interface FormularioProductoProps {
  /** Si viene, modo edición: el código (clave primaria) queda de solo lectura. */
  productoInicial?: Producto;
  categorias: Categoria[];
  onEnviar: (producto: Producto) => Promise<ResultadoOperacion<Producto>>;
}

type ValoresProducto = {
  id: string;
  nombre: string;
  categoriaId: string;
  precio: string;
  precioOferta: string;
  stock: string;
  stockCritico: string;
  imagen: string;
  descripcion: string;
};

/** Porta la validación de admin-form-productos y agrega el precio de oferta (opcional). */
export function FormularioProducto({ productoInicial, categorias, onEnviar }: FormularioProductoProps) {
  const esEdicion = !!productoInicial;
  const [error, setError] = useState<string | null>(null);

  const { valores, errores, enviando, handleChange, manejarEnvio, aplicarErroresServidor } = useFormulario<ValoresProducto>(
    {
      id: productoInicial?.id ?? '',
      nombre: productoInicial?.nombre ?? '',
      categoriaId: productoInicial?.categoriaId ?? '',
      precio: productoInicial ? String(productoInicial.precio) : '',
      precioOferta: productoInicial?.precioOferta ? String(productoInicial.precioOferta) : '',
      stock: productoInicial ? String(productoInicial.stock) : '',
      stockCritico: productoInicial ? String(productoInicial.stockCritico) : '5',
      imagen: productoInicial && productoInicial.imagen !== IMAGEN_POR_DEFECTO ? productoInicial.imagen : '',
      descripcion: productoInicial?.descripcion ?? '',
    },
    {
      validadores: {
        id: (v) => requerido('El código', 10)(v) ?? (/^[A-Za-z0-9]+$/.test(v.trim()) ? null : 'Solo letras y números.'),
        nombre: requerido('El nombre', 100),
        categoriaId: validarSeleccion('Selecciona una categoría.'),
        precio: validarEntero('El precio', 0),
        precioOferta: (v, todos) => {
          const base = validarEntero('El precio oferta', 1, true)(v);
          if (base || !v.trim()) return base;
          return Number(v) < Number(todos.precio) ? null : 'Debe ser menor que el precio normal.';
        },
        stock: validarEntero('El stock', 0),
        stockCritico: validarEntero('El stock crítico', 1),
        descripcion: requerido('La descripción', 500),
      },
      dependientes: { precio: ['precioOferta'] },
    },
  );

  const enviar = manejarEnvio(async (v) => {
    setError(null);
    const resultado = await onEnviar({
      id: v.id.trim().toUpperCase(),
      nombre: v.nombre.trim(),
      categoriaId: v.categoriaId,
      precio: Number(v.precio),
      precioOferta: v.precioOferta.trim() ? Number(v.precioOferta) : undefined,
      stock: Number(v.stock),
      stockCritico: Number(v.stockCritico),
      imagen: v.imagen.trim() || IMAGEN_POR_DEFECTO,
      descripcion: v.descripcion.trim(),
    });
    if (!resultado.ok) {
      setError(resultado.mensaje);
      aplicarErroresServidor(resultado.errores);
    }
  });

  return (
    <form onSubmit={enviar} noValidate className="card border-0 shadow-sm bg-white p-4">
      <Alerta mensaje={error} onCerrar={() => setError(null)} />
      <div className="row g-3">
        <div className="col-md-4">
          <CampoFormulario id="prod-codigo" name="id" label="Código" value={valores.id} onChange={handleChange} error={errores.id} required readOnly={esEdicion} placeholder="TC003" ayuda={esEdicion ? 'El código no se puede modificar.' : undefined} />
        </div>
        <div className="col-md-8">
          <CampoFormulario id="prod-nombre" name="nombre" label="Nombre" value={valores.nombre} onChange={handleChange} error={errores.nombre} required />
        </div>
        <div className="col-md-6">
          <CampoSelect id="prod-categoria" name="categoriaId" label="Categoría" value={valores.categoriaId} onChange={handleChange} opciones={categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))} placeholder="Selecciona una categoría" error={errores.categoriaId} required />
        </div>
        <div className="col-md-3">
          <CampoFormulario id="prod-precio" name="precio" label="Precio (CLP)" type="number" value={valores.precio} onChange={handleChange} error={errores.precio} required />
        </div>
        <div className="col-md-3">
          <CampoFormulario id="prod-oferta" name="precioOferta" label="Precio oferta" type="number" value={valores.precioOferta} onChange={handleChange} error={errores.precioOferta} ayuda="Opcional" />
        </div>
        <div className="col-md-3">
          <CampoFormulario id="prod-stock" name="stock" label="Stock" type="number" value={valores.stock} onChange={handleChange} error={errores.stock} required />
        </div>
        <div className="col-md-3">
          <CampoFormulario id="prod-critico" name="stockCritico" label="Stock crítico" type="number" value={valores.stockCritico} onChange={handleChange} error={errores.stockCritico} required />
        </div>
        <div className="col-md-6">
          <CampoFormulario id="prod-imagen" name="imagen" label="URL de imagen" type="url" value={valores.imagen} onChange={handleChange} ayuda="Opcional: si se deja vacío se usa el logo." />
        </div>
        <div className="col-12">
          <CampoFormulario id="prod-descripcion" name="descripcion" label="Descripción" as="textarea" filas={3} value={valores.descripcion} onChange={handleChange} error={errores.descripcion} required />
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <Boton tipo="submit" variante="dark" cargando={enviando}>
          {esEdicion ? 'Actualizar cambios' : 'Guardar producto'}
        </Boton>
      </div>
    </form>
  );
}
