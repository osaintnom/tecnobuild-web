'use client';
import { Fragment, useRef } from 'react';
import { ScrollTrigger, useGSAP, gsap, MQ_ANIM } from '@/lib/motion';
import Link from 'next/link';
import { HeroBackground } from '@/components/HeroBackground';
import { EtgLink } from '@/components/EtgLink';
import { useI18n } from '@/i18n/I18nProvider';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const { t, href } = useI18n();

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
        <h1 className="hero-title">
          {/* El espacio entre líneas evita que buscadores y lectores de pantalla lean «Construimoscon». */}
          {t.hero.title.map((l, i) => <Fragment key={l}>{i > 0 && ' '}<span className="ln"><span>{l}</span></span></Fragment>)}
        </h1>
        <div className="hero-line" ref={line} aria-hidden="true" />
        <p className="hero-lead">{t.hero.lead}</p>
        <p className="hero-kicker" id="heroKicker">{t.hero.kicker}</p>
        <ul className="hero-cats" aria-labelledby="heroKicker">
          {t.hero.cats.map((c) => <li key={c}>{c}</li>)}<li className="more">{t.hero.more}</li>
        </ul>
        <div className="hero-cta">
          <Link className="btn btn-primary" href={href('catalog')}>{t.common.buildYourProject}</Link>
          <a className="btn btn-text" href="#contacto">{t.common.contactUs}</a>
        </div>
        <p className="hero-sign">TECNO.BUILD by <EtgLink /> &nbsp;·&nbsp; Hong Kong &nbsp;·&nbsp; Shenzhen &nbsp;·&nbsp; Buenos Aires</p>
      </div>
    </section>
  );
}
