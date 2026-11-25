'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATS, MODELS, catById, defaults, type CatId, type Model } from '@/content/catalog';
import { floorsLabel } from '@/lib/building';
import { useSelection, type CatFilter } from '@/state/selection';
import { BuildingSVG } from '@/components/BuildingSVG';
import { ModelPreview } from '@/components/ModelPreview';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Plural de la primera palabra de un rótulo: "Color" → "colores", "Terminación" → "terminaciones". */
function plural(label: string) {
  const [w, ...rest] = label.replace(/\s*\(.*\)/, '').toLowerCase().split(' ');
  const p = w.endsWith('ción') ? w.slice(0, -4) + 'ciones' : /[aeiou]$/.test(w) ? w + 's' : w + 'es';
  return [p, ...rest].join(' ');
}

/** Resumen de opciones de un modelo, por ejemplo "3 medidas · 4 colores". */
function optionsSummary(m: Model) {
  return m.attrs.map((a) => `${a.opts.length} ${plural(a.label)}`).join(' · ');
}

/**
 * Catálogo interactivo: el edificio y la grilla están conectados. Filtrar una categoría enciende sus
 * pisos; pasar por una tarjeta marca ese modelo en el corte; tocar el corte abre el configurador.
 */
export function CatalogView() {
  const { selection, openConfigurator, catFilter, setCatFilter } = useSelection();
  const [query, setQuery] = useState('');
  const bldRef = useRef<SVGSVGElement>(null);

  const results = useMemo(() => {
    const q = norm(query.trim());
    return MODELS.filter((m) => (catFilter === 'todas' || m.cat === catFilter) &&
      (!q || norm(`${m.nombre} ${m.codigo} ${catById[m.cat].nombre}`).includes(q)));
  }, [catFilter, query]);

  // Los modelos ya elegidos quedan encendidos en el corte
  useEffect(() => {
    bldRef.current?.querySelectorAll<SVGGElement>('.hs').forEach((g) => g.classList.toggle('sel', selection.has(g.dataset.model ?? '')));
  }, [selection]);

  function highlight(id: string | null) {
    bldRef.current?.querySelectorAll<SVGGElement>('.hs').forEach((g) => g.classList.toggle('hl', !!id && g.dataset.model === id));
  }

  function onStageClick(e: React.MouseEvent) {
    const t = e.target as Element;
    const brk = t.closest<SVGElement>('.brk');
    if (brk?.dataset.cat) { setCatFilter(brk.dataset.cat as CatId); return; }
    const hit = t.closest<SVGElement>('[data-model]');
    if (hit?.dataset.model) openConfigurator(hit.dataset.model);
  }

  const active = catFilter === 'todas' ? undefined : catFilter;
  const chips: [CatFilter, string, number][] = [
    ['todas', 'Todas', MODELS.length],
    ...CATS.map((c) => [c.id, c.nombre, MODELS.filter((m) => m.cat === c.id).length] as [CatFilter, string, number]),
  ];

  return (
    <section className="catalog" id="catalogo" data-tone="light">
      <div className="wrap cat-head">
        <p className="eyebrow">Catálogo</p>
        <h1 className="h2">Armá tu obra.</h1>
        <p className="lead">Elegí cada terminación, configurala y sumala a tu cotización. Tocá el edificio o filtrá por categoría.</p>
        <p className="b-note">Modelos de ejemplo. El catálogo 2026 se carga en la etapa de contenido.</p>
      </div>

      <div className="wrap cat-grid">
        <div className="cat-stage">
          <div className="cat-stage-in" onClick={onStageClick}>
            <BuildingSVG ref={bldRef} cat={active} className="up" />
          </div>
          <p className="b-ind" aria-live="polite">
            {active ? <><b>{catById[active].nombre}</b> · {floorsLabel(active)}</> : 'Corte · tocá una categoría o un producto'}
          </p>
        </div>

        <div className="cat-main">
          <div className="cat-tools">
            <div className="cat-chips" role="group" aria-label="Filtrar por categoría">
              {chips.map(([id, label, n]) => (
                <button key={id} type="button" className="cat-chip" aria-pressed={catFilter === id} onClick={() => setCatFilter(id)}>
                  {label}<small>{n}</small>
                </button>
              ))}
            </div>
            <label className="cat-search">
              <span className="sr">Buscar en el catálogo</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar modelo o código" />
            </label>
          </div>

          <p className="cat-meta">{results.length} {results.length === 1 ? 'modelo' : 'modelos'} · Precio a cotizar</p>

          {results.length ? (
            <ul className="cat-cards">
              {results.map((m) => {
                const s = selection.get(m.id);
                return (
                  <li key={m.id}>
                    <button type="button" className={`pcard${s ? ' in' : ''}`} onClick={() => openConfigurator(m.id)}
                      onMouseEnter={() => highlight(m.id)} onMouseLeave={() => highlight(null)} onFocus={() => highlight(m.id)} onBlur={() => highlight(null)}>
                      <ModelPreview className="pcard-pv" model={m} cfg={s?.cfg ?? defaults(m)} />
                      <span className="pcard-k">{catById[m.cat].nombre}</span>
                      <span className="pcard-nm">{m.nombre}</span>
                      <span className="pcard-cd">{m.codigo} · {optionsSummary(m)}</span>
                      <span className="pcard-st">{s ? '✓ En tu cotización · Editar' : 'Configurar y agregar'}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="cat-empty">
              <p>No encontramos modelos con esa búsqueda.</p>
              <button type="button" className="tbtn" onClick={() => { setQuery(''); setCatFilter('todas'); }}>Ver todo el catálogo</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
