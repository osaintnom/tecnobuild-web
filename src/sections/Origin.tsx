'use client';
import { useRef } from 'react';
import { ScrollTrigger, useGSAP, gsap, MQ_PIN, MQ_ANIM, clamp } from '@/lib/motion';

const STOPS = [
  { n: '01', place: 'Asia', coord: '', title: 'Fábricas que conocemos', body: 'Visitamos cada fábrica antes de trabajar con ella y probamos muestras antes de comprar en volumen.', img: 'visita a fábrica en Asia' },
  { n: '02', place: 'Hong Kong', coord: '22.32°N 114.17°E', title: 'Búsqueda de fábricas', body: 'Desde Hong Kong buscamos, evaluamos y seleccionamos las fábricas con las que trabajamos.', img: 'evaluación de muestras' },
  { n: '03', place: 'Miami', coord: '25.76°N 80.19°W', title: 'Compras y logística', body: 'Desde Miami coordinamos las compras y la logística hasta que el material llega a la Argentina.', img: 'logística y embarque' },
];

/** Prólogo (fijado y horizontal en desktop) + transición "Llegamos a tu obra". */
export function Origin() {
  const scope = useRef<HTMLDivElement>(null);

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
        const w = Math.min(track.scrollWidth, -tx + vw * 0.6);
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
      <section className="pin origin tone-dark" id="origen" data-tone="dark" data-ch="origen" style={{ '--pin-h': '300vh' } as React.CSSProperties}>
        <div className="pin-stick">
          <div className="origin-track">
            <div className="o-intro">
              <p className="eyebrow">Origen</p>
              <h2 className="h2">Elegimos en origen.</h2>
              <p className="lead">Antes de llegar a tu obra, cada producto hace este recorrido. Lo seguimos de punta a punta.</p>
              <p className="o-sign"><b>Eurotechnologie Group</b>Somos parte de un grupo que importa hace más de diez años.</p>
            </div>
            <div className="o-stops">
              <div className="route" aria-hidden="true"><div className="route-fill" /></div>
              {STOPS.map((s) => (
                <article className="o-stop" key={s.n}>
                  <span className="o-dot" aria-hidden="true" />
                  <p className="coord"><b>{s.n}</b> &nbsp;{s.place}{s.coord && <> &nbsp;·&nbsp; {s.coord}</>}</p>
                  <h3 className="h3">{s.title}</h3>
                  <p>{s.body}</p>
                  <figure className="ph">Imagen pendiente<br />{s.img}</figure>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="arrive" id="llegada" data-tone="dark" data-ch="origen" aria-labelledby="arrTitle">
        <div className="arr-v" aria-hidden="true" />
        <div className="arr-h" aria-hidden="true" />
        <div className="arr-top"><div className="wrap">Hong Kong → Miami → Buenos Aires</div></div>
        <div className="arr-txt">
          <div className="wrap arr-txt-in">
            <p className="coord"><b>04</b> &nbsp;Buenos Aires &nbsp;·&nbsp; 34.60°S 58.38°W</p>
            <h2 className="h2" id="arrTitle">Llegamos a tu obra.</h2>
          </div>
        </div>
      </section>
    </div>
  );
}
