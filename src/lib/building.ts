// Corte técnico del edificio: planta baja + 7 pisos + azotea.
// Cada piso muestra una sola categoría (ver FLOORS en content/catalog.ts). Cada producto es un grupo
// .hs con data-model; sus rótulos (.lbl) y la llave lateral de la categoría (.brk) se encienden al bajar.
import { CATS, FLOORS, catById, floorName, modelById, type CatId, type Model } from '@/content/catalog';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const R = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const L = (a: number, b: number, c: number, d: number) => `M${a} ${b}L${c} ${d}`;
const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const P = (d: string, cls = '') => `<path d="${d}"${cls ? ` class="${cls}"` : ''}/>`;
const G = (ds: string[], cls: string) => `<g class="${cls}">${ds.map((d) => P(d)).join('')}</g>`;

// Geometría: x de 52 a 568; losa de 8; pisos de 92 (84 de altura libre). PB más alta (102).
const W0 = 52, W1 = 568, IN0 = 60, IN1 = 560;
const level = (n: number) => (n === 0 ? { fl: 930, ce: 828 } : { fl: 820 - 92 * (n - 1), ce: 820 - 92 * (n - 1) - 84 });

/** Un producto dibujado: trazos (los marcados 'f' tapan lo que queda detrás), zona de clic y rótulo. */
interface Drawn { parts: [string, string?][]; hit: string; label: [number, number] }

// ---------- Productos ----------
function door(m: Model, x: number, fl: number): Drawn {
  const W = 30, H = 68, l = x - W / 2;
  const parts: [string, string?][] = [
    [R(l - 3, fl - H - 3, W + 6, H + 3), 'f'],          // marco
    [R(l, fl - H, W, H), 'f'],                          // hoja
    [R(l - 1, fl - H + 8, 2, 6)], [R(l - 1, fl - 16, 2, 6)], // bisagras
    [circ(l + W - 6, fl - 34, 1.6)], [`M${l + W - 6} ${fl - 34}h-7`], // manija
  ];
  if (m.tipo === 'door-b') [0.24, 0.5, 0.76].forEach((f) => {
    const y = fl - H + H * f;
    parts.push([L(l + 3, y - 1, l + W - 3, y - 1)], [L(l + 3, y + 1, l + W - 3, y + 1)]);
  });
  if (m.tipo === 'door-v') {
    parts.push([R(x - 4, fl - H + 8, 8, H * 0.6), 'g'], [L(x - 2, fl - H + 24, x + 2, fl - H + 16)], [L(x - 2, fl - H + 34, x + 2, fl - H + 26)]);
  }
  return { parts, hit: R(l - 5, fl - H - 5, W + 10, H + 5), label: [l + W + 10, fl - H + 8] };
}

function sink(m: Model, x: number, fl: number): Drawn {
  const y = fl - 30; // bajo mesada
  const parts: [string, string?][] = m.tipo === 'sink2'
    ? [[R(x - 25, fl - 36, 50, 2)],
       [`M${x - 22} ${y}v9q0 4 4 4h12q4 0 4-4v-9`], [`M${x + 2} ${y}v9q0 4 4 4h12q4 0 4-4v-9`],
       [L(x - 12, y + 13, x - 12, y + 16)], [L(x + 12, y + 13, x + 12, y + 16)]]
    : [[R(x - 21, fl - 36, 42, 2)],
       [`M${x - 18} ${y}v10q0 5 5 5h26q5 0 5-5v-10`], [L(x, y + 15, x, y + 18)]];
  return { parts, hit: R(x - 27, fl - 38, 54, 28), label: [x + 52, fl - 20] };
}

function faucet(x: number, fl: number): Drawn {
  return {
    parts: [[R(x - 3, fl - 37.5, 6, 1.5)], [`M${x} ${fl - 36}v-20q0-9 9-9h3q4 0 4 4v5`], [`M${x} ${fl - 46}h-7`], [L(x + 16, fl - 51, x + 16, fl - 48)]],
    hit: R(x - 10, fl - 68, 30, 32),
    label: [x + 52, fl - 52],
  };
}

function vanity(x: number, fl: number): Drawn {
  return {
    parts: [
      [R(x - 32, fl - 44, 64, 20), 'f'],
      [L(x - 32, fl - 34, x + 32, fl - 34)], [L(x - 6, fl - 39, x + 6, fl - 39)], [L(x - 6, fl - 29, x + 6, fl - 29)],
      [`M${x - 26} ${fl - 44}v-4q0-2 2-2h48q2 0 2 2v4`, 'f'],
    ],
    hit: R(x - 34, fl - 52, 68, 30),
    label: [x + 42, fl - 30],
  };
}

function faucetLav(x: number, fl: number): Drawn {
  return {
    parts: [[`M${x} ${fl - 50}v-8q0-2 2-2h7v2.5`], [`M${x} ${fl - 56}h-5`]],
    hit: R(x - 7, fl - 64, 20, 16),
    label: [x + 42, fl - 60],
  };
}

function screen(x: number, fl: number, ce: number): Drawn {
  const top = ce + 8, h = fl - 4 - top;
  return {
    parts: [
      [R(x - 32, fl - 4, 64, 4), 'f'],                       // receptáculo
      [R(x - 30, top, 60, h), 'g'], [R(x - 28, top + 2, 56, h - 4)], // vidrio y perfil
      [L(x, top + 2, x, fl - 6)], [R(x + 3, fl - 46, 2, 16)],  // hoja y tirador
      [L(x - 24, fl - 18, x - 10, top + 22)], [L(x - 18, fl - 10, x - 6, top + 34)], // brillo
    ],
    hit: R(x - 34, top - 2, 68, h + 6),
    label: [x + 40, top + 14],
  };
}

function slats(x: number, fl: number, ce: number): Drawn {
  const top = ce + 12, h = fl - 16 - top;
  const parts: [string, string?][] = [[R(x - 50, top, 100, h), 'f'], [L(x - 50, top + 3, x + 50, top + 3)], [L(x - 50, top + h - 3, x + 50, top + h - 3)]];
  for (let xi = x - 45; xi < x + 50; xi += 5) parts.push([L(xi, top + 3, xi, top + h - 3)]);
  return { parts, hit: R(x - 52, top - 2, 104, h + 4), label: [x + 58, top + 10] };
}

/** Solado en perspectiva: porcelanato (grilla) o tablas (juntas trabadas). */
function flooring(m: Model, fl: number): Drawn {
  const yb = fl - 14, bx0 = 100, bx1 = 520, fx0 = IN0 + 2, fx1 = IN1 - 2;
  const at = (t: number) => [bx0 + (fx0 - bx0) * t, bx1 + (fx1 - bx1) * t, yb + 14 * t] as const;
  const parts: [string, string?][] = [[`M${bx0} ${yb}H${bx1}L${fx1} ${fl}H${fx0}Z`, 'f']];
  if (m.tipo === 'tile') {
    [0.4, 0.75].forEach((t) => { const [a, b, y] = at(t); parts.push([L(a, y, b, y)]); });
    const n = 12;
    for (let i = 1; i < n; i++) parts.push([L(bx0 + (i * (bx1 - bx0)) / n, yb, fx0 + (i * (fx1 - fx0)) / n, fl)]);
  } else {
    const rows = [0, 0.22, 0.46, 0.72, 1];
    rows.slice(1, -1).forEach((t) => { const [a, b, y] = at(t); parts.push([L(a, y, b, y)]); });
    rows.slice(0, -1).forEach((t0, r) => {
      const [a0, b0, y0] = at(t0), [a1, b1, y1] = at(rows[r + 1]);
      for (let f = (r % 2) * 0.06 + 0.09; f < 1; f += 0.12) parts.push([L(a0 + (b0 - a0) * f, y0, a1 + (b1 - a1) * f, y1)]);
    });
  }
  return { parts, hit: R(IN0, yb - 2, IN1 - IN0, 16), label: [IN0 + 8, yb - 20] };
}

// ---------- Contexto (gris) ----------
function context(cat: CatId, n: number, fl: number, ce: number): string[] {
  const c: string[] = [L(IN0, ce, IN0, fl), L(IN1, ce, IN1, fl), L(310, ce, 310, ce + 6), circ(310, ce + 9, 3)]; // luminaria
  if (cat === 'pisos' && n === 0) {
    c.push(R(470, fl - 74, 44, 74), L(492, fl - 74, 492, fl), L(486, fl - 40, 486, fl - 30), L(498, fl - 40, 498, fl - 30)); // acceso
    c.push(R(370, fl - 40, 70, 26), L(370, fl - 34, 440, fl - 34)); // mostrador
  } else if (cat === 'pisos') {
    c.push(`M360 ${fl - 16}v-20q0-4 4-4h72q4 0 4 4v20`, L(364, fl - 28, 436, fl - 28)); // sillón
    c.push(R(470, ce + 14, 60, 44), L(500, ce + 14, 500, ce + 58)); // ventana
  } else if (cat === 'puertas') {
    c.push(L(IN0, fl - 3, IN1, fl - 3)); // zócalo
  } else if (cat === 'cocinas') {
    // mesada, bajo mesada y alacenas alrededor de la bacha (x = 270)
    c.push(R(200, fl - 34, 140, 4), R(202, fl - 30, 136, 30), L(270, fl - 30, 270, fl), L(236, fl - 30, 236, fl), L(304, fl - 30, 304, fl));
    c.push(R(200, ce + 6, 140, 22), L(246, ce + 6, 246, ce + 28), L(294, ce + 6, 294, ce + 28));
    for (let y = fl - 54; y < fl - 34; y += 6) c.push(L(200, y, 340, y));
    c.push(R(470, fl - 74, 36, 74), L(470, fl - 50, 506, fl - 50)); // heladera
  } else {
    for (let y = ce + 6; y < fl; y += 8) c.push(L(IN0 + 4, y, 170, y)); // revestimiento de baño
    if (n === 6) c.push(`M${270 - 22} ${fl - 82}h44v26h-44Z`); // espejo
    c.push(`M470 ${fl}v-14h22v14`, R(468, fl - 30, 26, 14)); // inodoro
  }
  return c;
}

/** Ubica los productos de un piso: solado como banda, griferías sobre su bacha/vanitory, el resto en franjas. */
function layout(models: Model[], fl: number, ce: number): [Model, Drawn][] {
  const out: [Model, Drawn][] = [];
  const floorish = models.filter((m) => m.tipo === 'tile' || m.tipo === 'plank');
  const mounted = models.filter((m) => m.tipo === 'faucet' || m.tipo === 'faucet-b');
  const placed = models.filter((m) => !floorish.includes(m) && !mounted.includes(m));
  floorish.forEach((m) => out.push([m, flooring(m, fl)]));
  const n = placed.length;
  const xs = placed.map((m, i) => (m.cat === 'cocinas' && n === 1 ? 270 : 90 + ((i + 0.5) * 420) / n - 30));
  placed.forEach((m, i) => {
    const x = xs[i];
    const d = m.tipo.startsWith('door') ? door(m, x, fl)
      : m.tipo.startsWith('sink') ? sink(m, x, fl)
      : m.tipo === 'vanity' ? vanity(x, fl)
      : m.tipo === 'screen' ? screen(x, fl, ce)
      : slats(x, fl, ce);
    out.push([m, d]);
  });
  mounted.forEach((m) => {
    const host = placed.findIndex((p) => p.tipo.startsWith('sink') || p.tipo === 'vanity');
    const x = host >= 0 ? xs[host] : 270;
    out.push([m, m.tipo === 'faucet' ? faucet(x, fl) : faucetLav(x, fl)]);
  });
  return out;
}

function productGroup(m: Model, d: Drawn): string {
  const body = d.parts.map(([p, c]) => P(p, c)).join('');
  return `<g class="hs c-${m.cat}" data-model="${m.id}"><title>${esc(m.nombre)} · ${m.codigo}</title>${body}${P(d.hit, 'hit')}</g>`;
}

function labelGroup(m: Model, d: Drawn): string {
  const [x, y] = d.label;
  return `<g class="lbl" data-cat="${m.cat}" data-model="${m.id}"><text class="cc" x="${x}" y="${y}">${m.codigo}</text><text class="cn" x="${x}" y="${y + 13}">${esc(m.nombre)}</text></g>`;
}

/** Contenido interno del <svg class="bld"> (defs, cotas, pisos, rótulos y llaves por categoría). */
export function buildingInner(): string {
  let floors = '', labels = '', cotas = '';
  const cota = (y: number, t: string) => `<path d="${L(40, y, 50, y)}"/><text x="36" y="${y + 3.5}" text-anchor="end">${t}</text>`;

  FLOORS.forEach(({ nivel, cat, models }) => {
    const { fl, ce } = level(nivel);
    const walls = nivel === 0
      ? `<path class="wall" d="${R(W0, ce, 8, fl - ce)}"/><path class="wall" d="${R(W1 - 8, ce, 8, 20)}"/><path class="wall" d="${R(W1 - 8, ce + 86, 8, 16)}"/>` + G([L(W1 - 4, ce + 20, W1 - 4, ce + 86)], 'glass')
      : `<path class="wall" d="${R(W0, ce, 8, 84)}"/><path class="wall" d="${R(W1 - 8, ce, 8, 14)}"/><path class="wall" d="${R(W1 - 8, ce + 64, 8, 20)}"/>` + G([L(W1 - 4, ce + 14, W1 - 4, ce + 64), L(W1 - 7, ce + 39, W1 - 1, ce + 39)], 'glass');
    const items = layout(models.map((id) => modelById[id]).filter(Boolean), fl, ce);
    floors += `<g class="fl" style="--i:${nivel}"><path class="slab" d="${R(W0, fl, W1 - W0, 8)}"/>${walls}` +
      `<g class="room" data-cat="${cat}">${G(context(cat, nivel, fl, ce), 'ctx')}${items.map(([m, d]) => productGroup(m, d)).join('')}</g>` +
      `<text class="lv" x="36" y="${(ce + fl) / 2 + 4}" text-anchor="end">${floorName(nivel)}</text></g>`;
    labels += items.map(([m, d]) => labelGroup(m, d)).join('');
    cotas += cota(fl, nivel === 0 ? '±0,00' : '+' + (3.4 + 2.9 * (nivel - 1)).toFixed(2).replace('.', ','));
  });

  // Azotea
  floors += `<g class="fl" style="--i:8"><path class="slab" d="${R(W0, 176, W1 - W0, 8)}"/><path class="wall" d="${R(W0, 158, 8, 18)}"/><path class="wall" d="${R(W1 - 8, 158, 8, 18)}"/>` +
    G([R(404, 122, 96, 38), L(404, 134, 500, 134), L(414, 160, 414, 176), L(490, 160, 490, 176), R(176, 140, 60, 36), L(60, 166, 140, 166), L(80, 158, 80, 176), L(100, 158, 100, 176), L(120, 158, 120, 176)], 'ctx') +
    `<text class="lv" x="36" y="168" text-anchor="end">AZ</text></g>`;
  cotas += cota(176, '+23,70');

  // Llaves laterales: qué pisos ocupa cada categoría
  let brackets = '';
  CATS.forEach((c) => {
    const ns = FLOORS.filter((f) => f.cat === c.id).map((f) => f.nivel);
    if (!ns.length) return;
    const top = level(Math.max(...ns)).ce + 4, bot = level(Math.min(...ns)).fl - 4, mid = (top + bot) / 2;
    const span = ns.length > 1 ? `${floorName(Math.min(...ns))}–${floorName(Math.max(...ns))}` : floorName(ns[0]);
    brackets += `<g class="brk" data-cat="${c.id}"><path d="M582 ${top}h8V${bot}h-8"/><path d="M590 ${mid}h8"/>` +
      `<text class="bk" x="604" y="${mid - 2}">${esc(catById[c.id].corto.toUpperCase())}</text><text x="604" y="${mid + 12}">${span}</text></g>`;
  });

  let hatch = '';
  for (let x = -10; x < 640; x += 14) hatch += `<path class="hatch" d="${L(x, 958, x + 12, 942)}"/>`;
  const piles = G([L(100, 938, 100, 974), L(310, 938, 310, 974), L(520, 938, 520, 974)], 'ctx');

  // Glow naranja para los productos encendidos
  const defs = `<defs><pattern id="bhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="#C9C8C1" stroke-width="1"/></pattern>` +
    `<filter id="bglow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="b"/>` +
    `<feFlood flood-color="#E8843C" flood-opacity=".75"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;

  return `${defs}${hatch}${piles}<path class="ground" d="${L(-20, 938, 640, 938)}"/><g class="cota">${cotas}</g>${floors}${brackets}${labels}`;
}

export function floorsLabel(cat: CatId): string {
  const ns = FLOORS.filter((f) => f.cat === cat).map((f) => floorName(f.nivel));
  return ns.length > 1 ? `${ns.slice(0, -1).join(', ')} y ${ns[ns.length - 1]}` : ns[0] ?? '';
}
