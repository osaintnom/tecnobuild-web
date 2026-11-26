'use client';
import { useRef } from 'react';
import { ScrollTrigger, useGSAP, gsap, MQ_PIN, MQ_ANIM, clamp } from '@/lib/motion';
import { useI18n } from '@/i18n/I18nProvider';

// El recorrido de cada pedido, de la fábrica a la obra, está en el diccionario (origin.stops).
// "estado" es el aviso que recibe el cliente en esa etapa.
/** Prólogo (fijado y horizontal en desktop) + transición "Llegamos a tu obra". */
export function Origin() {
  const scope = useRef<HTMLDivElement>(null);
  const { t: { origin: t } } = useI18n();
  const STOPS = t.stops.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }));

  useGSAP(() => {
    const root = scope.current!;
    const origin = root.querySelector<HTMLElement>('.origin')!;
    const track = root.querySelector<HTMLElement>('.origin-track')!;
    const oStops = root.querySelector<HTMLElement>('.o-stops')!;
    const fill = root.querySelector<HTMLElement>('.route-fill')!;
    const stops = [...root.querySelectorAll<HTMLElement>('.o-stop')];
    const arrive = root.querySelector<HTMLElement>('.arrive')!;
    const mm = gsap.matchMedia();

    // Desktop: el recorrido avanza en horizontal mientras la sección queda fijada.
    mm.add(MQ_PIN, () => {
      const update = (progress: number) => {
        const vw = document.documentElement.clientWidth;
        const tx = -progress * Math.max(0, track.scrollWidth - vw);
        track.style.transform = `translate3d(${tx}px,0,0)`;
        // La línea va al 60 % de la pantalla, pero se asegura de llegar a la última parada
        // al 85 % del tramo: en pantallas anchas la última parada queda más a la derecha que ese 60 %.
        const last = stops[stops.length - 1];
        const lastDot = oStops.offsetLeft + last.offsetLeft + 40;
        const w = Math.min(track.scrollWidth, Math.max(-tx + vw * 0.6, clamp(progress / 0.85) * (lastDot + 24)));
        fill.style.width = `${w}px`;
        stops.forEach((s) => s.classList.toggle('on', oStops.offsetLeft + s.offsetLeft + 40 <= w));
      };
      const st = ScrollTrigger.create({
        trigger: origin,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => update(progress),
        onRefresh: ({ progress }) => update(progress),
      });
      return () => { st.kill(); track.style.transform = ''; fill.style.width = ''; };
    });
    // Mobile o sin movimiento: lista vertical con todas las paradas encendidas.
    mm.add(`not all and ${MQ_PIN}`, () => { stops.forEach((s) => s.classList.add('on')); });

    // Llegada: la línea baja y se vuelve el suelo.
    mm.add(MQ_ANIM, () => {
      const st = ScrollTrigger.create({
        trigger: arrive,
        start: 'top bottom',
        end: () => `+=${arrive.offsetHeight + innerHeight * 0.15}`,
        invalidateOnRefresh: true,
        onUpdate: ({ progress: p }) => {
          arrive.style.setProperty('--pv', clamp(p * 1.7).toFixed(3));
          arrive.style.setProperty('--ph', clamp(p * 1.7 - 0.7).toFixed(3));
        },
      });
      return () => { st.kill(); arrive.style.removeProperty('--pv'); arrive.style.removeProperty('--ph'); };
    });
  }, { scope });

  return (
    <div ref={scope}>
      <section className="pin origin tone-dark" id="origen" data-tone="dark" data-ch="origen" style={{ '--pin-h': '320vh' } as React.CSSProperties}>
        <div className="pin-stick">
          <div className="origin-track">
            <div className="o-intro">
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 className="h2">{t.title}</h2>
              <p className="lead">{t.lead}</p>
              <p className="o-sign"><b>{t.signK}</b>{t.sign}</p>
            </div>
            <div className="o-stops">
              <div className="route" aria-hidden="true"><div className="route-fill" /></div>
              {STOPS.map((s) => (
                <article className="o-stop" key={s.n}>
                  <span className="o-dot" aria-hidden="true" />
                  <p className="coord"><b>{s.n}</b> &nbsp;{s.place}{s.coord && <> &nbsp;·&nbsp; {s.coord}</>}</p>
                  <h3 className="h3">{s.title}</h3>
                  <p>{s.body}</p>
                  <p className="o-state"><i aria-hidden="true" /><span>{t.notice} · <b>{s.estado}</b></span></p>
                  <figure className="ph">{t.imgPending}<br />{s.img}</figure>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="arrive" id="llegada" data-tone="dark" data-ch="origen" aria-labelledby="arrTitle">
        <div className="arr-v" aria-hidden="true" />
        <div className="arr-h" aria-hidden="true" />
        <div className="arr-top"><div className="wrap">{t.arriveTop}</div></div>
        <div className="arr-txt">
          <div className="wrap arr-txt-in">
            <p className="coord"><b>06</b> &nbsp;{t.arrivePlace}</p>
            <h2 className="h2" id="arrTitle">{t.arriveTitle}</h2>
            <p className="arr-sub">{t.arriveSub}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
