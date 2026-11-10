import { useState, type CSSProperties } from 'react';
import { IMAGEN_POR_DEFECTO } from '@/config/constantes';

interface ImagenConRespaldoProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
}

export function ImagenConRespaldo({ src, alt, className, style, loading = 'lazy' }: ImagenConRespaldoProps) {
  // Evita un bucle si el respaldo también falla.
  const [fallo, setFallo] = useState(false);
  return (
    <img
      src={fallo || !src ? IMAGEN_POR_DEFECTO : src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() => setFallo(true)}
    />
  );
}
