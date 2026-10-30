'use client';
import type Lenis from 'lenis';
import { prefersReduced } from './motion';

// Instancia única de Lenis (solo desktop). Null en mobile o con "reducir movimiento".
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;

const HDR = 64;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -HDR });
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
}

export function lockScroll(on: boolean) {
  document.documentElement.classList.toggle('locked', on);
  if (on) instance?.stop();
  else instance?.start();
}
