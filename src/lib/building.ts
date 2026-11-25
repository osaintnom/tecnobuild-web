// Corte técnico del edificio: planta baja + 7 pisos + azotea, organizado por ambientes.
// Cada elemento del corte es una CATEGORÍA del catálogo real (grupo .hs con data-catg); tocarlo filtra
// el catálogo. Los rótulos (.lbl) y las llaves por ambiente (.brk) se encienden con el ambiente activo.
import { AMBIENTES, type AmbId } from '@/content/catalog';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const R = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const L = (a: number, b: number, c: number, d: number) => `M${a} ${b}L${c} ${d}`;
const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const P = (d: string, cls = '') => `<path d="${d}"${cls ? ` class="${cls}"` : ''}/>`;
const G = (ds: string[], cls: string) => `<g class="${cls}">${ds.map((d) => P(d)).join('')}</g>`;

const W0 = 52, W1 = 568, IN0 = 60, IN1 = 560;
const level = (n: number) => (n === 0 ? { fl: 930, ce: 828 } : { fl: 820 - 92 * (n - 1), ce: 820 - 92 * (n - 1) - 84 });
export const floorName = (n: number) => (n === 0 ? 'PB' : `P${n}`);

/** Qué ambiente ocupa cada nivel (0 = planta baja), de abajo hacia arriba. */
export const FLOORS: { nivel: number; amb: AmbId }[] = [
  { nivel: 0, amb: 'balcon' }, { nivel: 1, amb: 'balcon' },
  { nivel: 2, amb: 'cocina' }, { nivel: 3, amb: 'cocina' }, { nivel: 4, amb: 'cocina' },
  { nivel: 5, amb: 'bano' }, { nivel: 6, amb: 'bano' },
  { nivel: 7, amb: 'vestidor' },
];

/** Nombre corto para el rótulo del corte. */
const CORTO: Record<string, string> = {
  'Herrajes de puertas de vidrio y corredizas': 'Puertas de vidrio', 'Fachadas y aleros de vidrio': 'Aleros de vidrio',
  'Pasamanos y accesorios': 'Pasamanos', 'Madera y materia prima': 'Deck de madera', 'Rellenos y barandas de aluminio': 'Barandas de aluminio',
  'Columnas y laterales extraíbles': 'Columnas extraíbles', 'Paneles perforados extraíbles': 'Paneles perforados', 'Bachas con escurridor': 'Bacha con escurridor',
  'Canastos bajo mesada': 'Canastos bajo mesada', 'Cestos de residuos': 'Cestos de residuos', 'Mesadas de acero': 'Mesada de acero',
};

type Part = [string, string?]; // [d, clase: 'f' tapa lo de atrás, 'g' vidrio]
interface Spot { catg: string; parts: Part[]; hit: number[]; label?: [number, number] }

const labeled = new Set<string>();
function spot(amb: AmbId, s: Spot) {
  const body = s.parts.map(([d, c]) => P(d, c)).join('');
  const g = `<g class="hs c-${amb}" data-catg="${esc(s.catg)}"><title>${esc(s.catg)}</title>${body}${P(R(s.hit[0], s.hit[1], s.hit[2], s.hit[3]), 'hit')}</g>`;
  // Cada categoría lleva rótulo una sola vez (la primera vez que aparece)
  let lbl = '';
  if (s.label && !labeled.has(s.catg)) {
    labeled.add(s.catg);
    // Línea guía punteada del rótulo al borde superior del elemento
    const [lx, ly] = s.label, tx = s.hit[0] + s.hit[2] / 2, ty = s.hit[1];
    const lead = ty > ly + 6 ? `<path class="lead" d="M${lx + 2} ${ly + 4}L${tx} ${ty}"/>` : '';
    lbl = `<g class="lbl" data-cat="${amb}" data-catg="${esc(s.catg)}">${lead}<text class="cn" x="${lx}" y="${ly}">${esc(CORTO[s.catg] ?? s.catg)}</text></g>`;
  }
  return { g, lbl };
}

/** Canasto de alambre de frente. */
const wire = (x: number, y: number, w: number, h: number): Part[] => {
  const p: Part[] = [[R(x, y, w, h), 'f']];
  for (let xi = x + 6; xi < x + w - 2; xi += 6) p.push([L(xi, y + 2, xi, y + h - 2)]);
  return p;
};

// ---------- Contenido de cada piso ----------
function floorSpots(n: number, fl: number, ce: number): { ctx: string[]; spots: Spot[] } {
  const ctx: string[] = [L(310, ce, 310, ce + 5), circ(310, ce + 8, 3)];
  const spots: Spot[] = [];
  const r1 = ce + 16, r2 = ce + 30; // filas de rótulos, arriba de cada piso
  switch (n) {
    case 0: { // Hall: escalera con pasamanos, acceso con puerta de vidrio corrediza y alero en la fachada
      spots.push({ catg: 'Escaleras', parts: [['M80 930H108V913H136V896H164V879H192V862H220V845H248V828H262V930Z', 'f']], hit: [78, 860, 186, 70], label: [70, r1] });
      spots.push({ catg: 'Pasamanos y accesorios', parts: [[L(92, 896, 244, 806)], [L(108, 883, 108, 913)], [L(164, 849, 164, 879)], [L(220, 815, 220, 845)]], hit: [150, 840, 40, 20], label: [140, r2] });
      spots.push({ catg: 'Herrajes de puertas de vidrio y corredizas', parts: [[L(400, fl - 82, 520, fl - 82)], [R(404, fl - 80, 56, 80), 'g'], [R(452, fl - 78, 56, 78), 'g'], [circ(416, fl - 82, 3)], [circ(496, fl - 82, 3)]], hit: [398, fl - 86, 126, 86], label: [330, r1] });
      spots.push({ catg: 'Fachadas y aleros de vidrio', parts: [[`M568 ${ce + 22}L630 ${ce + 30}V${ce + 34}L568 ${ce + 26}Z`, 'g'], [L(568, ce + 4, 622, ce + 30)]], hit: [566, ce + 2, 68, 36], label: [460, r2] });
      break;
    }
    case 1: { // Balcón: baranda de vidrio con postes y deck de madera
      ctx.push(R(W1, fl, 66, 8), `M100 ${fl - 16}v-20q0-4 4-4h72q4 0 4 4v20`, L(104, fl - 28, 176, fl - 28)); // losa del balcón y sillón
      spots.push({ catg: 'Barandas de vidrio', parts: [[R(578, fl - 36, 48, 32), 'g'], [L(576, fl - 36, 628, fl - 36)]], hit: [574, fl - 40, 56, 36], label: [430, r1] });
      spots.push({ catg: 'Postes de baranda', parts: [[R(572, fl - 40, 5, 36), 'f'], [R(627, fl - 40, 5, 36), 'f']], hit: [570, fl - 42, 64, 40], label: [430, r2] });
      spots.push({ catg: 'Madera y materia prima', parts: [[R(W1, fl - 4, 66, 4), 'f'], [L(584, fl - 4, 584, fl)], [L(600, fl - 4, 600, fl)], [L(616, fl - 4, 616, fl)]], hit: [W1, fl - 6, 66, 8], label: [430, ce + 44] });
      break;
    }
    case 2: { // Cocina: mesada de acero con bacha, grifería y canastos bajo mesada
      ctx.push(R(152, fl - 30, 266, 30), L(326, fl - 30, 326, fl), L(210, fl - 30, 210, fl));
      spots.push({ catg: 'Bachas con escurridor', parts: [[`M224 ${fl - 30}v10q0 5 5 5h26q5 0 5-5v-10`], [L(266, fl - 35, 300, fl - 35)], [L(270, fl - 37, 296, fl - 37)]], hit: [220, fl - 40, 84, 26], label: [150, r1] });
      spots.push({ catg: 'Grifería de cocina', parts: [[`M244 ${fl - 34}v-20q0-9 9-9h3q4 0 4 4v5`], [`M244 ${fl - 44}h-7`]], hit: [234, fl - 66, 30, 32], label: [150, r2] });
      spots.push({ catg: 'Mesadas de acero', parts: [[R(150, fl - 34, 270, 4), 'f']], hit: [340, fl - 36, 60, 7], label: [340, r2] });
      spots.push({ catg: 'Canastos bajo mesada', parts: [...wire(332, fl - 26, 80, 10), ...wire(332, fl - 13, 80, 10)], hit: [330, fl - 28, 84, 28], label: [340, r1] });
      break;
    }
    case 3: { // Cocina: alacena, columna extraíble y despensero
      ctx.push(R(152, fl - 30, 200, 30), R(150, fl - 34, 204, 4));
      spots.push({ catg: 'Alacenas', parts: [[R(150, ce + 22, 150, 24), 'f'], [L(225, ce + 22, 225, ce + 46)], [L(150, ce + 22, 170, ce + 12)]], hit: [148, ce + 20, 154, 28], label: [150, r1 - 2] });
      spots.push({ catg: 'Columnas y laterales extraíbles', parts: [[R(372, ce + 6, 32, fl - ce - 6), 'f'], ...[0, 1, 2, 3].flatMap((i) => wire(376, ce + 14 + i * 18, 24, 12))], hit: [370, ce + 4, 36, fl - ce - 4], label: [236, r1 - 2] });
      spots.push({ catg: 'Despenseros', parts: [[R(414, ce + 6, 50, fl - ce - 6), 'f'], ...[0, 1, 2, 3].flatMap((i) => wire(420, ce + 14 + i * 18, 38, 12))], hit: [412, ce + 4, 54, fl - ce - 4], label: [472, fl - 46] });
      break;
    }
    case 4: { // Lavadero y bajo mesada: esquinero, especiero, cestos y lavadero
      ctx.push(R(152, fl - 30, 166, 30), R(150, fl - 34, 170, 4), L(236, fl - 30, 236, fl), L(262, fl - 30, 262, fl));
      spots.push({ catg: 'Esquineros', parts: [[`M158 ${fl - 26}a20 12 0 0 1 0 22`], [`M230 ${fl - 26}a20 12 0 0 0 0 22`], [L(158, fl - 15, 230, fl - 15)]], hit: [154, fl - 28, 80, 28], label: [150, r1] });
      spots.push({ catg: 'Especieros', parts: [[R(240, fl - 28, 18, 28), 'f'], [L(242, fl - 20, 256, fl - 20)], [L(242, fl - 11, 256, fl - 11)]], hit: [238, fl - 30, 22, 30], label: [150, r2] });
      spots.push({ catg: 'Cestos de residuos', parts: [[R(268, fl - 24, 20, 22), 'f'], [R(292, fl - 24, 20, 22), 'f']], hit: [264, fl - 28, 52, 28], label: [272, r1] });
      spots.push({ catg: 'Lavadero', parts: [[R(430, fl - 50, 70, 22), 'f'], [R(436, fl - 46, 58, 14)], [L(434, fl - 28, 434, fl)], [L(496, fl - 28, 496, fl)]], hit: [426, fl - 54, 78, 54], label: [430, r1] });
      break;
    }
    case 5: { // Baño: vanitory con bacha y grifería
      const vx = 270;
      ctx.push(R(vx - 22, fl - 82 + 10, 44, 24), `M470 ${fl}v-14h22v14`, R(468, fl - 30, 26, 14)); // espejo e inodoro
      spots.push({ catg: 'Bachas de baño', parts: [[R(vx - 32, fl - 44, 64, 18), 'f'], [`M${vx - 26} ${fl - 44}v-4q0-2 2-2h48q2 0 2 2v4`, 'f'], [L(vx - 6, fl - 35, vx + 6, fl - 35)]], hit: [vx - 34, fl - 52, 68, 28], label: [150, r1] });
      spots.push({ catg: 'Grifería de baño', parts: [[`M${vx} ${fl - 50}v-8q0-2 2-2h7v2.5`], [`M${vx} ${fl - 56}h-5`]], hit: [vx - 7, fl - 62, 20, 14], label: [150, r2] });
      break;
    }
    case 6: { // Baño: mampara con herrajes
      const sx = 230;
      spots.push({ catg: 'Mamparas de baño', parts: [[R(sx, ce + 8, 64, fl - ce - 12), 'g'], [L(sx + 32, ce + 10, sx + 32, fl - 6)], [L(sx + 8, fl - 18, sx + 24, ce + 24)], [R(sx - 2, fl - 4, 68, 4), 'f']], hit: [sx - 2, ce + 6, 68, fl - ce - 6], label: [320, r1] });
      spots.push({ catg: 'Herrajes de mampara', parts: [[R(sx - 3, ce + 20, 6, 10), 'f'], [R(sx - 3, fl - 30, 6, 10), 'f']], hit: [sx - 5, ce + 18, 10, 14], label: [320, r2] });
      break;
    }
    case 7: { // Vestidor: barral, estantes, canastos y cajonera
      const x0 = 150, w = 300;
      const parts: Part[] = [[R(x0, ce + 6, w, fl - ce - 6), 'f'], [L(x0 + 100, ce + 6, x0 + 100, fl)], [L(x0 + 200, ce + 6, x0 + 200, fl)]];
      parts.push([L(x0 + 8, ce + 20, x0 + 92, ce + 20)]);
      for (let x = x0 + 14; x < x0 + 90; x += 12) parts.push([`M${x} ${ce + 20}l-4 30h8z`]);
      for (let y = ce + 18; y < fl - 6; y += 16) parts.push([L(x0 + 104, y, x0 + 196, y)]);
      parts.push(...wire(x0 + 208, ce + 14, 84, 12), ...wire(x0 + 208, ce + 32, 84, 12));
      for (let y = ce + 52; y < fl - 4; y += 9) parts.push([L(x0 + 204, y, x0 + 296, y)]);
      spots.push({ catg: 'Vestidor', parts, hit: [x0 - 2, ce + 4, w + 4, fl - ce - 4], label: [x0 + w + 10, r1] });
      break;
    }
  }
  return { ctx, spots };
}

/** Contenido interno del <svg class="bld">: defs, cotas, pisos, rótulos y llaves por ambiente. */
export function buildingInner(): string {
  labeled.clear();
  let floors = '', labels = '', cotas = '';
  const cota = (y: number, t: string) => `<path d="${L(40, y, 50, y)}"/><text x="36" y="${y + 3.5}" text-anchor="end">${t}</text>`;

  FLOORS.forEach(({ nivel, amb }) => {
    const { fl, ce } = level(nivel);
    const walls = nivel === 0
      ? `<path class="wall" d="${R(W0, ce, 8, fl - ce)}"/><path class="wall" d="${R(W1 - 8, ce, 8, 20)}"/><path class="wall" d="${R(W1 - 8, ce + 86, 8, 16)}"/>` + G([L(W1 - 4, ce + 20, W1 - 4, ce + 86)], 'glass')
      : `<path class="wall" d="${R(W0, ce, 8, 84)}"/><path class="wall" d="${R(W1 - 8, ce, 8, 14)}"/><path class="wall" d="${R(W1 - 8, ce + 64, 8, 20)}"/>` + G([L(W1 - 4, ce + 14, W1 - 4, ce + 64), L(W1 - 7, ce + 39, W1 - 1, ce + 39)], 'glass');
    const { ctx, spots } = floorSpots(nivel, fl, ce);
    const drawn = spots.map((s) => spot(amb, s));
    floors += `<g class="fl" style="--i:${nivel}"><path class="slab" d="${R(W0, fl, W1 - W0, 8)}"/>${walls}` +
      `<g class="room" data-cat="${amb}">${G([L(IN0, ce, IN0, fl), L(IN1, ce, IN1, fl), ...ctx], 'ctx')}${drawn.map((d) => d.g).join('')}</g>` +
      `<text class="lv" x="36" y="${(ce + fl) / 2 + 4}" text-anchor="end">${floorName(nivel)}</text></g>`;
    labels += drawn.map((d) => d.lbl).join('');
    cotas += cota(fl, nivel === 0 ? '±0,00' : '+' + (3.4 + 2.9 * (nivel - 1)).toFixed(2).replace('.', ','));
  });

  floors += `<g class="fl" style="--i:8"><path class="slab" d="${R(W0, 176, W1 - W0, 8)}"/><path class="wall" d="${R(W0, 158, 8, 18)}"/><path class="wall" d="${R(W1 - 8, 158, 8, 18)}"/>` +
    G([R(404, 122, 96, 38), L(404, 134, 500, 134), L(414, 160, 414, 176), L(490, 160, 490, 176), R(176, 140, 60, 36), L(60, 166, 140, 166), L(80, 158, 80, 176), L(100, 158, 100, 176), L(120, 158, 120, 176)], 'ctx') +
    `<text class="lv" x="36" y="168" text-anchor="end">AZ</text></g>`;
  cotas += cota(176, '+23,70');

  // Llaves laterales: qué pisos ocupa cada ambiente
  let brackets = '';
  AMBIENTES.forEach((a) => {
    const ns = FLOORS.filter((f) => f.amb === a.id).map((f) => f.nivel);
    if (!ns.length) return;
    const top = level(Math.max(...ns)).ce + 4, bot = level(Math.min(...ns)).fl - 4, mid = (top + bot) / 2;
    const span = ns.length > 1 ? `${floorName(Math.min(...ns))}–${floorName(Math.max(...ns))}` : floorName(ns[0]);
    brackets += `<g class="brk" data-cat="${a.id}"><path d="M644 ${top}h8V${bot}h-8"/><path d="M652 ${mid}h8"/>` +
      `<text class="bk" x="666" y="${mid - 2}">${esc(a.corto.toUpperCase())}</text><text x="666" y="${mid + 12}">${span}</text></g>`;
  });

  let hatch = '';
  for (let x = -10; x < 700; x += 14) hatch += `<path class="hatch" d="${L(x, 958, x + 12, 942)}"/>`;
  const piles = G([L(100, 938, 100, 974), L(310, 938, 310, 974), L(520, 938, 520, 974)], 'ctx');

  const defs = `<defs><pattern id="bhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="#C9C8C1" stroke-width="1"/></pattern>` +
    `<filter id="bglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="b"/>` +
    `<feFlood flood-color="#E8843C" flood-opacity=".75"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;

  return `${defs}${hatch}${piles}<path class="ground" d="${L(-20, 938, 700, 938)}"/><g class="cota">${cotas}</g>${floors}${brackets}${labels}`;
}

export function floorsLabel(amb: AmbId): string {
  const ns = FLOORS.filter((f) => f.amb === amb).map((f) => floorName(f.nivel));
  return ns.length > 1 ? `${ns.slice(0, -1).join(', ')} y ${ns[ns.length - 1]}` : ns[0] ?? '';
}
