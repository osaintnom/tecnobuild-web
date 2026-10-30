'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, MQ_PIN, MQ_REDUCED } from '@/lib/motion';
import { setLenis } from '@/lib/smooth';

const MQ_WIDE = '(min-width: 900px)';

/**
 * Modos globales y scroll suave:
 * - html.pin-on → tramos fijados (desktop sin "reducir movimiento")
 * - html.anim   → animaciones habilitadas
 * - Lenis en desktop, sincronizado con ScrollTrigger.
 * El script inline del layout aplica las clases antes del primer pintado.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const mqReduce = matchMedia(MQ_REDUCED), mqPin = matchMedia(MQ_PIN), mqWide = matchMedia(MQ_WIDE);
    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);

    function apply() {
      root.classList.toggle('pin-on', mqPin.matches);
      root.classList.toggle('anim', !mqReduce.matches);
      const wantLenis = mqWide.matches && !mqReduce.matches;
      if (wantLenis && !lenis) {
        lenis = new Lenis({ anchors: { offset: -64 } });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        setLenis(lenis);
      } else if (!wantLenis && lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenis = null;
        setLenis(null);
      }
      ScrollTrigger.refresh();
    }
    apply();
    [mqReduce, mqPin, mqWide].forEach((m) => m.addEventListener('change', apply));
    // Las fuentes cambian alturas: recalcular los tramos cuando terminan de cargar.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      [mqReduce, mqPin, mqWide].forEach((m) => m.removeEventListener('change', apply));
      gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
