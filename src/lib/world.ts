// Geodata pro mapu cest. Počítá se jednou při buildu, do prohlížeče nejde nic z toho.
import { feature } from 'topojson-client';
import { presimplify, simplify, quantile } from 'topojson-simplify';
import countries from 'i18n-iso-countries';
import cs from 'i18n-iso-countries/langs/cs.json';
import world from 'world-atlas/countries-50m.json';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, Geometry } from 'geojson';

countries.registerLocale(cs);

type Props = { name: string };
type WorldTopology = Topology<{ countries: GeometryCollection<Props> }>;

// Podrobná data (1:50 mil.) zjednodušená na ~20 % bodů: Evropa po přiblížení nevypadá kostrbatě
// a stránka pořád váží rozumně. Sdílené hranice zůstávají napojené.
const SIMPLIFY_QUANTILE = 0.2;

const topo = presimplify(structuredClone(world) as unknown as WorldTopology) as WorldTopology;
const simplified = simplify(topo, quantile(topo, SIMPLIFY_QUANTILE)) as WorldTopology;

export const countryFeatures = (
  feature(simplified, simplified.objects.countries) as unknown as {
    features: Feature<Geometry, Props>[];
  }
).features.filter((f) => f.properties.name !== 'Antarctica');

// Kratší a běžnější české názvy než oficiální
const NAME_OVERRIDES: Record<string, string> = {
  CZ: 'Česko',
  US: 'Spojené státy',
  GB: 'Velká Británie',
  CD: 'DR Kongo',
  CG: 'Kongo',
  CF: 'Středoafrická republika',
  PS: 'Palestina',
  KR: 'Jižní Korea',
  KP: 'Severní Korea',
};

// Území bez ISO kódu v datech
const UNCODED: Record<string, { code: string | null; name: string }> = {
  Kosovo: { code: 'XK', name: 'Kosovo' },
  'N. Cyprus': { code: null, name: 'Severní Kypr' },
  Somaliland: { code: null, name: 'Somaliland' },
  'Indian Ocean Ter.': { code: null, name: 'Australská území v Indickém oceánu' },
  'Siachen Glacier': { code: null, name: 'Ledovec Siačen' },
};

export function nameForCode(code: string): string {
  const upper = code.toUpperCase();
  return NAME_OVERRIDES[upper] ?? countries.getName(upper, 'cs') ?? upper;
}

export function countryInfo(f: Feature<Geometry, Props>): { code: string | null; name: string } {
  const id = f.id != null ? String(f.id) : '';
  const code = id ? countries.numericToAlpha2(id) : undefined;
  if (code) return { code, name: nameForCode(code) };
  return UNCODED[f.properties.name] ?? { code: null, name: f.properties.name };
}
