import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';

type ValoresFormulario = Record<string, string>;

export type ValidadorCampo<T extends ValoresFormulario> = (valor: string, valores: T) => string | null;

export type Validadores<T extends ValoresFormulario> = Partial<Record<keyof T, ValidadorCampo<T>>>;

export type ErroresFormulario<T extends ValoresFormulario> = Partial<Record<keyof T, string>>;

interface OpcionesFormulario<T extends ValoresFormulario> {
  validadores?: Validadores<T>;
  dependientes?: Partial<Record<keyof T, (keyof T)[]>>;
}

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

  const validarTodo = useCallback((): boolean => {
    const nuevos: ErroresFormulario<T> = {};
    (Object.keys(validadores) as (keyof T)[]).forEach((campo) => {
      const error = validarCampo(campo, valores);
      if (error) nuevos[campo] = error;
    });
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }, [validadores, validarCampo, valores]);

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
    // Usa solo los valores del primer render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
