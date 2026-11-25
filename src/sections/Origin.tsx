'use client';
import { useRef } from 'react';
import { ScrollTrigger, useGSAP, gsap, MQ_PIN, MQ_ANIM, clamp } from '@/lib/motion';

// El recorrido de cada pedido, de la fábrica a la obra. "estado" es el aviso que recibe el cliente en esa etapa.
const STOPS = [
  { n: '01', place: 'Hong Kong', coord: '22.32°N 114.17°E', title: 'Búsqueda de fábricas', body: 'Buscamos y evaluamos fábricas para cada terminación. Probamos muestras antes de comprar en volumen.', estado: 'Muestras aprobadas', img: 'evaluación de muestras' },
  { n: '02', place: 'Shenzhen, China', coord: '22.54°N 114.06°E', title: 'Producción', body: 'Muchas de las fábricas con las que trabajamos están en Shenzhen. Las visitamos y coordinamos con cada una la producción de tu pedido.', estado: 'En producción', img: 'zona de fábricas, Shenzhen' },
  { n: '03', place: 'Puerto de origen', coord: 'China', title: 'Embarque', body: 'Coordinamos la carga y el embarque. El material viaja directo de la fábrica a la Argentina.', estado: 'Embarcado', img: 'carga del contenedor' },
  { n: '04', place: 'En tránsito', coord: 'Océano', title: 'Seguimiento', body: 'Seguimos el envío durante todo el viaje. Tenés un solo contacto que te dice en qué etapa está tu material.', estado: 'En tránsito', img: 'ruta marítima' },
  { n: '05', place: 'Buenos Aires', coord: '34.60°S 58.38°W', title: 'Importación y despacho', body: 'Nos ocupamos de la importación y de los trámites de aduana. Vos no hacés trámites.', estado: 'Despachado', img: 'despacho en destino' },
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
              <p className="eyebrow">Origen</p>
              <h2 className="h2">De la fábrica a tu obra.</h2>
              <p className="lead">Cada pedido hace este recorrido. Lo seguimos etapa por etapa y te avisamos en cada una.</p>
              <p className="o-sign"><b>Seguimiento</b>Un solo contacto para todo el recorrido: sabés siempre dónde está tu material.</p>
            </div>
            <div className="o-stops">
              <div className="route" aria-hidden="true"><div className="route-fill" /></div>
              {STOPS.map((s) => (
                <article className="o-stop" key={s.n}>
                  <span className="o-dot" aria-hidden="true" />
                  <p className="coord"><b>{s.n}</b> &nbsp;{s.place}{s.coord && <> &nbsp;·&nbsp; {s.coord}</>}</p>
                  <h3 className="h3">{s.title}</h3>
                  <p>{s.body}</p>
                  <p className="o-state"><i aria-hidden="true" /><span>Aviso al cliente · <b>{s.estado}</b></span></p>
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
        <div className="arr-top"><div className="wrap">Hong Kong → Shenzhen → Buenos Aires · directo de fábrica</div></div>
        <div className="arr-txt">
          <div className="wrap arr-txt-in">
            <p className="coord"><b>06</b> &nbsp;Tu obra &nbsp;·&nbsp; AMBA</p>
            <h2 className="h2" id="arrTitle">Llegamos a tu obra.</h2>
            <p className="arr-sub">Entregamos según el plan acordado y nos hacemos cargo de la instalación.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
