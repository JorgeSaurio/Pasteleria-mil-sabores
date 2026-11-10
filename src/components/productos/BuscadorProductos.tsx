import { useEffect, useState } from 'react';

interface BuscadorProductosProps {
  valorInicial: string;
  /** Se llama ~300 ms después de la última tecla (debounce). */
  onBuscar: (texto: string) => void;
  retardoMs?: number;
}

/**
 * Buscador con debounce. El texto que se escribe es estado LOCAL: así no se lanza
 * una búsqueda (y, con backend, una petición HTTP) por cada letra.
 */
export function BuscadorProductos({ valorInicial, onBuscar, retardoMs = 300 }: BuscadorProductosProps) {
  const [texto, setTexto] = useState(valorInicial);

  // Si la URL cambia desde fuera (ej. botón "atrás"), el input se sincroniza.
  useEffect(() => {
    setTexto(valorInicial);
  }, [valorInicial]);

  useEffect(() => {
    if (texto === valorInicial) return;
    const temporizador = setTimeout(() => onBuscar(texto.trim()), retardoMs);
    return () => clearTimeout(temporizador);
  }, [texto, valorInicial, onBuscar, retardoMs]);

  return (
    <input
      type="search"
      className="form-control shadow-sm"
      placeholder="Buscar productos..."
      aria-label="Buscar productos"
      value={texto}
      onChange={(e) => setTexto(e.target.value)}
    />
  );
}
