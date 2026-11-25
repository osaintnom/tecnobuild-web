// Genera el catálogo público a partir del maestro de modelos.
//
//   npm run sync:catalogo -- data/TB-modelos-MAESTRO.xlsx
//
// El maestro tiene columnas internas (proveedor, código del proveedor, costo, precio) y el repo es
// público: por eso solo se copian las columnas de PUBLIC_* y nunca el archivo original.
// Salidas:
//   src/content/catalogo.json          índice de familias (va dentro de la página)
//   public/catalogo/modelos/<FAM>.json modelos de cada familia (se cargan al abrir el configurador)
import ExcelJS from 'exceljs';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = resolve(process.argv[2] ?? 'data/TB-modelos-MAESTRO.xlsx');
const OUT_INDEX = resolve('src/content/catalogo.json');
const OUT_MODELS = resolve('public/catalogo/modelos');
// Fotos opcionales: public/catalogo/fotos/<FAMILIA>/principal.(webp|jpg|png). Sin foto, la página muestra el dibujo.
const PHOTOS = resolve('public/catalogo/fotos');

// Columnas que se pueden publicar. Cualquier otra columna del maestro se ignora.
const PUBLIC_FAMILY = ['Código TB', 'Rubro', 'Categoría', 'Línea', 'Nombre', 'Subtítulo', 'Descripción', 'Activa', 'Ambiente', 'Orden', 'Publicar en web'];
const PUBLIC_MODEL = ['Código TB', 'Código base', 'Familia', 'Mueble (mm)', 'Medida / modelo', 'Niveles', 'Variante', 'Color',
  'Ancho (mm)', 'Prof. (mm)', 'Alto (mm)', 'Medida (texto)', 'Detalle', 'Materiales', 'Activo'];

// Ambiente del edificio según la línea (si el maestro suma una columna "Ambiente", manda esa).
const AMBIENTE_POR_LINEA = {
  'Cocina': 'cocina', 'Lavadero': 'cocina', 'Cocina y vestidor': 'cocina',
  'Baño': 'bano',
  'Vestidor': 'vestidor',
  'Barandas': 'balcon', 'Escaleras': 'balcon', 'Vidrio estructural': 'balcon', 'Puertas': 'balcon',
};
const AMBIENTE_POR_NOMBRE = { 'cocinas': 'cocina', 'cocina': 'cocina', 'baños': 'bano', 'baño': 'bano', 'vestidores': 'vestidor', 'vestidor': 'vestidor', 'balcones y escaleras': 'balcon', 'balcón': 'balcon', 'escaleras': 'balcon' };

const clean = (v) => {
  if (v == null) return undefined;
  if (typeof v === 'object' && 'result' in v) v = v.result;           // fórmulas
  if (typeof v === 'object' && 'richText' in v) v = v.richText.map((t) => t.text).join('');
  const s = String(v).trim();
  return s === '' ? undefined : s;
};
const yes = (v) => !v || /^s[ií]/i.test(v);
const num = (v) => (v != null && !Number.isNaN(Number(v)) ? Number(v) : undefined);

function readSheet(wb, name, allowed) {
  const ws = wb.getWorksheet(name);
  if (!ws) throw new Error(`El maestro no tiene la hoja "${name}"`);
  const header = ws.getRow(1).values.map(clean);
  const rows = [];
  ws.eachRow((row, i) => {
    if (i === 1) return;
    const o = {};
    header.forEach((h, c) => { if (h && allowed.includes(h)) { const v = clean(row.getCell(c).value); if (v !== undefined) o[h] = v; } });
    if (o['Código TB']) rows.push(o);
  });
  return rows;
}

function foto(fam) {
  const dir = `${PHOTOS}/${fam}`;
  if (!existsSync(dir)) return undefined;
  const f = readdirSync(dir).find((n) => /^principal\.(webp|jpe?g|png|avif)$/i.test(n));
  return f ? `/catalogo/fotos/${fam}/${f}` : undefined;
}

const x = (s) => s.replace(/(\d)\s*[xX]\s*(\d)/g, '$1×$2');

/** Etiqueta corta y legible de la medida de un modelo. */
function medida(m) {
  if (m['Medida (texto)']) return x(m['Medida (texto)']);
  if (m['Mueble (mm)']) return `Mueble ${m['Mueble (mm)']} mm`;
  if (m['Medida / modelo']) return x(m['Medida / modelo']);
  const d = [m['Ancho (mm)'], m['Prof. (mm)'], m['Alto (mm)']].filter(Boolean);
  return d.length ? `${d.join('×')} mm` : undefined;
}

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(src);
const familias = readSheet(wb, 'Familias', PUBLIC_FAMILY);
const modelos = readSheet(wb, 'Modelos', PUBLIC_MODEL);

rmSync(OUT_MODELS, { recursive: true, force: true });
mkdirSync(OUT_MODELS, { recursive: true });

const index = [];
const sinAmbiente = new Set();
for (const f of familias) {
  if (!yes(f['Activa']) || !yes(f['Publicar en web'])) continue;
  const amb = AMBIENTE_POR_NOMBRE[(f['Ambiente'] ?? '').toLowerCase()] ?? AMBIENTE_POR_LINEA[f['Línea']];
  if (!amb) { sinAmbiente.add(f['Línea'] ?? '(sin línea)'); continue; }
  const ms = modelos.filter((m) => m['Familia'] === f['Código TB'] && yes(m['Activo'])).map((m) => ({
    codigo: m['Código TB'],
    base: m['Código base'] ?? m['Código TB'],
    medida: medida(m),
    dim: [num(m['Ancho (mm)']), num(m['Prof. (mm)']), num(m['Alto (mm)'])].some(Boolean)
      ? [num(m['Ancho (mm)']) ?? null, num(m['Prof. (mm)']) ?? null, num(m['Alto (mm)']) ?? null] : undefined,
    modelo: m['Mueble (mm)'] && m['Medida / modelo'] ? x(m['Medida / modelo']) : undefined,
    niveles: num(m['Niveles']),
    variante: m['Variante'],
    color: m['Color'],
    detalle: m['Detalle'],
    materiales: m['Materiales'],
  }));
  if (!ms.length) continue;
  writeFileSync(`${OUT_MODELS}/${f['Código TB']}.json`, JSON.stringify(ms));
  index.push({
    codigo: f['Código TB'],
    ambiente: amb,
    rubro: f['Rubro'],
    categoria: f['Categoría'],
    linea: f['Línea'],
    nombre: f['Nombre'],
    subtitulo: f['Subtítulo'],
    descripcion: f['Descripción'],
    orden: num(f['Orden']),
    modelos: ms.length,
    colores: [...new Set(ms.map((m) => m.color).filter((c) => c && c !== 'A definir'))],
    materiales: [...new Set(ms.map((m) => m.materiales).filter(Boolean))].slice(0, 2),
    // Anchos de mueble (mm) para el filtro del catálogo
    muebles: [...new Set(modelos.filter((m) => m['Familia'] === f['Código TB'] && m['Mueble (mm)']).map((m) => num(m['Mueble (mm)'])))].filter(Boolean).sort((a, b) => a - b),
    foto: foto(f['Código TB']),
  });
}

// Orden: la columna "Orden" del maestro si existe; si no, por categoría (lo más buscado primero)
const CATEGORY_ORDER = ['Bachas con escurridor', 'Bachas sin escurridor', 'Bachas de esquinas rectas y bajo mesada', 'Bachas redondas',
  'Bachas hechas a mano', 'Grifería de cocina', 'Despenseros', 'Columnas y laterales extraíbles', 'Canastos bajo mesada', 'Esquineros',
  'Alacenas', 'Especieros', 'Paneles perforados extraíbles', 'Canastos de puerta', 'Cestos de residuos', 'Mesadas de acero', 'Lavadero',
  'Bachas de baño', 'Grifería de baño', 'Mamparas de baño', 'Herrajes de mampara', 'Vestidor', 'Barandas de vidrio', 'Barandas de cable',
  'Rellenos y barandas de aluminio', 'Postes de baranda', 'Pasamanos y accesorios', 'Escaleras', 'Fachadas y aleros de vidrio',
  'Herrajes de puertas de vidrio y corredizas', 'Madera y materia prima', 'Accesorios de bacha'];
const rank = (c) => { const i = CATEGORY_ORDER.indexOf(c); return i < 0 ? CATEGORY_ORDER.length - 1 : i; };
index.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || rank(a.categoria) - rank(b.categoria) || a.codigo.localeCompare(b.codigo));
writeFileSync(OUT_INDEX, JSON.stringify({
  generado: new Date().toISOString().slice(0, 10),
  // Mientras el maestro no esté confirmado, la página lo indica.
  prueba: true,
  familias: index,
}, null, 1));

const total = index.reduce((n, f) => n + f.modelos, 0);
console.log(`Catálogo: ${index.length} familias, ${total} modelos → ${OUT_INDEX}`);
if (sinAmbiente.size) console.warn(`Sin ambiente (no se publican): ${[...sinAmbiente].join(', ')}`);
