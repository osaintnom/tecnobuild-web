'use client';
import { useRef, useState } from 'react';
import { CATS } from '@/content/catalog';
import { ScrollTrigger, useGSAP, gsap, MQ_PIN, clamp, easeInOut } from '@/lib/motion';

const CY = 180, YS = [60, 140, 220, 300];

/** Un solo responsable: cuatro líneas de proveedores convergen en una línea naranja. */
export function Responsible() {
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [merged, setMerged] = useState(true);

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
            <p className="eyebrow">Un solo responsable</p>
            <h2 className="h2">Cuatro categorías. Un solo responsable.</h2>
            <div className="contrast">
              <div className="c-many">
                <h3>Con varios proveedores</h3>
                <ul><li>4 cotizaciones</li><li>4 plazos de entrega</li><li>4 equipos de instalación</li><li>Nadie responde por el conjunto</li></ul>
              </div>
              <div className="c-one">
                <h3>Con TECNO.BUILD</h3>
                <ul><li>1 cotización</li><li>1 plan de entrega</li><li>Instalación incluida</li><li>Un responsable de punta a punta</li></ul>
              </div>
            </div>
            <p className="r-price">Y como compramos en origen, la relación entre precio y calidad juega a favor de tu obra.</p>
          </div>
          <div className="r-fig">
            <svg ref={svgRef} className="conv" viewBox="0 0 640 360" role="img"
              aria-label="Cuatro líneas, una por categoría, que van a cuatro proveedores distintos y se unen en una sola línea naranja: TECNO.BUILD.">
              {CATS.map((c, i) => (
                <g key={c.id}>
                  <text className="cat" x="0" y={YS[i] + 5}>{c.corto}</text>
                  <circle cx="168" cy={YS[i]} r="3.5" fill="#ADADA8" />
                  <path className="gl" id={`cv${i}`} />
                  <circle id={`ce${i}`} cx="470" r="3.5" fill="#ADADA8" />
                  <text className="prov" id={`cp${i}`} x="482" y={YS[i] + 4}>Proveedor {i + 1}</text>
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
