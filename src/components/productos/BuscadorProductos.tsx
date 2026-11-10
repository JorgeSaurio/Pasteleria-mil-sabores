import { useEffect, useState } from 'react';

interface BuscadorProductosProps {
  valorInicial: string;
  onBuscar: (texto: string) => void;
  retardoMs?: number;
}

export function BuscadorProductos({ valorInicial, onBuscar, retardoMs = 300 }: BuscadorProductosProps) {
  const [texto, setTexto] = useState(valorInicial);

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
