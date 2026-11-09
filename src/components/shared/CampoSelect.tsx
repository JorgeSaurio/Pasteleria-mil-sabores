import type { ChangeEvent } from 'react';

export interface OpcionSelect {
  valor: string;
  etiqueta: string;
}

interface CampoSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  opciones: OpcionSelect[];
  onChange: (evento: ChangeEvent<HTMLSelectElement>) => void;
  /** Opción inicial con value="" (ej. "Selecciona una región"). */
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Igual que CampoFormulario pero para <select>. También controlado. */
export function CampoSelect({
  id,
  name,
  label,
  value,
  opciones,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = 'mb-3',
}: CampoSelectProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-danger" aria-hidden="true"> *</span>}
      </label>
      <select
        id={id}
        name={name}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
