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
  { nivel: 2, amb: 'cocina' }, { nivel: 3, amb: 'cocina' },
  { nivel: 4, amb: 'bano' }, { nivel: 5, amb: 'bano' },
  { nivel: 6, amb: 'vestidor' }, { nivel: 7, amb: 'vestidor' },
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
    lbl = `<g class="lbl" data-cat="${amb}" data-catg="${esc(s.catg)}"><text class="cn" x="${s.label[0]}" y="${s.label[1]}">${esc(CORTO[s.catg] ?? s.catg)}</text></g>`;
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
  const ctx: string[] = [L(310, ce, 310, ce + 6), circ(310, ce + 9, 3)];
  const spots: Spot[] = [];
  switch (n) {
    case 0: { // Hall: escalera con pasamanos, puerta de vidrio corrediza y alero en la fachada
      const st = 'M80 930H108V913H136V896H164V879H192V862H220V845H248V828H262V930Z';
      spots.push({ catg: 'Escaleras', parts: [[st, 'f']], hit: [78, 826, 186, 104], label: [84, 846] });
      spots.push({ catg: 'Pasamanos y accesorios', parts: [[L(92, 896, 244, 806)], [L(108, 913 - 30, 108, 913)], [L(164, 879 - 30, 164, 879)], [L(220, 845 - 30, 220, 845)]], hit: [88, 800, 160, 100] });
      spots.push({ catg: 'Herrajes de puertas de vidrio y corredizas', parts: [[L(410, fl - 82, 520, fl - 82)], [R(414, fl - 80, 52, 80), 'g'], [R(458, fl - 78, 52, 78), 'g'], [circ(424, fl - 82, 3)], [circ(500, fl - 82, 3)]], hit: [406, fl - 88, 118, 88], label: [410, fl - 92] });
      spots.push({ catg: 'Fachadas y aleros de vidrio', parts: [[`M568 ${ce + 22}L630 ${ce + 30}V${ce + 34}L568 ${ce + 26}Z`, 'g'], [L(568, ce + 4, 622, ce + 30)]], hit: [566, ce + 2, 68, 36] });
      ctx.push(R(330, fl - 40, 60, 26), L(330, fl - 34, 390, fl - 34)); // mostrador
      break;
    }
    case 1: { // Balcón con baranda de vidrio, postes y deck; baranda de cable y de aluminio en la galería
      ctx.push(R(W1, fl, 66, 8)); // losa del balcón
      spots.push({ catg: 'Madera y materia prima', parts: [[R(W1, fl - 4, 66, 4), 'f'], [L(584, fl - 4, 584, fl)], [L(600, fl - 4, 600, fl)], [L(616, fl - 4, 616, fl)]], hit: [W1, fl - 6, 66, 8] });
      spots.push({ catg: 'Barandas de vidrio', parts: [[R(578, fl - 36, 48, 32), 'g'], [L(576, fl - 36, 628, fl - 36)]], hit: [574, fl - 40, 56, 36], label: [470, ce + 18] });
      spots.push({ catg: 'Postes de baranda', parts: [[R(572, fl - 40, 5, 36), 'f'], [R(627, fl - 40, 5, 36), 'f']], hit: [570, fl - 42, 64, 40] });
      const cable: Part[] = [[R(88, fl - 36, 4, 36), 'f'], [R(200, fl - 36, 4, 36), 'f']];
      for (let y = fl - 30; y < fl; y += 7) cable.push([L(92, y, 200, y)]);
      spots.push({ catg: 'Barandas de cable', parts: cable, hit: [86, fl - 40, 120, 40], label: [90, fl - 44] });
      const bars: Part[] = [[L(260, fl - 36, 400, fl - 36)], [L(260, fl - 4, 400, fl - 4)]];
      for (let x = 264; x < 400; x += 8) bars.push([L(x, fl - 36, x, fl - 4)]);
      spots.push({ catg: 'Rellenos y barandas de aluminio', parts: bars, hit: [256, fl - 40, 148, 40], label: [262, fl - 44] });
      break;
    }
    case 2: { // Cocina: mesada con bacha y grifería, canastos, cestos, alacena y despensero
      ctx.push(R(152, fl - 30, 266, 30), L(210, fl - 30, 210, fl), L(326, fl - 30, 326, fl));
      for (let y = fl - 54; y < fl - 34; y += 6) ctx.push(L(150, y, 420, y));
      spots.push({ catg: 'Mesadas de acero', parts: [[R(150, fl - 34, 270, 4), 'f']], hit: [148, fl - 36, 274, 7] });
      spots.push({ catg: 'Bachas con escurridor', parts: [[`M224 ${fl - 30}v10q0 5 5 5h26q5 0 5-5v-10`], [L(266, fl - 35, 300, fl - 35)], [L(270, fl - 37, 296, fl - 37)]], hit: [220, fl - 40, 84, 26], label: [226, fl - 46] });
      spots.push({ catg: 'Grifería de cocina', parts: [[`M244 ${fl - 34}v-20q0-9 9-9h3q4 0 4 4v5`], [`M244 ${fl - 44}h-7`]], hit: [234, fl - 66, 30, 32] });
      spots.push({ catg: 'Canastos bajo mesada', parts: [...wire(332, fl - 26, 80, 10), ...wire(332, fl - 13, 80, 10)], hit: [330, fl - 28, 84, 28], label: [348, fl - 60] });
      spots.push({ catg: 'Cestos de residuos', parts: [[R(160, fl - 24, 20, 22), 'f'], [R(184, fl - 24, 20, 22), 'f']], hit: [156, fl - 28, 52, 28] });
      spots.push({ catg: 'Alacenas', parts: [[R(150, ce + 6, 140, 22), 'f'], [L(150, ce + 6, 168, ce - 0)], [L(220, ce + 6, 220, ce + 28)]], hit: [148, ce + 2, 144, 28], label: [154, ce + 38] });
      spots.push({ catg: 'Despenseros', parts: [[R(444, ce + 6, 48, fl - ce - 6), 'f'], ...[0, 1, 2, 3].flatMap((i) => wire(450, ce + 14 + i * 18, 36, 12))], hit: [442, ce + 4, 52, fl - ce - 4], label: [498, ce + 20] });
      break;
    }
    case 3: { // Cocina y lavadero: esquinero, especiero, bacha redonda, columnas, paneles y lavadero
      ctx.push(R(152, fl - 30, 246, 30), R(150, fl - 34, 250, 4), L(236, fl - 30, 236, fl));
      spots.push({ catg: 'Esquineros', parts: [[`M158 ${fl - 26}a20 12 0 0 1 0 22`], [`M230 ${fl - 26}a20 12 0 0 0 0 22`], [L(158, fl - 15, 230, fl - 15)]], hit: [154, fl - 28, 80, 28], label: [156, fl - 44] });
      spots.push({ catg: 'Especieros', parts: [[R(240, fl - 28, 16, 28), 'f'], [L(242, fl - 20, 254, fl - 20)], [L(242, fl - 11, 254, fl - 11)]], hit: [238, fl - 30, 20, 30] });
      spots.push({ catg: 'Bachas redondas', parts: [[`M286 ${fl - 30}q20 22 40 0`]], hit: [282, fl - 36, 48, 20], label: [282, fl - 44] });
      spots.push({ catg: 'Columnas y laterales extraíbles', parts: [[R(404, ce + 6, 30, fl - ce - 6), 'f'], ...[0, 1, 2, 3].flatMap((i) => wire(408, ce + 14 + i * 18, 22, 12))], hit: [402, ce + 4, 34, fl - ce - 4], label: [328, ce + 20] });
      spots.push({ catg: 'Paneles perforados extraíbles', parts: [[R(260, ce + 8, 60, 24), 'f'], ...[0, 1, 2].flatMap((r) => [0, 1, 2, 3, 4, 5].map((c): Part => [circ(268 + c * 9, ce + 14 + r * 7, 0.8)]))], hit: [258, ce + 6, 64, 28] });
      spots.push({ catg: 'Lavadero', parts: [[R(470, fl - 50, 66, 22), 'f'], [R(476, fl - 46, 54, 14)], [L(474, fl - 28, 474, fl)], [L(532, fl - 28, 532, fl)]], hit: [466, fl - 54, 74, 54], label: [462, fl - 60] });
      break;
    }
    case 4: case 5: { // Baño: vanitory con bacha y grifería, mampara con herrajes
      const vx = n === 4 ? 230 : 330, sx = n === 4 ? 392 : 150;
      for (let y = ce + 6; y < fl; y += 8) ctx.push(L(sx - 6, y, sx + 72, y));
      ctx.push(R(vx - 22, fl - 82, 44, 26)); // espejo
      ctx.push(`M490 ${fl}v-14h22v14`, R(488, fl - 30, 26, 14)); // inodoro
      spots.push({ catg: 'Bachas de baño', parts: [[R(vx - 32, fl - 44, 64, 18), 'f'], [`M${vx - 26} ${fl - 44}v-4q0-2 2-2h48q2 0 2 2v4`, 'f'], [L(vx - 6, fl - 35, vx + 6, fl - 35)]], hit: [vx - 34, fl - 52, 68, 28], label: [vx - 32, fl - 18] });
      spots.push({ catg: 'Grifería de baño', parts: [[`M${vx} ${fl - 50}v-8q0-2 2-2h7v2.5`], [`M${vx} ${fl - 56}h-5`]], hit: [vx - 7, fl - 62, 20, 14] });
      spots.push({ catg: 'Mamparas de baño', parts: [[R(sx, ce + 8, 60, fl - ce - 12), 'g'], [L(sx + 30, ce + 10, sx + 30, fl - 6)], [L(sx + 8, fl - 18, sx + 22, ce + 22)], [R(sx - 2, fl - 4, 64, 4), 'f']], hit: [sx - 2, ce + 6, 64, fl - ce - 6], label: [sx + 66, ce + 20] });
      spots.push({ catg: 'Herrajes de mampara', parts: [[R(sx - 3, ce + 20, 6, 10), 'f'], [R(sx - 3, fl - 30, 6, 10), 'f']], hit: [sx - 5, ce + 18, 10, fl - ce - 24], label: [sx + 66, ce + 34] });
      break;
    }
    case 6: case 7: { // Vestidor: barral, estantes, canastos y cajonera
      const x0 = n === 6 ? 120 : 200, w = 300;
      const parts: Part[] = [[R(x0, ce + 6, w, fl - ce - 6), 'f'], [L(x0 + 100, ce + 6, x0 + 100, fl)], [L(x0 + 200, ce + 6, x0 + 200, fl)]];
      parts.push([L(x0 + 8, ce + 20, x0 + 92, ce + 20)]);
      for (let x = x0 + 14; x < x0 + 90; x += 12) parts.push([`M${x} ${ce + 20}l-4 30h8z`]);
      for (let y = ce + 18; y < fl - 6; y += 16) parts.push([L(x0 + 104, y, x0 + 196, y)]);
      parts.push(...wire(x0 + 208, ce + 14, 84, 12), ...wire(x0 + 208, ce + 32, 84, 12));
      for (let y = ce + 52; y < fl - 4; y += 9) parts.push([L(x0 + 204, y, x0 + 296, y)]);
      spots.push({ catg: 'Vestidor', parts, hit: [x0 - 2, ce + 4, w + 4, fl - ce - 4], label: [x0 + w + 8, ce + 20] });
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
