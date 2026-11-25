'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATALOGO, COLOR_HEX, FAMILIAS, RUBROS, ambById, type AmbId, type Familia } from '@/content/catalog';
import { floorsLabel } from '@/lib/building';
import { useSelection } from '@/state/selection';
import { BuildingSVG } from '@/components/BuildingSVG';
import { ModelPreview } from '@/components/ModelPreview';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PAGE = 24;
const ALL_COLORS = Object.keys(COLOR_HEX).filter((c) => FAMILIAS.some((f) => f.colores.includes(c)));
const ALL_WIDTHS = [...new Set(FAMILIAS.flatMap((f) => f.muebles))].sort((a, b) => a - b);

/**
 * Catálogo real: una tarjeta por familia. El edificio y la grilla están conectados: tocar un elemento
 * del corte filtra esa categoría, la llave de un ambiente filtra el ambiente, y pasar por una tarjeta
 * marca su categoría en el corte. Cada familia se configura hasta un código TB exacto.
 */
export function CatalogView() {
  const { selection, openConfigurator, filtro, setFiltro } = useSelection();
  const [query, setQuery] = useState('');
  const [color, setColor] = useState('');
  const [ancho, setAncho] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const bldRef = useRef<SVGSVGElement>(null);

  const categorias = useMemo(() => [...new Set(FAMILIAS.filter((f) => (!filtro.rubro || f.rubro === filtro.rubro) && (!filtro.ambiente || f.ambiente === filtro.ambiente)).map((f) => f.categoria))].sort(), [filtro.rubro, filtro.ambiente]);

  // Coincide por texto o por código; un código de modelo (TB-HN-AL03-60) encuentra su familia (TB-HN-AL03).
  const matches = (f: (typeof FAMILIAS)[number], q: string) =>
    !q || norm(`${f.nombre} ${f.subtitulo ?? ''} ${f.codigo} ${f.categoria} ${f.rubro}`).includes(q) || q.startsWith(norm(f.codigo));

  const results = useMemo(() => {
    const q = norm(query.trim());
    return FAMILIAS.filter((f) =>
      (!filtro.ambiente || f.ambiente === filtro.ambiente) &&
      (!filtro.rubro || f.rubro === filtro.rubro) &&
      (!filtro.categoria || f.categoria === filtro.categoria) &&
      (!color || f.colores.includes(color)) &&
      (!ancho || f.muebles.includes(Number(ancho))) &&
      matches(f, q));
  }, [filtro, color, ancho, query]);

  // Si la búsqueda no da nada con los filtros puestos, cuántas hay en todo el catálogo
  const enTodo = useMemo(() => {
    const q = norm(query.trim());
    return q ? FAMILIAS.filter((f) => matches(f, q)).length : 0;
  }, [query]);

  useEffect(() => setLimit(PAGE), [filtro, color, ancho, query]);

  // Ambiente encendido en el corte: el filtrado, o el único ambiente de la categoría o rubro elegido
  const activeAmb: AmbId | undefined = useMemo(() => {
    if (filtro.ambiente) return filtro.ambiente;
    if (!filtro.rubro && !filtro.categoria) return undefined;
    const ambs = new Set(results.map((f) => f.ambiente));
    return ambs.size === 1 ? [...ambs][0] : undefined;
  }, [filtro, results]);

  // Categorías con modelos elegidos quedan encendidas en el corte
  useEffect(() => {
    const cats = new Set([...selection.values()].map((s) => FAMILIAS.find((f) => f.codigo === s.familia)?.categoria));
    bldRef.current?.querySelectorAll<SVGGElement>('.hs').forEach((g) => g.classList.toggle('sel', cats.has(g.dataset.catg)));
  }, [selection]);

  function highlight(f: Familia | null) {
    bldRef.current?.querySelectorAll<SVGGElement>('.hs').forEach((g) => g.classList.toggle('hl', !!f && g.dataset.catg === f.categoria));
  }

  function onStageClick(e: React.MouseEvent) {
    const t = e.target as Element;
    const brk = t.closest<SVGElement>('.brk');
    if (brk?.dataset.cat) { setFiltro({ ambiente: brk.dataset.cat as AmbId }); return; }
    const catg = t.closest<SVGElement>('[data-catg]')?.dataset.catg;
    if (catg) {
      const f = FAMILIAS.find((x) => x.categoria === catg);
      setFiltro({ rubro: f?.rubro, categoria: catg });
      document.getElementById('cat-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const countBy = (pred: (f: Familia) => boolean) => FAMILIAS.filter(pred).length;
  const inSel = (fam: string) => [...selection.values()].filter((s) => s.familia === fam).length;
  const anyFilter = filtro.ambiente || filtro.rubro || filtro.categoria || color || ancho || query;

  return (
    <section className="catalog" id="catalogo" data-tone="light">
      <div className="wrap cat-head">
        <p className="eyebrow">Catálogo</p>
        <h1 className="h2">Armá tu obra.</h1>
        <p className="lead">Elegí cada terminación, configurala hasta el modelo exacto y sumala a tu cotización. Tocá el edificio o usá los filtros.</p>
        {CATALOGO.prueba && <p className="b-note">Datos de prueba: el catálogo todavía no está confirmado. Actualizado el {CATALOGO.generado.split('-').reverse().join('/')}.</p>}
      </div>

      <div className="wrap cat-grid">
        <div className="cat-stage">
          <div className="cat-stage-in" onClick={onStageClick}>
            <BuildingSVG ref={bldRef} cat={activeAmb} className="up" />
          </div>
          <p className="b-ind" aria-live="polite">
            {activeAmb ? <><b>{ambById[activeAmb].nombre}</b> · {floorsLabel(activeAmb)}</> : 'Corte · tocá un ambiente o un elemento'}
          </p>
        </div>

        <div className="cat-main" id="cat-results">
          <div className="cat-tools">
            <div className="cat-chips" role="group" aria-label="Filtrar por rubro">
              <button type="button" className="cat-chip" aria-pressed={!filtro.rubro} onClick={() => setFiltro({ ambiente: filtro.ambiente })}>
                Todos<small>{countBy((f) => !filtro.ambiente || f.ambiente === filtro.ambiente)}</small>
              </button>
              {RUBROS.map((r) => (
                <button key={r} type="button" className="cat-chip" aria-pressed={filtro.rubro === r} onClick={() => setFiltro({ ambiente: filtro.ambiente, rubro: r })}>
                  {r}<small>{countBy((f) => f.rubro === r && (!filtro.ambiente || f.ambiente === filtro.ambiente))}</small>
                </button>
              ))}
            </div>
            <div className="cat-row">
              <label className="cat-sel">
                <span>Categoría</span>
                <select value={filtro.categoria ?? ''} onChange={(e) => setFiltro({ ...filtro, categoria: e.target.value || undefined })}>
                  <option value="">Todas</option>
                  {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="cat-sel">
                <span>Ancho de mueble</span>
                <select value={ancho} onChange={(e) => setAncho(e.target.value)}>
                  <option value="">Todos</option>
                  {ALL_WIDTHS.map((w) => <option key={w} value={w}>{w} mm</option>)}
                </select>
              </label>
              <label className="cat-search">
                <span>Buscar</span>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre o código TB" />
              </label>
            </div>
            <div className="cat-colors" role="group" aria-label="Filtrar por color">
              {ALL_COLORS.map((c) => (
                <button key={c} type="button" className="cat-color" aria-pressed={color === c} title={c} aria-label={c} onClick={() => setColor(color === c ? '' : c)}>
                  <span style={{ background: COLOR_HEX[c] }} />
                </button>
              ))}
              {color && <span className="cat-color-name">{color}</span>}
            </div>
          </div>

          <div className="cat-meta">
            <span>{results.length} {results.length === 1 ? 'familia' : 'familias'} · {results.reduce((n, f) => n + f.modelos, 0)} modelos · Precio a cotizar</span>
            {filtro.ambiente && <button type="button" className="cat-pill" onClick={() => setFiltro({ ...filtro, ambiente: undefined })}>{ambById[filtro.ambiente].nombre} ×</button>}
            {anyFilter && <button type="button" className="tbtn" onClick={() => { setFiltro({}); setColor(''); setAncho(''); setQuery(''); }}>Limpiar filtros</button>}
          </div>

          {results.length ? (
            <>
              <ul className="cat-cards">
                {results.slice(0, limit).map((f) => {
                  const k = inSel(f.codigo);
                  return (
                    <li key={f.codigo}>
                      <button type="button" className={`pcard${k ? ' in' : ''}`} onClick={() => openConfigurator(f.codigo)}
                        onMouseEnter={() => highlight(f)} onMouseLeave={() => highlight(null)} onFocus={() => highlight(f)} onBlur={() => highlight(null)}>
                        <ModelPreview className="pcard-pv" familia={f} color={color || undefined} />
                        <span className="pcard-k">{f.categoria}</span>
                        <span className="pcard-nm">{f.nombre}</span>
                        {f.subtitulo && <span className="pcard-sub">{f.subtitulo}</span>}
                        <span className="pcard-cd">{f.codigo} · {f.modelos} {f.modelos === 1 ? 'modelo' : 'modelos'}{f.colores.length ? ` · ${f.colores.length} ${f.colores.length === 1 ? 'color' : 'colores'}` : ''}</span>
                        {f.colores.length > 0 && (
                          <span className="pcard-sw" aria-hidden="true">{f.colores.slice(0, 6).map((c) => <i key={c} style={{ background: COLOR_HEX[c] ?? '#ccc' }} />)}</span>
                        )}
                        <span className="pcard-st">{k ? `✓ ${k} en tu cotización · Agregar otro` : 'Configurar y agregar'}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {results.length > limit && (
                <div className="cat-more"><button type="button" className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE)}>Ver más ({results.length - limit})</button></div>
              )}
            </>
          ) : (
            <div className="cat-empty">
              {enTodo > 0 ? (
                <>
                  <p>“{query.trim()}” no está en los filtros elegidos, pero hay {enTodo} {enTodo === 1 ? 'familia' : 'familias'} en todo el catálogo.</p>
                  <button type="button" className="tbtn" onClick={() => { setFiltro({}); setColor(''); setAncho(''); }}>Buscar en todo el catálogo</button>
                </>
              ) : (
                <>
                  <p>No encontramos familias con esos filtros.</p>
                  <button type="button" className="tbtn" onClick={() => { setFiltro({}); setColor(''); setAncho(''); setQuery(''); }}>Ver todo el catálogo</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

