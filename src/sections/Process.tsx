'use client';
import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP, gsap, MQ_ANIM } from '@/lib/motion';

const STEPS = [
  { title: 'Consulta', body: 'Nos contás la obra y qué terminaciones necesitás. Si ya armaste tu selección en esta página, partimos de ahí.', who: 'equipo comercial, Buenos Aires' },
  { title: 'Selección', body: 'Te proponemos modelos de fábricas que ya visitamos y cuyas muestras probamos. Definimos variantes y cotizamos producto e instalación.', who: 'búsqueda de fábricas, Hong Kong' },
  { title: 'Importación', body: 'Compramos en origen y coordinamos producción, compras y logística hasta la Argentina.', who: 'compras y logística, Miami' },
  { title: 'Entrega', body: 'El material llega a tu obra según el plan de entrega que acordamos para cada etapa.', who: 'Buenos Aires' },
  { title: 'Instalación', body: 'Nos hacemos cargo de la instalación. Si algo no queda bien, nos llamás a nosotros.', who: 'Buenos Aires' },
];

/** Cómo trabajamos: el eje naranja avanza con la lectura y enciende cada paso. */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [on, setOn] = useState(STEPS.length);

  useGSAP(() => {
    const list = listRef.current!;
    const items = [...list.querySelectorAll<HTMLElement>('.step')];
    const mm = gsap.matchMedia();
    mm.add(MQ_ANIM, () => {
      const update = (p: number) => {
        list.style.setProperty('--pp', p.toFixed(3));
        const h = list.offsetHeight;
        setOn(items.filter((s) => s.offsetTop + 34 <= p * h + 2).length);
      };
      const st = ScrollTrigger.create({
        trigger: list, start: 'top 62%', end: 'bottom 62%',
        onUpdate: ({ progress }) => update(progress),
      });
      update(st.progress);
      return () => { st.kill(); list.style.removeProperty('--pp'); setOn(STEPS.length); };
    });
  }, { scope: ref });

  return (
    <section className="process" id="proceso" data-tone="light" data-ch="proceso" ref={ref}>
      <div className="wrap p-grid">
        <div className="p-head">
          <p className="eyebrow">Cómo trabajamos</p>
          <h2 className="h2 rv">De la consulta a la obra.</h2>
          <p className="lead">Cinco pasos, siempre con el mismo interlocutor.</p>
        </div>
        <div>
          <ol className="steps" ref={listRef}>
            <span className="axis" aria-hidden="true"><i /></span>
            {STEPS.map((s, i) => (
              <li className={`step${i < on ? ' on' : ''}`} key={s.title}>
                <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.body}</p>
                <div className="meta"><span>Lo sigue: <b>{s.who}</b></span><span>Plazo típico: a definir</span></div>
              </li>
            ))}
          </ol>
          <p className="p-cta"><a className="link" href="#cotizar">Empezá por una consulta →</a></p>
        </div>
      </div>
    </section>
  );
}
