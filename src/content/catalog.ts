// Categorías y modelos del configurador.
// Los modelos son de ejemplo: se reemplazan por el catálogo 2026 estructurado
// (categoría, línea, modelo, código, atributos, opciones, muestra e imagen).

export type CatId = 'pisos' | 'puertas' | 'cocinas' | 'banos';

export interface Category {
  id: CatId;
  nivel: number;
  lugar: string;
  nombre: string;
  corto: string;
  frase: string;
}

export interface ColorOpt { v: string; hex: string }
export type Opt = string | ColorOpt;

export interface Attr {
  id: string;
  label: string;
  color?: boolean;
  opts: Opt[];
}

// Tipo de dibujo de la vista previa (ver lib/preview.ts).
export type PreviewKind =
  | 'tile' | 'plank' | 'slat' | 'door' | 'door-b' | 'door-v'
  | 'sink' | 'sink2' | 'faucet' | 'faucet-b' | 'vanity' | 'screen';

export interface Model {
  id: string;
  cat: CatId;
  nombre: string;
  codigo: string;
  tipo: PreviewKind;
  attrs: Attr[];
}

export type Cfg = Record<string, string>;

const C = (v: string, hex: string): ColorOpt => ({ v, hex });
const MAD = [C('Blanco', '#ECE8DF'), C('Roble', '#B08A62'), C('Nogal', '#7A5638'), C('Grafito', '#3E3D3B')];
const METAL = [C('Cromo', '#C8CBCF'), C('Acero satinado', '#B3B1AB'), C('Negro mate', '#2A2A2A'), C('Oro cepillado', '#B89B5E')];

export const CATS: Category[] = [
  { id: 'pisos', nivel: 1, lugar: 'Hall y unidades', nombre: 'Pisos y revestimientos', corto: 'Pisos', frase: 'Lo primero que pisa y ve quien entra al edificio: porcelanatos y revestimientos elegidos en fábrica.' },
  { id: 'puertas', nivel: 2, lugar: 'Accesos y unidades', nombre: 'Puertas', corto: 'Puertas', frase: 'Puertas de WPC, un compuesto de madera y polímero pensado para el uso diario y la humedad.' },
  { id: 'cocinas', nivel: 3, lugar: 'Cocina de cada unidad', nombre: 'Cocinas', corto: 'Cocinas', frase: 'Bachas y grifería de cocina para resolver todas las unidades con el mismo estándar.' },
  { id: 'banos', nivel: 4, lugar: 'Baño de cada unidad', nombre: 'Baños', corto: 'Baños', frase: 'Vanitorys, grifería de lavatorio y mamparas: el baño completo, de un solo proveedor.' },
];

const doors: [string, string, string, PreviewKind][] = [
  ['pu-01', 'Puerta WPC lisa', 'PU-01', 'door'],
  ['pu-02', 'Puerta WPC con buñas', 'PU-02', 'door-b'],
  ['pu-03', 'Puerta WPC con visor', 'PU-03', 'door-v'],
];

export const MODELS: Model[] = [
  { id: 'pr-01', cat: 'pisos', nombre: 'Porcelanato símil piedra', codigo: 'PR-01', tipo: 'tile', attrs: [
    { id: 'formato', label: 'Formato (cm)', opts: ['60×60', '60×120', '120×120'] },
    { id: 'color', label: 'Color', color: true, opts: [C('Gris piedra', '#8E8A83'), C('Arena', '#CDBFA8'), C('Grafito', '#4A4845'), C('Marfil', '#E6E0D2')] },
    { id: 'term', label: 'Terminación', opts: ['Mate', 'Satinado'] }] },
  { id: 'pr-02', cat: 'pisos', nombre: 'Porcelanato símil madera', codigo: 'PR-02', tipo: 'plank', attrs: [
    { id: 'formato', label: 'Formato (cm)', opts: ['20×120', '20×180'] },
    { id: 'color', label: 'Color', color: true, opts: [C('Roble claro', '#C9A77C'), C('Nogal', '#7A5638'), C('Gris ceniza', '#A39E95')] },
    { id: 'term', label: 'Terminación', opts: ['Mate', 'Texturado'] }] },
  { id: 'rv-01', cat: 'pisos', nombre: 'Panel de revestimiento WPC', codigo: 'RV-01', tipo: 'slat', attrs: [
    { id: 'color', label: 'Color', color: true, opts: [C('Teca', '#9C6B43'), C('Roble', '#B08A62'), C('Grafito', '#3E3D3B')] },
    { id: 'perfil', label: 'Perfil', opts: ['Ranurado', 'Liso'] }] },
  ...doors.map(([id, nombre, codigo, tipo]): Model => ({ id, cat: 'puertas', nombre, codigo, tipo, attrs: [
    { id: 'medida', label: 'Medida (cm)', opts: ['70×200', '80×200', '90×210'] },
    { id: 'color', label: 'Color', color: true, opts: MAD },
    { id: 'apertura', label: 'Sentido de apertura', opts: ['Derecha', 'Izquierda'] }] })),
  { id: 'ba-01', cat: 'cocinas', nombre: 'Bacha simple de acero', codigo: 'BA-01', tipo: 'sink', attrs: [
    { id: 'medida', label: 'Medida (cm)', opts: ['50×40', '60×45', '70×45'] },
    { id: 'acabado', label: 'Acabado', color: true, opts: [C('Acero satinado', '#B3B1AB'), C('Negro mate', '#2A2A2A'), C('Grafito', '#55524D')] },
    { id: 'inst', label: 'Instalación', opts: ['Sobre mesada', 'Bajo mesada'] }] },
  { id: 'ba-02', cat: 'cocinas', nombre: 'Bacha doble de acero', codigo: 'BA-02', tipo: 'sink2', attrs: [
    { id: 'medida', label: 'Medida (cm)', opts: ['80×45', '86×50'] },
    { id: 'acabado', label: 'Acabado', color: true, opts: [C('Acero satinado', '#B3B1AB'), C('Negro mate', '#2A2A2A'), C('Grafito', '#55524D')] },
    { id: 'inst', label: 'Instalación', opts: ['Sobre mesada', 'Bajo mesada'] }] },
  { id: 'gr-01', cat: 'cocinas', nombre: 'Grifería monocomando de cocina', codigo: 'GR-01', tipo: 'faucet', attrs: [
    { id: 'acabado', label: 'Acabado', color: true, opts: METAL },
    { id: 'pico', label: 'Pico', opts: ['Fijo', 'Extraíble'] }] },
  { id: 'va-01', cat: 'banos', nombre: 'Vanitory suspendido', codigo: 'VA-01', tipo: 'vanity', attrs: [
    { id: 'medida', label: 'Ancho', opts: ['60 cm', '80 cm', '100 cm'] },
    { id: 'color', label: 'Color', color: true, opts: [MAD[0], MAD[1], MAD[3]] }] },
  { id: 'gl-01', cat: 'banos', nombre: 'Grifería de lavatorio', codigo: 'GL-01', tipo: 'faucet-b', attrs: [
    { id: 'acabado', label: 'Acabado', color: true, opts: [METAL[0], METAL[2], METAL[3]] },
    { id: 'altura', label: 'Altura', opts: ['Baja', 'Alta'] }] },
  { id: 'ma-01', cat: 'banos', nombre: 'Mampara de ducha', codigo: 'MA-01', tipo: 'screen', attrs: [
    { id: 'medida', label: 'Ancho', opts: ['80 cm', '100 cm', '120 cm'] },
    { id: 'perfil', label: 'Perfil', color: true, opts: [C('Cromo', '#C8CBCF'), C('Negro mate', '#2A2A2A')] },
    { id: 'vidrio', label: 'Vidrio', opts: ['Transparente', 'Esmerilado'] }] },
];

// Qué muestra cada nivel del corte del edificio (0 = planta baja). Una categoría por piso, de abajo
// hacia arriba en el mismo orden que el scroll. Los productos de tipo piso (tile, plank) se dibujan
// como el solado del nivel; las griferías se montan sobre la bacha o el vanitory del mismo piso.
export interface FloorPlan { nivel: number; cat: CatId; models: string[] }

export const FLOORS: FloorPlan[] = [
  { nivel: 0, cat: 'pisos', models: ['pr-01', 'rv-01'] },
  { nivel: 1, cat: 'pisos', models: ['pr-02'] },
  { nivel: 2, cat: 'puertas', models: ['pu-01', 'pu-02'] },
  { nivel: 3, cat: 'puertas', models: ['pu-03'] },
  { nivel: 4, cat: 'cocinas', models: ['ba-01', 'gr-01'] },
  { nivel: 5, cat: 'cocinas', models: ['ba-02'] },
  { nivel: 6, cat: 'banos', models: ['va-01', 'gl-01'] },
  { nivel: 7, cat: 'banos', models: ['ma-01'] },
];

export const floorName = (n: number) => (n === 0 ? 'PB' : `P${n}`);

export const modelById: Record<string, Model> = Object.fromEntries(MODELS.map((m) => [m.id, m]));
export const catById = Object.fromEntries(CATS.map((c) => [c.id, c])) as Record<CatId, Category>;

export const optValue = (o: Opt) => (typeof o === 'string' ? o : o.v);
export const defaults = (m: Model): Cfg => Object.fromEntries(m.attrs.map((a) => [a.id, optValue(a.opts[0])]));
export const cfgText = (m: Model, cfg: Cfg) => m.attrs.map((a) => cfg[a.id]).join(' · ');
