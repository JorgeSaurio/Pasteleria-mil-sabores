import { REGIONES, REGIONES_COMUNAS } from '@/data/regionesComunas';
import { CampoSelect } from './CampoSelect';

interface SelectorRegionComunaProps {
  region: string;
  comuna: string;
  /** Un solo callback con ambos valores: son datos acoplados. */
  onChange: (region: string, comuna: string) => void;
  errores?: { region?: string; comuna?: string };
  /** Prefijo de ids para poder usar dos selectores en la misma página. */
  idPrefijo?: string;
  deshabilitado?: boolean;
}

const OPCIONES_REGION = REGIONES.map((r) => ({ valor: r, etiqueta: r }));

/**
 * Porta js/region-comuna.js. Usado en Registro, Usuario admin, Perfil y Checkout.
 * Las comunas se DERIVAN de la región (no son estado). Al cambiar la región,
 * se emite comuna = '' para no dejar una comuna que pertenece a otra región.
 */
export function SelectorRegionComuna({
  region,
  comuna,
  onChange,
  errores = {},
  idPrefijo = 'ubicacion',
  deshabilitado = false,
}: SelectorRegionComunaProps) {
  const comunas = (REGIONES_COMUNAS[region] ?? []).map((c) => ({ valor: c, etiqueta: c }));

  return (
    <div className="row g-3 mb-3">
      <div className="col-md-6">
        <CampoSelect
          id={`${idPrefijo}-region`}
          name="region"
          label="Región"
          value={region}
          opciones={OPCIONES_REGION}
          placeholder="Selecciona una región"
          onChange={(e) => onChange(e.target.value, '')}
          error={errores.region}
          required
          disabled={deshabilitado}
          className=""
        />
      </div>
      <div className="col-md-6">
        <CampoSelect
          id={`${idPrefijo}-comuna`}
          name="comuna"
          label="Comuna"
          value={comuna}
          opciones={comunas}
          placeholder={region ? 'Selecciona una comuna' : 'Primero elige una región'}
          onChange={(e) => onChange(region, e.target.value)}
          error={errores.comuna}
          required
          disabled={deshabilitado || !region}
          className=""
        />
      </div>
    </div>
  );
}
