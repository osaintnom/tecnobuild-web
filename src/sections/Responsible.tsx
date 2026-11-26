'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { ScrollTrigger, useGSAP, gsap, MQ_PIN, clamp, easeInOut } from '@/lib/motion';
import { useI18n } from '@/i18n/I18nProvider';

// Una línea por categoría, más una por "todo lo demás" (responsible.lines): todas convergen en TECNO.BUILD.
const CY = 180, YS = [40, 110, 180, 250, 320];

/** Un solo responsable: cuatro líneas de proveedores convergen en una línea naranja. */
export function Responsible() {
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [merged, setMerged] = useState(true);
  const { t: { responsible: t, common }, href } = useI18n();
  const LINES = t.lines;

  useGSAP(() => {
    const svg = svgRef.current!;
    const lines = YS.map((_, i) => [svg.querySelector(`#cv${i}`)!, svg.querySelector(`#ce${i}`)!, svg.querySelector(`#cp${i}`)!]);
    const one = svg.querySelector<SVGPathElement>('#cvo')!, tb = svg.querySelector('#cvt')!;

    function draw(p: number) {
      const e = easeInOut(p);
      YS.forEach((y0, i) => {
        const ye = y0 + (CY - y0) * e;
        lines[i][0].setAttribute('d', `M168 ${y0}C320 ${y0} 320 ${ye} 470 ${ye}`);
        lines[i][1].setAttribute('cy', String(ye));
        lines[i][2].setAttribute('opacity', (1 - clamp(p * 1.7)).toFixed(3));
      });
      one.style.strokeDashoffset = (1 - clamp((p - 0.55) / 0.35)).toFixed(3);
      tb.setAttribute('opacity', clamp((p - 0.7) / 0.3).toFixed(3));
      setMerged(p > 0.6);
    }

    draw(1);
    const mm = gsap.matchMedia();
    // Desktop: la convergencia se dibuja mientras la sección queda fijada.
    mm.add(MQ_PIN, () => {
      const st = ScrollTrigger.create({
        trigger: ref.current, start: 'top top', end: 'bottom bottom',
        onUpdate: ({ progress }) => draw(clamp((progress - 0.06) / 0.72)),
      });
      return () => { st.kill(); draw(1); };
    });
    // Mobile: se dibuja al cruzar la pantalla, sin fijar.
    mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: svg, start: 'top 85%', end: 'top 35%',
        onUpdate: ({ progress }) => draw(progress),
      });
      draw(st.progress);
      return () => { st.kill(); draw(1); };
    });
  }, { scope: ref });

  return (
    <section className={`pin resp${merged ? ' merged' : ''}`} id="responsable" data-tone="light" data-ch="responsable" style={{ '--pin-h': '220vh' } as React.CSSProperties} ref={ref}>
      <div className="pin-stick">
        <div className="wrap r-grid">
          <div className="r-text">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="h2">{t.title}</h2>
            <div className="contrast">
              <div className="c-many">
                <h3>{t.manyTitle}</h3>
                <ul>{t.many.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="c-one">
                <h3>{t.oneTitle}</h3>
                <ul>{t.one.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            </div>
            <p className="r-price">{t.price}</p>
            <div className="r-cta">
              <Link className="btn btn-primary" href={href('catalog')}>{common.buildYourProject}</Link>
              <a className="btn btn-text" href="#contacto">{common.contactUs}</a>
            </div>
          </div>
          <div className="r-fig">
            <svg ref={svgRef} className="conv" viewBox="0 0 640 360" role="img"
              aria-label={t.figAria}>
              {LINES.map((label, i) => (
                <g key={label} className={i === LINES.length - 1 ? 'more' : undefined}>
                  <text className="cat" x="0" y={YS[i] + 5}>{label}</text>
                  <circle cx="168" cy={YS[i]} r="3.5" fill="#ADADA8" />
                  <path className="gl" id={`cv${i}`} />
                  <circle id={`ce${i}`} cx="470" r="3.5" fill="#ADADA8" />
                  <text className="prov" id={`cp${i}`} x="482" y={YS[i] + 4}>{t.supplier(i + 1)}</text>
                </g>
              ))}
              <path className="ol" id="cvo" d={`M470 ${CY}H636`} pathLength={1} />
              <text className="tb" id="cvt" x="553" y={CY - 16} textAnchor="middle">TECNO.BUILD</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
