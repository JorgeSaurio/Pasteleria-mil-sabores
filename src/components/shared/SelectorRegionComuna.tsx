import { REGIONES, REGIONES_COMUNAS } from '@/data/regionesComunas';
import { CampoSelect } from './CampoSelect';

interface SelectorRegionComunaProps {
  region: string;
  comuna: string;
  onChange: (region: string, comuna: string) => void;
  errores?: { region?: string; comuna?: string };
  idPrefijo?: string;
  deshabilitado?: boolean;
}

const OPCIONES_REGION = REGIONES.map((r) => ({ valor: r, etiqueta: r }));

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
