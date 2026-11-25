'use client';
import { useRef } from 'react';
import { ScrollTrigger, useGSAP, gsap, MQ_ANIM } from '@/lib/motion';
import Link from 'next/link';
import { HeroBackground } from '@/components/HeroBackground';
import { EtgLink } from '@/components/EtgLink';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);

  // La línea naranja se estira hacia la derecha hasta salir de pantalla al bajar.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ_ANIM, () => {
      const el = line.current!;
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: () => `+=${ref.current!.offsetHeight * 0.75}`,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const left = el.getBoundingClientRect().left;
          el.style.width = `${120 + progress * Math.max(0, document.documentElement.clientWidth - left - 120 + 4)}px`;
        },
      });
      return () => { st.kill(); el.style.width = ''; };
    });
  }, { scope: ref });

  return (
    <section className="hero tone-dark" id="top" data-tone="dark" ref={ref}>
      <HeroBackground />
      <div className="wrap">
        <p className="eyebrow">Importación de terminaciones para obra</p>
        <h1 className="hero-title">
          <span className="ln"><span>Construimos</span></span>
          <span className="ln"><span>con el mundo.</span></span>
        </h1>
        <div className="hero-line" ref={line} aria-hidden="true" />
        <ul className="hero-cats" aria-label="Qué importamos">
          <li>Pisos y revestimientos</li><li>Puertas</li><li>Cocinas</li><li>Baños</li><li className="more">+ Más</li>
        </ul>
        <div className="hero-cta">
          <Link className="btn btn-primary" href="/catalogo/">Armá tu obra</Link>
          <a className="btn btn-ghost" href="#contacto">Contactanos</a>
        </div>
        <p className="hero-sign">TECNO.BUILD by <EtgLink /> &nbsp;·&nbsp; Hong Kong &nbsp;·&nbsp; Shenzhen &nbsp;·&nbsp; Buenos Aires</p>
      </div>
    </section>
  );
}
