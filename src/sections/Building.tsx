'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATS, MODELS, defaults } from '@/content/catalog';
import { buildingInner, floorsLabel } from '@/lib/building';
import { ScrollTrigger, useGSAP } from '@/lib/motion';
import { useSelection } from '@/state/selection';
import { ModelPreview } from '@/components/ModelPreview';

/** El edificio: corte técnico fijo a la izquierda; al bajar, cada categoría se enciende en todos los pisos. */
export function Building() {
  const ref = useRef<HTMLElement>(null);
  const bldRef = useRef<SVGSVGElement>(null);
  const [level, setLevel] = useState(0);
  const { selection, openConfigurator } = useSelection();
  const svg = useMemo(buildingInner, []);
  const cat = CATS[level - 1];

  useGSAP(() => {
    const panels = [...ref.current!.querySelectorAll<HTMLElement>('.lvl-panel')];
    // Los pisos aparecen uno tras otro la primera vez que el corte entra en pantalla.
    ScrollTrigger.create({ trigger: bldRef.current, start: 'top 90%', once: true, onEnter: () => bldRef.current?.classList.add('up') });
    // Nivel activo = último panel cuyo borde superior pasó el 55 % de la pantalla.
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: () => {
        let a = 0;
        panels.forEach((p, i) => { if (p.getBoundingClientRect().top < innerHeight * 0.55) a = i + 1; });
        setLevel(a);
      },
      onLeaveBack: () => setLevel(0),
    });
  }, { scope: ref });

  // Los productos que ya están en la selección quedan encendidos en el corte.
  useEffect(() => {
    bldRef.current?.querySelectorAll<SVGGElement>('.hs').forEach((g) => g.classList.toggle('sel', selection.has(g.dataset.model ?? '')));
  }, [selection]);

  function onStageClick(e: React.MouseEvent) {
    const hit = (e.target as Element).closest<SVGElement>('[data-model]');
    if (hit?.dataset.model) openConfigurator(hit.dataset.model);
  }

  return (
    <section className="building" id="edificio" data-tone="light" data-ch="edificio" ref={ref}>
      <div className="wrap b-head">
        <p className="eyebrow">El edificio</p>
        <h2 className="h2 rv">Todas las terminaciones del edificio.</h2>
        <p className="lead">Bajá y mirá cada terminación en todos los pisos. Tocá cualquier elemento del corte para configurarlo y sumarlo a tu cotización.</p>
        <p className="b-note">Modelos de ejemplo. El catálogo 2026 se carga en la etapa de contenido.</p>
      </div>
      <div className="wrap b-grid">
        <div className="b-stage">
          <div className="b-stage-in">
            <div className="bld-mount" onClick={onStageClick}>
              <svg
                ref={bldRef}
                className="bld"
                viewBox="-20 100 690 880"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Corte de un edificio de planta baja, siete pisos y azotea. Cada par de pisos muestra una categoría: pisos y revestimientos abajo, después puertas, cocinas y baños arriba."
                data-cat={cat?.id}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
            <p className="b-ind" aria-live="polite">
              {cat ? <><b>{cat.nombre}</b> · {floorsLabel(cat.id)}</> : 'Corte · planta baja, 7 pisos y azotea'}
            </p>
          </div>
        </div>

        <div className="b-levels">
          {CATS.map((c, i) => {
            const next = CATS[i + 1];
            return (
              <article className={`lvl-panel${level === c.nivel ? ' active' : ''}`} id={`nivel-${c.id}`} key={c.id}>
                <p className="lvl-k">{c.nivel} de 4 · {c.lugar}</p>
                <h3 className="h3">{c.nombre}</h3>
                <p className="frase">{c.frase}</p>
                <div className="models">
                  {MODELS.filter((m) => m.cat === c.id).map((m) => {
                    const s = selection.get(m.id);
                    return (
                      <button className={`mcard${s ? ' in' : ''}`} type="button" key={m.id} onClick={() => openConfigurator(m.id)}>
                        <ModelPreview className="thumb" model={m} cfg={s?.cfg ?? defaults(m)} />
                        <span>
                          <span className="nm">{m.nombre}</span>
                          <span className="cd">{m.codigo}</span>
                          <span className="st8">{s ? '✓ En tu cotización · Editar' : 'Configurar'}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="lvl-actions">
                  {next
                    ? <a className="link" href={`#nivel-${next.id}`}>Seguir a {next.nombre.toLowerCase()} ↓</a>
                    : <a className="link" href="#responsable">Seguir ↓</a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
