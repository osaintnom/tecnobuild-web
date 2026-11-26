// Catálogo real, generado desde el maestro de modelos con `npm run sync:catalogo` (scripts/sync-catalogo.mjs).
// catalogo.json tiene el índice de familias; los modelos de cada familia están en
// public/catalogo/modelos/<FAMILIA>.json y se cargan al abrir el configurador.
import data from './catalogo.json';

export type AmbId = 'balcon' | 'cocina' | 'bano' | 'vestidor';

export interface Familia {
  codigo: string;
  ambiente: AmbId;
  rubro: string;
  categoria: string;
  linea?: string;
  nombre: string;
  subtitulo?: string;
  descripcion?: string;
  modelos: number;
  colores: string[];
  materiales: string[];
  muebles: number[];
  foto?: string;
}

export interface Modelo {
  codigo: string;
  base: string;
  medida?: string;
  dim?: (number | null)[];
  modelo?: string;
  niveles?: number;
  variante?: string;
  color?: string;
  detalle?: string;
  materiales?: string;
}

export interface Ambiente { id: AmbId; nombre: string; corto: string; lugar: string }

/** Ambientes del edificio, de abajo hacia arriba. */
export const AMBIENTES: Ambiente[] = [
  { id: 'balcon', nombre: 'Balcones y escaleras', corto: 'Balcones', lugar: 'Hall, escalera y balcones' },
  { id: 'cocina', nombre: 'Cocinas', corto: 'Cocinas', lugar: 'Cocina y lavadero de cada unidad' },
  { id: 'bano', nombre: 'Baños', corto: 'Baños', lugar: 'Baño de cada unidad' },
  { id: 'vestidor', nombre: 'Vestidores', corto: 'Vestidores', lugar: 'Dormitorios' },
];
export const ambById = Object.fromEntries(AMBIENTES.map((a) => [a.id, a])) as Record<AmbId, Ambiente>;

export const CATALOGO = data as { generado: string; prueba: boolean; familias: Familia[] };
export const FAMILIAS = CATALOGO.familias;
export const famById: Record<string, Familia> = Object.fromEntries(FAMILIAS.map((f) => [f.codigo, f]));
export const RUBROS = [...new Set(FAMILIAS.map((f) => f.rubro))];

/** Muestra de color aproximada hasta que el maestro tenga su hoja Colores. */
export const COLOR_HEX: Record<string, string> = {
  'Blanco nube': '#ECEBE7', 'Gris nube': '#A7AAAC', 'Gris claro': '#C9CACB', 'Gris': '#9A9B9C', 'Gris oscuro': '#6B6C6E',
  'Gris grafito': '#48494B', 'Negro': '#232323', 'Naranja': '#D9772E', 'Verde Moran': '#7E8C6A', 'Verde': '#6E8B5A',
  'Café claro': '#B08B66', 'Cromado': '#C8CBCF', 'Nano plata': '#B5B8BB',
};

/** Dibujo de vista previa para cada categoría (ver lib/preview.ts). */
export type Dibujo =
  | 'sink-drain' | 'sink' | 'sink2' | 'sink-round' | 'counter' | 'basin' | 'laundry' | 'faucet' | 'faucet-b' | 'strainer'
  | 'column' | 'panel' | 'rack' | 'basket' | 'corner' | 'liftup' | 'bin' | 'door-basket' | 'wardrobe'
  | 'rail-glass' | 'post' | 'handrail' | 'rail-cable' | 'rail-bars' | 'canopy' | 'wood' | 'stair'
  | 'screen' | 'hinge' | 'slider';

const DIBUJO_POR_CATEGORIA: Record<string, Dibujo> = {
  'Bachas con escurridor': 'sink-drain', 'Bachas sin escurridor': 'sink', 'Bachas de esquinas rectas y bajo mesada': 'sink',
  'Bachas hechas a mano': 'sink', 'Bachas redondas': 'sink-round', 'Mesadas de acero': 'counter', 'Bachas de baño': 'basin',
  'Lavadero': 'laundry', 'Grifería de cocina': 'faucet', 'Grifería de baño': 'faucet-b', 'Accesorios de bacha': 'strainer',
  'Despenseros': 'column', 'Columnas y laterales extraíbles': 'column', 'Paneles perforados extraíbles': 'panel', 'Especieros': 'rack',
  'Canastos bajo mesada': 'basket', 'Esquineros': 'corner', 'Alacenas': 'liftup', 'Cestos de residuos': 'bin',
  'Canastos de puerta': 'door-basket', 'Vestidor': 'wardrobe',
  'Barandas de vidrio': 'rail-glass', 'Postes de baranda': 'post', 'Pasamanos y accesorios': 'handrail', 'Barandas de cable': 'rail-cable',
  'Rellenos y barandas de aluminio': 'rail-bars', 'Fachadas y aleros de vidrio': 'canopy', 'Madera y materia prima': 'wood', 'Escaleras': 'stair',
  'Mamparas de baño': 'screen', 'Herrajes de mampara': 'hinge', 'Herrajes de puertas de vidrio y corredizas': 'slider',
};

export function dibujoDe(f: Familia): Dibujo {
  const d = DIBUJO_POR_CATEGORIA[f.categoria] ?? 'panel';
  return d === 'sink' && /doble/i.test(f.nombre) ? 'sink2' : d;
}

/** URL de un archivo de /public, con el prefijo de GitHub Pages si corresponde. */
export const publicUrl = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${p}`;

const cache = new Map<string, Promise<Modelo[]>>();
/** Modelos de una familia (se piden una sola vez). */
export function cargarModelos(fam: string): Promise<Modelo[]> {
  if (!cache.has(fam)) {
    cache.set(fam, fetch(publicUrl(`/catalogo/modelos/${fam}.json`)).then((r) => {
      if (!r.ok) throw new Error(`No se pudieron cargar los modelos de ${fam}`);
      return r.json();
    }).catch((e) => { cache.delete(fam); throw e; }));
  }
  return cache.get(fam)!;
}

/**
 * Descripción corta de un modelo elegido, por ejemplo "Mueble 300 mm · 4 niveles · Gris nube".
 * `levels` y `color` permiten armarla en otro idioma (ver src/i18n).
 */
export function describir(m: Modelo, levels = (n: number) => `${n} niveles`, color = (c: string) => c): string {
  return [m.medida, m.modelo, m.niveles ? levels(m.niveles) : undefined, m.variante, m.color ? color(m.color) : undefined].filter(Boolean).join(' · ');
}
