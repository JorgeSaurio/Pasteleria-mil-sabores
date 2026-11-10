import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';

type ValoresFormulario = Record<string, string>;

/** Un validador recibe el valor del campo y TODOS los valores (para confirmaciones). */
export type ValidadorCampo<T extends ValoresFormulario> = (valor: string, valores: T) => string | null;

export type Validadores<T extends ValoresFormulario> = Partial<Record<keyof T, ValidadorCampo<T>>>;

export type ErroresFormulario<T extends ValoresFormulario> = Partial<Record<keyof T, string>>;

interface OpcionesFormulario<T extends ValoresFormulario> {
  validadores?: Validadores<T>;
  /** Campos que se revalidan cuando cambia otro: { email: ['email2'] }. */
  dependientes?: Partial<Record<keyof T, (keyof T)[]>>;
}

/**
 * Formulario controlado genérico. Reemplaza el switch gigante de validaciones.js.
 * - Todos los valores son string (como en el DOM); se convierten a número al enviar.
 * - Valida en vivo al escribir y todo junto al enviar.
 * - setErrores permite volcar errores por campo que devuelva el backend.
 */
export function useFormulario<T extends ValoresFormulario>(
  valoresIniciales: T,
  { validadores = {}, dependientes = {} }: OpcionesFormulario<T> = {},
) {
  const [valores, setValoresEstado] = useState<T>(valoresIniciales);
  const [errores, setErrores] = useState<ErroresFormulario<T>>({});
  const [enviando, setEnviando] = useState(false);

  const validarCampo = useCallback(
    (campo: keyof T, todos: T): string | null => validadores[campo]?.(todos[campo] ?? '', todos) ?? null,
    [validadores],
  );

  /** Actualiza uno o varios campos a la vez y revalida esos campos y sus dependientes. */
  const setVarios = useCallback(
    (parcial: Partial<T>) => {
      const nuevos = { ...valores, ...parcial };
      const cambiados = Object.keys(parcial) as (keyof T)[];
      const aRevalidar = new Set<keyof T>(cambiados);
      cambiados.forEach((c) => (dependientes[c] ?? []).forEach((d) => aRevalidar.add(d)));

      setValoresEstado(nuevos);
      setErrores((erroresPrevios) => {
        const siguiente = { ...erroresPrevios };
        aRevalidar.forEach((c) => {
          // Un campo dependiente vacío no se marca hasta que el usuario lo toque.
          if (!cambiados.includes(c) && !nuevos[c]) return;
          const error = validarCampo(c, nuevos);
          if (error) siguiente[c] = error;
          else delete siguiente[c];
        });
        return siguiente;
      });
    },
    [valores, dependientes, validarCampo],
  );

  const setValor = useCallback(
    (campo: keyof T, valor: string) => setVarios({ [campo]: valor } as Partial<T>),
    [setVarios],
  );

  const handleChange = useCallback(
    (evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValor(evento.target.name as keyof T, evento.target.value);
    },
    [setValor],
  );

  /** Valida todos los campos con validador. Devuelve true si no hay errores. */
  const validarTodo = useCallback((): boolean => {
    const nuevos: ErroresFormulario<T> = {};
    (Object.keys(validadores) as (keyof T)[]).forEach((campo) => {
      const error = validarCampo(campo, valores);
      if (error) nuevos[campo] = error;
    });
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }, [validadores, validarCampo, valores]);

  /**
   * Crea el handler de onSubmit: previene el envío nativo, valida y ejecuta "accion"
   * marcando "enviando" mientras la promesa no resuelve (evita doble envío).
   */
  const manejarEnvio = useCallback(
    (accion: (valores: T) => Promise<void> | void) => async (evento: FormEvent<HTMLFormElement>) => {
      evento.preventDefault();
      if (enviando || !validarTodo()) return;
      setEnviando(true);
      try {
        await accion(valores);
      } finally {
        setEnviando(false);
      }
    },
    [enviando, validarTodo, valores],
  );

  const reset = useCallback((nuevos?: T) => {
    setValoresEstado(nuevos ?? valoresIniciales);
    setErrores({});
    // valoresIniciales se toma del primer render a propósito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Convierte errores {campo: msg} del backend al formato del formulario. */
  const aplicarErroresServidor = useCallback((erroresServidor?: Record<string, string>) => {
    if (erroresServidor) setErrores((previos) => ({ ...previos, ...(erroresServidor as ErroresFormulario<T>) }));
  }, []);

  return {
    valores,
    errores,
    enviando,
    handleChange,
    setValor,
    setVarios,
    setErrores,
    aplicarErroresServidor,
    validarTodo,
    manejarEnvio,
    reset,
  };
}
