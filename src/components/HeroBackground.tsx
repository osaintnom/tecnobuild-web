'use client';
import { useEffect, useRef } from 'react';

/**
 * Fondo interactivo del hero: grilla de puntos con un flujo lento constante y la palabra TECNO.BUILD
 * muy difuminada. Donde pasa el cursor la palabra se enfoca y sube de opacidad, los puntos se
 * encienden en naranja y se vuelven caracteres de cota. Adaptado de un "code background" en canvas,
 * con la paleta de la marca y menos movimiento.
 */

const TAU = Math.PI * 2;
const GLYPHS = Array.from('TECNOBUILD0123456789+−×=/°·');
const DOT = [173, 173, 168];   // gris cálido
const HOT = [232, 132, 60];    // naranja (texto sobre carbón)
const BONE = [250, 250, 245];  // hueso
const NB = 14;                 // grupos de opacidad para dibujar los puntos en lote

const sstep = (e0: number, e1: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return k * k * (3 - 2 * k);
};
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

export function HeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current, host = root?.parentElement;
    if (!root || !canvas || !host) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches;
    let w = 0, h = 0, N = 0, spacing = 24, dotR = 1, R = 180, font = '11px monospace';
    let bx = new Float32Array(0), by = new Float32Array(0), seed = new Float32Array(0);
    let glyph = new Uint8Array(0), nextSwap = new Float32Array(0), lit = new Float32Array(0);
    let buckets: Uint16Array[] = [];
    const bCount = new Int32Array(NB);

    const ptr = { tx: 0, ty: 0, x: 0, y: 0, active: false, first: true };
    let presence = 0, t = 0, last = performance.now(), raf = 0, visible = true, touchTimer = 0;

    // La palabra ocupa el 94 % del ancho del hero, sin cortarse, en cualquier pantalla.
    function fitWord() {
      root!.querySelectorAll<HTMLElement>('.hb-word').forEach((el) => {
        el.style.fontSize = '100px';
        el.style.fontSize = `${(100 * host!.clientWidth * 0.94) / el.scrollWidth}px`;
      });
    }

    function build() {
      fitWord();
      const r = host!.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = Math.min(w, h) < 640;
      spacing = small ? 20 : 24;
      dotR = small ? 0.9 : 1;
      R = Math.min(220, Math.max(130, Math.min(w, h) * 0.22)) * (coarse ? 0.85 : 1);
      // next/font deja la familia real en --font-plex-mono (sobre <html>)
      const mono = getComputedStyle(document.documentElement).getPropertyValue('--font-plex-mono').trim();
      font = `500 ${Math.round(spacing * 0.5)}px ${mono ? mono + ',' : ''}ui-monospace,monospace`;
      const cols = Math.max(1, Math.floor(w / spacing)), rows = Math.max(1, Math.floor(h / spacing));
      const ox = (w % spacing) / 2 + spacing / 2, oy = (h % spacing) / 2 + spacing / 2;
      N = cols * rows;
      bx = new Float32Array(N); by = new Float32Array(N); seed = new Float32Array(N);
      glyph = new Uint8Array(N); nextSwap = new Float32Array(N); lit = new Float32Array(N);
      buckets = Array.from({ length: NB }, () => new Uint16Array(N));
      let i = 0;
      for (let r2 = 0; r2 < rows; r2++) for (let c = 0; c < cols; c++, i++) {
        bx[i] = ox + c * spacing; by[i] = oy + r2 * spacing;
        seed[i] = Math.random(); glyph[i] = (Math.random() * GLYPHS.length) | 0; nextSwap[i] = Math.random() * 2;
      }
    }

    // Flujo constante: dos ondas lentas que se cruzan, como un líquido que respira.
    const flow = (x: number, y: number, tt: number) =>
      0.5 + 0.5 * Math.sin(x * 0.0045 - tt * 0.22 + Math.sin(y * 0.006 + tt * 0.15) * 1.6);

    function draw(dt: number) {
      presence += ((ptr.active ? 1 : 0) - presence) * (1 - Math.exp(-dt * (ptr.active ? 6 : 3)));
      const k = 1 - Math.exp(-dt * 14);
      ptr.x += (ptr.tx - ptr.x) * k; ptr.y += (ptr.ty - ptr.y) * k;
      const cx = ptr.x, cy = ptr.y, Re = R * (1 - Math.pow(1 - presence, 3));

      // La palabra sigue al cursor con una máscara (variables CSS).
      root!.style.setProperty('--mx', `${cx}px`);
      root!.style.setProperty('--my', `${cy}px`);
      root!.style.setProperty('--ml', presence.toFixed(3));

      ctx!.clearRect(0, 0, w, h);

      // Halo naranja bajo el cursor
      if (presence > 0.01) {
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Re * 1.6);
        g.addColorStop(0, `rgba(${HOT},${0.13 * presence})`);
        g.addColorStop(0.5, `rgba(${HOT},${0.05 * presence})`);
        g.addColorStop(1, `rgba(${HOT},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(cx - Re * 1.6, cy - Re * 1.6, Re * 3.2, Re * 3.2);
      }

      bCount.fill(0);
      const glyphs: number[] = [];
      const kIn = 1 - Math.exp(-dt * 10), kOut = 1 - Math.exp(-dt * 3);
      const amp = reduce ? 0 : 2.2;

      for (let i = 0; i < N; i++) {
        const dx = bx[i] - cx, dy = by[i] - cy;
        const d = presence > 0.01 && Math.abs(dx) < Re * 1.5 && Math.abs(dy) < Re * 1.5 ? Math.hypot(dx, dy) : 1e9;
        const target = d < Re ? sstep(Re, Re * 0.35, d) * presence : 0;
        lit[i] += (target - lit[i]) * (target > lit[i] ? kIn : kOut);
        const f = reduce ? 0.5 : flow(bx[i], by[i], t);
        const a = 0.07 + 0.11 * f + (d < Re * 1.5 ? 0.14 * sstep(Re * 1.5, Re * 0.6, d) * presence : 0);

        if (lit[i] > 0.3) {
          // Dentro del halo: carácter de cota que cambia despacio
          if (!reduce && t >= nextSwap[i]) { glyph[i] = (Math.random() * GLYPHS.length) | 0; nextSwap[i] = t + 0.7 + Math.random() * 1.6; }
          glyphs.push(i);
          continue;
        }
        let b = (a * 40) | 0;
        if (b > NB - 1) b = NB - 1;
        buckets[b][bCount[b]++] = i;
      }

      // Puntos en reposo, en lotes por opacidad, con un leve vaivén del flujo
      ctx!.fillStyle = `rgb(${DOT})`;
      for (let b = 0; b < NB; b++) {
        const c = bCount[b];
        if (!c) continue;
        ctx!.globalAlpha = (b + 0.5) / 40;
        ctx!.beginPath();
        const arr = buckets[b];
        for (let j = 0; j < c; j++) {
          const i = arr[j];
          const x = bx[i] + amp * Math.sin(t * 0.35 + by[i] * 0.012);
          const y = by[i] + amp * Math.cos(t * 0.3 + bx[i] * 0.01);
          ctx!.moveTo(x + dotR, y);
          ctx!.arc(x, y, dotR, 0, TAU);
        }
        ctx!.fill();
      }

      // Caracteres encendidos
      if (glyphs.length) {
        ctx!.font = font;
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        for (const i of glyphs) {
          const l = lit[i];
          ctx!.globalAlpha = Math.min(1, 0.1 + l * 0.7);
          ctx!.fillStyle = `rgb(${seed[i] < 0.75 ? mix(DOT, HOT, l) : mix(DOT, BONE, l)})`;
          ctx!.fillText(GLYPHS[glyph[i]], bx[i], by[i]);
        }
      }
      ctx!.globalAlpha = 1;
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now; t += dt;
      draw(dt);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    // Con "reducir movimiento" solo se redibuja cuando cambia algo (cursor o tamaño).
    const redraw = () => { if (reduce) requestAnimationFrame(() => { presence = ptr.active ? 1 : 0; ptr.x = ptr.tx; ptr.y = ptr.ty; draw(1); }); else start(); };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      ptr.tx = e.clientX - r.left; ptr.ty = e.clientY - r.top;
      if (ptr.first || presence < 0.02) { ptr.x = ptr.tx; ptr.y = ptr.ty; ptr.first = false; }
      ptr.active = true;
      clearTimeout(touchTimer);
      redraw();
    };
    const onLeave = () => { ptr.active = false; redraw(); };
    const onUp = (e: PointerEvent) => { if (e.pointerType === 'touch') { clearTimeout(touchTimer); touchTimer = window.setTimeout(onLeave, 900); } };

    // Solo anima mientras el hero está en pantalla.
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { build(); redraw(); });
    ro.observe(host);
    const onVis = () => { if (!document.hidden) start(); };

    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerdown', onMove, { passive: true });
    host.addEventListener('pointerup', onUp, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    build();
    if (reduce) redraw(); else start();
    document.fonts?.ready.then(() => { build(); redraw(); });

    return () => {
      cancelAnimationFrame(raf); clearTimeout(touchTimer); io.disconnect(); ro.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onMove);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="hb" ref={rootRef} aria-hidden="true">
      <canvas className="hb-canvas" ref={canvasRef} />
      <div className="hb-word hb-word-blur">TECNO<span>.</span>BUILD</div>
      <div className="hb-word hb-word-lit">TECNO<span>.</span>BUILD</div>
      <div className="hb-fade" />
    </div>
  );
}
