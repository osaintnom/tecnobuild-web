// Corte técnico del edificio: planta baja + 7 pisos + azotea.
// Cada terminación es un grupo .hs con data-model; las fichas .co se encienden por categoría.
import { modelById, type CatId } from '@/content/catalog';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const R = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const L = (a: number, b: number, c: number, d: number) => `M${a} ${b}L${c} ${d}`;
const P = (d: string) => `<path d="${d}"/>`;
const G = (ds: string[], cls: string) => `<g class="${cls}">${ds.map(P).join('')}</g>`;
const HS = (model: string, ds: string[], hit: string) => {
  const m = modelById[model];
  return `<g class="hs c-${m.cat}" data-model="${model}"><title>${esc(m.nombre)} · ${m.codigo}</title>${ds.map(P).join('')}<path class="hit" d="${hit}"/></g>`;
};
const FL = (k: number) => 820 - 92 * (k - 1);

function unit(fl: number, ce: number, k: number) {
  const ev = k % 2 === 0;
  const ctx = [
    L(150, ce, 150, fl), L(154, ce, 154, fl), L(324, ce, 324, fl), L(328, ce, 328, fl),
    R(166, fl - 30, 150, 30), L(216, fl - 30, 216, fl), L(266, fl - 30, 266, fl), L(176, fl - 24, 184, fl - 24), L(226, fl - 24, 234, fl - 24), L(276, fl - 24, 284, fl - 24),
    R(162, fl - 33, 158, 3), R(166, ce + 6, 100, 22), L(216, ce + 6, 216, ce + 28), `M282 ${ce + 6}h24l8 14h-40Z`,
    L(240, ce, 240, ce + 5), L(440, ce, 440, ce + 5),
    R(374, ce + 8, 44, 24), `M440 ${fl - 26}H466Q466 ${fl - 14} 452 ${fl - 14}H446Q440 ${fl - 14} 440 ${fl - 20}Z`, R(447, fl - 48, 12, 16), `M530 ${ce + 8}V${ce + 14}h-8`,
  ];
  const floor = [L(62, fl - 1.5, 558, fl - 1.5)];
  for (let x = 70; x < 558; x += 16) floor.push(L(x, fl - 4.5, x, fl - 1.5));
  const bh = fl - 33 - (ce + 30);
  const back = [R(166, ce + 30, 152, bh), L(166, ce + 30 + bh / 2, 318, ce + 30 + bh / 2)];
  for (let x = 178; x < 318; x += 12) back.push(L(x, ce + 30, x, fl - 33));
  return G(ctx, 'ctx') +
    HS('pr-02', floor, R(60, fl - 8, 500, 8)) +
    HS('pr-01', back, R(166, ce + 30, 152, bh)) +
    HS('pu-01', [R(82, fl - 66, 38, 66), R(86, fl - 62, 30, 62), L(110, fl - 33, 110, fl - 27), L(86, fl - 50, 89, fl - 50), L(86, fl - 14, 89, fl - 14)], R(80, fl - 68, 42, 66)) +
    HS('pu-02', [R(332, fl - 60, 26, 60), L(332, fl - 44, 358, fl - 44), L(332, fl - 28, 358, fl - 28), L(352, fl - 33, 352, fl - 27)], R(330, fl - 62, 30, 60)) +
    (ev
      ? HS('ba-02', [`M226 ${fl - 33}l3 9h22l3-9`, `M258 ${fl - 33}l3 9h22l3-9`, L(240, fl - 24, 240, fl - 21), L(272, fl - 24, 272, fl - 21)], R(222, fl - 34, 66, 14))
      : HS('ba-01', [`M234 ${fl - 33}l3 10h30l3-10`, L(252, fl - 23, 252, fl - 20)], R(230, fl - 34, 44, 14))) +
    HS('gr-01', [`M256 ${fl - 33}V${fl - 50}Q256 ${fl - 58} 264 ${fl - 58}H270V${fl - 53}`, L(249, fl - 42, 256, fl - 42), L(252, fl - 33, 260, fl - 33)], R(246, fl - 62, 30, 26)) +
    HS('va-01', [R(366, fl - 40, 60, 18), L(366, fl - 31, 426, fl - 31), L(392, fl - 27, 400, fl - 27), `M372 ${fl - 40}Q396 ${fl - 47} 420 ${fl - 40}`], R(362, fl - 44, 68, 26)) +
    HS('gl-01', [`M396 ${fl - 44}V${fl - 51}H403`, L(393, fl - 48, 396, fl - 48)], R(388, fl - 56, 22, 12)) +
    HS('ma-01', [R(482, ce + 6, 64, fl - ce - 6), L(482, ce + 6, 482, fl), L(494, fl - 18, 528, ce + 30), L(504, fl - 12, 534, ce + 44)], R(480, ce + 4, 68, fl - ce - 4));
}

// Fichas por categoría: [modelo, ancla x, ancla y, altura del rótulo]. Ancla en un elemento real, guía por la losa, texto al margen.
const CALLOUTS: Record<CatId, [string, number, number, number][]> = {
  pisos: [['pr-02', 540, 542, 545], ['rv-01', 456, 870, 850], ['pr-01', 540, 927, 925]],
  puertas: [['pu-01', 120, 330, 300], ['pu-02', 358, 515, 470], ['pu-03', 512, 880, 880]],
  cocinas: [['ba-01', 270, 424, 405], ['gr-01', 270, 578, 585], ['ba-02', 284, 700, 705]],
  banos: [['va-01', 426, 329, 300], ['gl-01', 403, 493, 470], ['ma-01', 546, 688, 690]],
};

/** Contenido interno del <svg class="bld"> (defs, cotas, pisos y fichas). */
export function buildingInner(): string {
  const W0 = 52, W1 = 568;
  let out = '', cotas = '';
  const cota = (y: number, t: string) => `<path d="${L(40, y, 50, y)}"/><text x="36" y="${y + 3.5}" text-anchor="end">${t}</text>`;

  // Planta baja: hall
  const fl0 = 930, ce0 = 828;
  const pbFloor = [R(62, 924, 496, 6)];
  for (let x = 92; x < 558; x += 30) pbFloor.push(L(x, 924, x, 930));
  const slats = [R(296, 846, 160, 72)];
  for (let x = 306; x < 456; x += 10) slats.push(L(x, 846, x, 918));
  out += `<g class="fl" style="--i:0">` +
    `<path class="slab" d="${R(W0, fl0, W1 - W0, 8)}"/><path class="wall" d="${R(W0, ce0, 8, fl0 - ce0)}"/><path class="wall" d="${R(W1 - 8, ce0, 8, 20)}"/><path class="wall" d="${R(W1 - 8, ce0 + 86, 8, 16)}"/>` +
    G([L(W1 - 4, ce0 + 20, W1 - 4, ce0 + 86)], 'glass') +
    G([R(72, 852, 70, 78), L(107, 852, 107, 930), L(101, 885, 101, 897), L(113, 885, 113, 897), `M66 852h82`, R(176, 846, 56, 84), L(204, 846, 204, 930), R(198, 838, 12, 5), R(244, 866, 34, 30), L(244, 876, 278, 876), L(244, 886, 278, 886), L(255, 866, 255, 896), L(266, 866, 266, 896), L(150, ce0, 150, ce0 + 5), L(380, ce0, 380, ce0 + 5), L(520, ce0, 520, ce0 + 5)], 'ctx') +
    HS('pr-01', pbFloor, R(60, 918, 500, 12)) + HS('rv-01', slats, R(294, 844, 164, 76)) +
    HS('pu-03', [R(472, 858, 40, 72), R(476, 862, 32, 68), R(488, 872, 8, 36), L(502, 892, 502, 898)], R(470, 856, 44, 74)) +
    `<text class="lv" x="36" y="${(ce0 + fl0) / 2 + 4}" text-anchor="end">PB</text></g>`;
  cotas += cota(fl0, '±0,00');

  for (let k = 1; k <= 7; k++) {
    const fl = FL(k), ce = fl - 84;
    out += `<g class="fl" style="--i:${k}"><path class="slab" d="${R(W0, fl, W1 - W0, 8)}"/>` +
      `<path class="wall" d="${R(W0, ce, 8, 84)}"/><path class="wall" d="${R(W1 - 8, ce, 8, 14)}"/><path class="wall" d="${R(W1 - 8, ce + 64, 8, 20)}"/>` +
      G([L(W1 - 4, ce + 14, W1 - 4, ce + 64), L(W1 - 7, ce + 39, W1 - 1, ce + 39)], 'glass') +
      unit(fl, ce, k) + `<text class="lv" x="36" y="${(ce + fl) / 2 + 4}" text-anchor="end">P${k}</text></g>`;
    cotas += cota(fl, '+' + (3.4 + 2.9 * (k - 1)).toFixed(2).replace('.', ','));
  }

  out += `<g class="fl" style="--i:8"><path class="slab" d="${R(W0, 176, W1 - W0, 8)}"/><path class="wall" d="${R(W0, 158, 8, 18)}"/><path class="wall" d="${R(W1 - 8, 158, 8, 18)}"/>` +
    G([R(404, 122, 96, 38), L(404, 134, 500, 134), L(414, 160, 414, 176), L(490, 160, 490, 176), R(176, 140, 60, 36), L(60, 166, 140, 166), L(80, 158, 80, 176), L(100, 158, 100, 176), L(120, 158, 120, 176)], 'ctx') +
    `<text class="lv" x="36" y="168" text-anchor="end">AZ</text></g>`;
  cotas += cota(176, '+23,70');

  let hatch = '';
  for (let x = -10; x < 640; x += 14) hatch += `<path class="hatch" d="${L(x, 958, x + 12, 942)}"/>`;
  const piles = G([L(100, 938, 100, 974), L(310, 938, 310, 974), L(520, 938, 520, 974)], 'ctx');

  const slabY = (y: number) => {
    if (y > 828) return 824;
    for (let k = 1; k <= 7; k++) { const fl = FL(k); if (y <= fl && y > fl - 92) return fl - 88; }
    return y;
  };
  let co = '';
  (Object.entries(CALLOUTS) as [CatId, [string, number, number, number][]][]).forEach(([cat, list]) =>
    list.forEach(([id, ax, ay, ly]) => {
      const m = modelById[id];
      const d = ax >= 500 ? `M${ax} ${ay}H588L598 ${ly}H606` : `M${ax} ${ay}V${slabY(ay)}H588L598 ${ly}H606`;
      co += `<g class="co" data-cat="${cat}" data-model="${id}"><path d="${d}"/><circle cx="${ax}" cy="${ay}" r="4"/><rect class="chit" x="604" y="${ly - 16}" width="220" height="36"/><text class="cc" x="612" y="${ly - 1}">${m.codigo}</text><text class="cn" x="612" y="${ly + 14}">${esc(m.nombre)}</text></g>`;
    }));

  return `<defs><pattern id="bhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="#C9C8C1" stroke-width="1"/></pattern></defs>` +
    `${hatch}${piles}<path class="ground" d="${L(-20, 938, 640, 938)}"/><g class="cota">${cotas}</g>${out}${co}`;
}
