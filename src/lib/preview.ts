// Dibujos de vista previa por categoría: se muestran mientras una familia no tenga foto.
// Devuelven markup SVG como string porque se generan a partir de datos internos (sin entrada del usuario).
import type { Dibujo } from '@/content/catalog';

const INK = '#1C1C1C';
const STEEL = '#D6D7D4', GLASS = '#D9E6E5', WOOD = '#B08A62', WHITE = '#F4F2EC';
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const P = (d: string, fill = 'none', sw = 1.3, extra = '') =>
  `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${extra}/>`;
const L = (d: string, sw = 1, op = 1) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw}" opacity="${op}" stroke-linecap="round"/>`;
const circ = (cx: number, cy: number, r: number, fill = 'none') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="1.2"/>`;
const tube = (d: string, fill: string, w = 8) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Canasto de alambre visto de frente (para canastos, despenseros, vestidores). */
const wire = (x: number, y: number, w: number, h: number, fill: string) => {
  let o = P(rr(x, y, w, h, 3), fill, 1.2);
  for (let xi = x + 8; xi < x + w - 4; xi += 8) o += L(`M${xi} ${y + 3}V${y + h - 3}`, 0.7, 0.55);
  return o;
};

export function previewSVG(kind: Dibujo, hex?: string): string {
  const c = hex ?? STEEL;
  let o = '';
  switch (kind) {
    case 'sink-drain':
      o += P(box(14, 26, 132, 68), WHITE, 1);
      o += P(rr(22, 34, 58, 52, 7), c, 1.3) + circ(51, 60, 3);
      o += P(rr(86, 34, 52, 52, 5), c, 1.1);
      for (let y = 40; y < 84; y += 6) o += L(`M92 ${y}H132`, 0.8, 0.6);
      break;
    case 'sink': case 'sink2': {
      o += P(box(14, 22, 132, 76), WHITE, 1);
      if (kind === 'sink2') o += P(rr(28, 34, 50, 52, 6), c, 1.3) + P(rr(82, 34, 50, 52, 6), c, 1.3) + circ(53, 60, 3) + circ(107, 60, 3);
      else o += P(rr(40, 32, 80, 56, 7), c, 1.3) + circ(80, 60, 3);
      break;
    }
    case 'sink-round':
      o += P(box(14, 22, 132, 76), WHITE, 1) + `<ellipse cx="80" cy="60" rx="34" ry="30" fill="${c}" stroke="${INK}" stroke-width="1.3"/>` + circ(80, 60, 3);
      break;
    case 'counter':
      o += P(box(10, 40, 140, 10), c, 1.3) + P(rr(30, 41, 46, 7, 2), '#C4C5C2', 1) + P(box(14, 50, 132, 50), WHITE, 1) + L('M80 50V100', 1, 0.6);
      break;
    case 'basin':
      o += P(rr(36, 70, 88, 26, 12), WHITE, 1.3) + tube('M80 72V52Q80 44 88 44H96V50', c, 6);
      break;
    case 'laundry':
      o += P(box(30, 30, 100, 54), c, 1.3) + P(rr(38, 38, 84, 40, 4), WHITE, 1.1);
      for (let y = 44; y < 74; y += 8) o += L(`M44 ${y}H66`, 0.8, 0.6);
      o += L('M40 84V108M120 84V108', 2);
      break;
    case 'faucet':
      o += tube('M66 104V42Q66 20 90 20H110V32', c) + P('M52 104h28', 'none', 3) + tube('M74 60h14', c, 3);
      break;
    case 'faucet-b':
      o += P(rr(30, 86, 100, 22, 10), WHITE, 1.2) + tube('M70 88V64Q70 54 80 54H98V62', c, 7);
      break;
    case 'strainer':
      o += circ(80, 60, 34, c) + circ(80, 60, 24, WHITE);
      for (let a = 0; a < 12; a++) { const t = (a / 12) * Math.PI * 2; o += `<circle cx="${80 + 14 * Math.cos(t)}" cy="${60 + 14 * Math.sin(t)}" r="1.6" fill="${INK}"/>`; }
      o += `<circle cx="80" cy="60" r="2" fill="${INK}"/>`;
      break;
    case 'column':
      o += P(box(58, 8, 44, 104), WHITE, 1.2);
      for (let y = 14; y < 106; y += 19) o += wire(62, y, 36, 14, c);
      break;
    case 'panel':
      o += P(box(44, 12, 72, 96), c, 1.3);
      for (let y = 20; y < 104; y += 8) for (let x = 52; x < 112; x += 8) o += `<circle cx="${x}" cy="${y}" r="1.3" fill="${INK}" opacity=".6"/>`;
      break;
    case 'rack':
      o += P(box(54, 10, 52, 100), WHITE, 1.2);
      for (let y = 22; y < 106; y += 22) o += P(box(58, y, 44, 4), c, 1) + L(`M60 ${y - 8}V${y}M100 ${y - 8}V${y}`, 0.8, 0.6);
      break;
    case 'basket':
      o += P(box(20, 24, 120, 76), WHITE, 1.1) + wire(28, 32, 104, 26, c) + wire(28, 66, 104, 26, c);
      break;
    case 'corner':
      o += P('M30 20H130V100H30Z', WHITE, 1.1) + `<path d="M44 40a30 30 0 0 1 0 50" fill="${c}" stroke="${INK}" stroke-width="1.2"/>` + `<path d="M116 40a30 30 0 0 0 0 50" fill="${c}" stroke="${INK}" stroke-width="1.2"/>` + L('M80 20V100', 0.8, 0.5);
      break;
    case 'liftup':
      o += P(box(24, 50, 112, 50), WHITE, 1.1) + P('M24 50L40 14H140L136 50Z', c, 1.2) + L('M40 14L52 50', 1, 0.6) + L('M120 52a40 40 0 0 0 -60 -32', 0.8, 0.5);
      break;
    case 'bin':
      o += P(box(30, 26, 100, 72), WHITE, 1.1) + P(rr(42, 34, 34, 56, 4), c, 1.2) + P(rr(84, 34, 34, 56, 4), c, 1.2) + L('M50 40H68M92 40H110', 1.4, 0.7);
      break;
    case 'door-basket':
      o += P(box(40, 10, 80, 100), WHITE, 1.2) + wire(50, 22, 60, 20, c) + wire(50, 52, 60, 20, c) + wire(50, 82, 60, 20, c);
      break;
    case 'wardrobe':
      o += P(box(20, 8, 120, 104), WHITE, 1.2) + L('M80 8V112', 1);
      o += tube('M26 26H74', c, 3);
      for (let x = 32; x < 72; x += 10) o += L(`M${x} 26L${x - 4} 60H${x + 4}Z`, 0.8, 0.6);
      o += wire(86, 20, 48, 18, c) + wire(86, 46, 48, 18, c) + wire(86, 72, 48, 18, c) + wire(26, 84, 48, 22, c);
      break;
    case 'rail-glass':
      o += P(box(20, 30, 120, 62), GLASS, 1.2, ' fill-opacity=".8"') + P(box(18, 92, 124, 10), c, 1.3) + L('M34 82L60 40M48 86L74 44', 2, 0.35);
      break;
    case 'post':
      o += P(box(72, 16, 16, 88), c, 1.3) + P(box(64, 100, 32, 6), c, 1.2) + P(box(40, 34, 32, 50), GLASS, 1, ' fill-opacity=".6"') + P(box(88, 34, 32, 50), GLASS, 1, ' fill-opacity=".6"');
      break;
    case 'handrail':
      o += tube('M14 46H146', c, 9) + L('M40 51V104M120 51V104', 2) + P(box(32, 54, 96, 46), GLASS, 1, ' fill-opacity=".5"');
      break;
    case 'rail-cable':
      o += P(box(24, 18, 8, 88), c, 1.2) + P(box(128, 18, 8, 88), c, 1.2) + tube('M20 18H140', c, 5);
      for (let y = 32; y < 104; y += 10) o += L(`M32 ${y}H128`, 1, 0.8);
      break;
    case 'rail-bars':
      o += tube('M18 24H142', c, 5) + tube('M18 96H142', c, 4);
      for (let x = 26; x < 140; x += 10) o += L(`M${x} 26V94`, 1.6, 0.85);
      break;
    case 'canopy':
      o += P(box(10, 12, 10, 96), '#BDBCB6', 1) + P('M20 40L150 52V60L20 48Z', GLASS, 1.2) + L('M20 30L120 50M20 70L120 54', 1.2, 0.8) + circ(120, 52, 2.5, INK);
      break;
    case 'wood':
      for (let y = 20; y < 100; y += 16) o += P(box(16, y, 128, 12), WOOD, 1) + L(`M28 ${y + 6}H64M84 ${y + 4}H130`, 0.6, 0.35);
      break;
    case 'stair':
      o += P('M16 104H48V84H72V64H96V44H120V24H144V104Z', STEEL, 1.2) + tube('M30 70L136 10', c, 3) + L('M48 62V84M96 34V44', 1.2);
      break;
    case 'screen':
      o += `<path d="${box(46, 10, 68, 100)}" fill="${GLASS}" opacity=".7"/>` + tube(box(46, 10, 68, 100), c, 3) + L('M56 80L92 26', 3, 0.5) + L('M20 110H140', 1.2);
      break;
    case 'hinge':
      o += P(box(20, 14, 52, 92), GLASS, 1, ' fill-opacity=".6"') + P(box(88, 14, 52, 92), GLASS, 1, ' fill-opacity=".6"');
      o += P(rr(66, 30, 28, 22, 3), c, 1.3) + P(rr(66, 70, 28, 22, 3), c, 1.3) + L('M80 30V52M80 70V92', 1, 0.6);
      break;
    case 'slider':
      o += tube('M12 22H148', c, 5) + P(box(24, 28, 64, 80), GLASS, 1, ' fill-opacity=".6"') + P(box(72, 32, 64, 76), GLASS, 1, ' fill-opacity=".5"');
      o += circ(34, 22, 5, c) + circ(78, 22, 5, c) + circ(84, 22, 5, c) + circ(126, 22, 5, c);
      break;
  }
  return `<svg viewBox="0 0 160 120" aria-hidden="true" focusable="false">${o}</svg>`;
}
