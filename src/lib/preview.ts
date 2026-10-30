// Vistas previas de producto: dibujos SVG que cambian con la configuración.
// Devuelven markup como string porque se generan a partir de datos internos (sin entrada del usuario).
import type { Cfg, Model } from '@/content/catalog';

const INK = '#1C1C1C';
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const pth = (d: string, fill = 'none', sw = 1.3) =>
  `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;

function hexOf(m: Model, cfg: Cfg): string {
  const a = m.attrs.find((a) => a.color);
  if (!a) return '#CCC';
  const o = a.opts.find((o) => typeof o !== 'string' && o.v === cfg[a.id]);
  const first = a.opts[0];
  return o && typeof o !== 'string' ? o.hex : typeof first !== 'string' ? first.hex : '#CCC';
}

export function previewSVG(m: Model, cfg: Cfg): string {
  const col = hexOf(m, cfg);
  let o = '';
  switch (m.tipo) {
    case 'tile': {
      const [w, h] = ({ '60×60': [30, 30], '60×120': [60, 30], '120×120': [60, 60] } as Record<string, number[]>)[cfg.formato] || [30, 30];
      for (let y = 15; y < 105; y += h) for (let x = 20; x < 140; x += w) o += pth(box(x, y, Math.min(w, 140 - x), Math.min(h, 105 - y)), col, 1);
      if (cfg.term === 'Satinado') o += `<path d="M34 98L128 22" stroke="#fff" stroke-width="7" opacity=".45" stroke-linecap="round"/>`;
      break;
    }
    case 'plank': {
      const len = cfg.formato === '20×180' ? 90 : 60;
      for (let r = 0; r < 9; r++) {
        const y = 15 + r * 10;
        for (let x = 20 - ((r % 3) * len) / 3; x < 140; x += len) {
          const x0 = Math.max(20, x), x1 = Math.min(140, x + len);
          if (x1 > x0) o += pth(box(x0, y, x1 - x0, 10), col, 0.9);
        }
        if (cfg.term === 'Texturado') o += `<path d="M22 ${y + 5}H138" stroke="${INK}" stroke-width=".5" opacity=".35" stroke-dasharray="6 4"/>`;
      }
      break;
    }
    case 'slat': {
      o += pth(box(20, 15, 120, 90), col, 1.3);
      const step = cfg.perfil === 'Ranurado' ? 12 : 40;
      for (let x = 20 + step; x < 140; x += step) o += `<path d="M${x} 15V105" stroke="${INK}" stroke-width="${cfg.perfil === 'Ranurado' ? 1.4 : 0.8}" opacity=".6"/>`;
      break;
    }
    case 'door': case 'door-b': case 'door-v': {
      const w = ({ '70×200': 42, '80×200': 48, '90×210': 54 } as Record<string, number>)[cfg.medida] || 48;
      const h = cfg.medida === '90×210' ? 102 : 96, x = 80 - w / 2, y = 112 - h;
      o += pth(box(x - 4, y - 4, w + 8, h + 4), 'none', 1);
      o += pth(box(x, y, w, h), col, 1.4);
      if (m.tipo === 'door-b') [0.28, 0.5, 0.72].forEach((f) => (o += `<path d="M${x} ${y + h * f}h${w}" stroke="${INK}" stroke-width="1" opacity=".7"/>`));
      if (m.tipo === 'door-v') o += pth(box(80 - 4, y + 10, 8, h * 0.62), '#DCE5E4', 1);
      const hx = cfg.apertura === 'Izquierda' ? x + w - 7 : x + 7;
      o += `<path d="M${hx} ${y + h * 0.5}v8" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      break;
    }
    case 'sink': case 'sink2': {
      o += pth(box(14, 22, 132, 76), '#E6E3DA', 1);
      const dbl = m.tipo === 'sink2';
      const W = dbl
        ? ({ '80×45': 104, '86×50': 112 } as Record<string, number>)[cfg.medida] || 104
        : ({ '50×40': 62, '60×45': 74, '70×45': 86 } as Record<string, number>)[cfg.medida] || 74;
      const x = 80 - W / 2, y = 34, H = 52;
      if (cfg.inst === 'Sobre mesada') o += pth(rr(x - 5, y - 5, W + 10, H + 10, 8), col, 1.1);
      if (dbl) {
        const bw = (W - 8) / 2;
        o += pth(rr(x, y, bw, H, 6), col, 1.3) + pth(rr(x + bw + 8, y, bw, H, 6), col, 1.3);
        o += `<circle cx="${x + bw / 2}" cy="${y + H / 2}" r="3" fill="none" stroke="${INK}"/><circle cx="${x + bw * 1.5 + 8}" cy="${y + H / 2}" r="3" fill="none" stroke="${INK}"/>`;
      } else {
        o += pth(rr(x, y, W, H, 7), col, 1.3) + `<circle cx="80" cy="${y + H / 2}" r="3" fill="none" stroke="${INK}"/>`;
      }
      break;
    }
    case 'faucet': {
      const d = 'M66 104V42Q66 20 90 20H110V32';
      o += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
      o += pth('M52 104h28', 'none', 3) + `<path d="M74 60h14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M74 60h14" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
      if (cfg.pico === 'Extraíble') o += `<path d="M110 36Q118 64 96 92" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>`;
      break;
    }
    case 'faucet-b': {
      o += pth(rr(30, 86, 100, 22, 10), '#F4F2EC', 1.2);
      const top = cfg.altura === 'Alta' ? 26 : 54, d = `M70 88V${top + 10}Q70 ${top} 80 ${top}H98V${top + 8}`;
      o += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
    }
    case 'vanity': {
      const w = ({ '60 cm': 66, '80 cm': 88, '100 cm': 112 } as Record<string, number>)[cfg.medida] || 88, x = 80 - w / 2;
      o += `<path d="M10 14H150" stroke="${INK}" stroke-width=".6" opacity=".35"/>`;
      o += pth(box(x, 54, w, 34), col, 1.4) + pth(rr(x + 8, 46, w - 16, 10, 5), '#F4F2EC', 1.2);
      o += `<path d="M${x + w / 2} 71h0" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${x + w / 2 - 6} 71h12" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
      o += pth(box(x + w / 2 - 22, 18, 44, 22), '#E9EEEE', 1);
      break;
    }
    case 'screen': {
      const w = ({ '80 cm': 58, '100 cm': 74, '120 cm': 92 } as Record<string, number>)[cfg.medida] || 74, x = 80 - w / 2;
      const glass = cfg.vidrio === 'Esmerilado' ? '#E6ECEC' : '#CFE0E0', op = cfg.vidrio === 'Esmerilado' ? 0.95 : 0.55;
      o += `<path d="${box(x, 10, w, 100)}" fill="${glass}" opacity="${op}"/>`;
      o += `<path d="${box(x, 10, w, 100)}" fill="none" stroke="${INK}" stroke-width="5.5"/><path d="${box(x, 10, w, 100)}" fill="none" stroke="${col}" stroke-width="3.5"/>`;
      o += `<path d="M${x + 10} 80L${x + w - 18} 26" stroke="#fff" stroke-width="3" opacity=".8" stroke-linecap="round"/>`;
      o += `<path d="M20 110H140" stroke="${INK}" stroke-width="1.2"/>`;
      break;
    }
  }
  return `<svg viewBox="0 0 160 120" aria-hidden="true" focusable="false">${o}</svg>`;
}
