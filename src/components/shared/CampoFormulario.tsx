import type { ChangeEvent } from 'react';

interface CampoFormularioProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  /** Si existe, el campo se marca inválido y se muestra el mensaje. */
  error?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  /** 'textarea' para comentarios / indicaciones. */
  as?: 'input' | 'textarea';
  filas?: number;
  autoComplete?: string;
  ayuda?: string;
  className?: string;
}

/**
 * Label + input + mensaje de error (patrón repetido ~30 veces en el HTML).
 * CONTROLADO: no guarda su valor; lo recibe por "value" y avisa con "onChange",
 * así el formulario padre tiene todos los valores en un solo objeto.
 */
export function CampoFormulario({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  required = false,
  readOnly = false,
  as = 'input',
  filas = 4,
  autoComplete,
  ayuda,
  className = 'mb-3',
}: CampoFormularioProps) {
  const clases = `form-control ${error ? 'is-invalid' : ''}`;
  const idError = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-danger" aria-hidden="true"> *</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          className={clases}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={filas}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? idError : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          className={clases}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? idError : undefined}
        />
      )}
      {ayuda && !error && <div className="form-text">{ayuda}</div>}
      {error && (
        <div id={idError} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
}
