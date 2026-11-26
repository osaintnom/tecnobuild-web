'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { AMBIENTES, type AmbId } from '@/content/catalog';
import { useI18n } from '@/i18n/I18nProvider';
import { floorsLabel } from '@/lib/building';
import { BuildingSVG } from '@/components/BuildingSVG';
import { ScrollTrigger, useGSAP, gsap, MQ_PIN } from '@/lib/motion';

/**
 * El edificio en quiénes somos: solo para mostrar. Al bajar se arma piso por piso y cada piso
 * aparece con sus productos ya marcados (el último, con glow). Invita a armar la cotización en el
 * catálogo, donde es interactivo.
 */
export function BuildingShowcase() {
  const ref = useRef<HTMLElement>(null);
  const bldRef = useRef<SVGSVGElement>(null);
  const [cat, setCat] = useState<AmbId | undefined>();
  const { t: { showcase: t, common, building: tb }, href, cat: ct } = useI18n();

  useGSAP(() => {
    const floors = [...bldRef.current!.querySelectorAll<SVGGElement>('.fl')];
    const build = (p: number) => {
      // Los pisos se levantan de abajo hacia arriba (la azotea es el último grupo); termina al 85 %
      const k = Math.min(floors.length, Math.floor((p / 0.85) * floors.length + 0.0001));
      floors.forEach((f, i) => { f.classList.toggle('on', i < k); f.classList.toggle('cur', i === k - 1); });
      // La categoría del último piso agregado se marca en la lista
      const room = floors[k - 1]?.querySelector<SVGGElement>('.room');
      setCat((room?.dataset.cat as AmbId | undefined) ?? undefined);
    };
    const mm = gsap.matchMedia();
    mm.add(MQ_PIN, () => {
      bldRef.current!.classList.add('build');
      const st = ScrollTrigger.create({
        trigger: ref.current, start: 'top top', end: 'bottom bottom',
        onUpdate: ({ progress }) => build(progress),
        onRefresh: ({ progress }) => build(progress),
      });
      return () => { st.kill(); bldRef.current?.classList.remove('build'); setCat(undefined); };
    });
  }, { scope: ref });

  return (
    <section className="pin showcase" id="edificio" data-tone="light" data-ch="edificio" style={{ '--pin-h': '200vh' } as React.CSSProperties} ref={ref}>
      <div className="pin-stick">
        <div className="wrap sc-grid">
          <Link className="sc-stage" href={href('catalog')} aria-label={t.stageAria}>
            <BuildingSVG ref={bldRef} className="up" />
          </Link>
          <div className="sc-text">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="h2">{t.title}</h2>
            <p className="lead">{t.lead}</p>
            <ul className="sc-cats">
              {AMBIENTES.map((c) => (
                <li key={c.id} className={cat === c.id ? 'on' : undefined}>
                  <span>{ct.amb(c.id).nombre}</span><small>{floorsLabel(c.id, tb, common.and)}</small>
                </li>
              ))}
            </ul>
            <div className="sc-cta">
              <Link className="btn btn-primary" href={href('catalog')}>{t.cta}</Link>
              <span className="price">{common.priceOnRequest}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
