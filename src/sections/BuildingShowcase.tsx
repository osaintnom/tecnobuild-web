'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { AMBIENTES, type AmbId } from '@/content/catalog';
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
          <Link className="sc-stage" href="/catalogo/" aria-label="Abrir el catálogo para armar tu obra">
            <BuildingSVG ref={bldRef} className="up" />
          </Link>
          <div className="sc-text">
            <p className="eyebrow">Armá tu obra</p>
            <h2 className="h2">Tu edificio, piso por piso.</h2>
            <p className="lead">En el catálogo elegís cada terminación sobre el corte del edificio, la configurás y la sumás a tu cotización.</p>
            <ul className="sc-cats">
              {AMBIENTES.map((c) => (
                <li key={c.id} className={cat === c.id ? 'on' : undefined}>
                  <span>{c.nombre}</span><small>{floorsLabel(c.id)}</small>
                </li>
              ))}
            </ul>
            <div className="sc-cta">
              <Link className="btn btn-primary" href="/catalogo/">Armá tu cotización</Link>
              <span className="price">Precio a cotizar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
