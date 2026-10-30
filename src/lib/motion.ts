'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

// Tramos fijados y animaciones sincronizadas solo en desktop y sin "reducir movimiento".
export const MQ_PIN = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';
export const MQ_ANIM = '(prefers-reduced-motion: no-preference)';
export const MQ_REDUCED = '(prefers-reduced-motion: reduce)';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const prefersReduced = () => typeof window !== 'undefined' && matchMedia(MQ_REDUCED).matches;
