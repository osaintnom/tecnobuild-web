'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { familyPath } from '@/i18n/config';
import { CATALOGO, COLOR_HEX, FAMILIAS, RUBROS, type AmbId, type Familia } from '@/content/catalog';
import { useI18n } from '@/i18n/I18nProvider';
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
  const { t: { catalog: t, common, building: tb }, cat: ct, locale } = useI18n();

  // Ordenadas por el nombre que se ve (en inglés, por el nombre traducido)
  const categorias = useMemo(() => [...new Set(FAMILIAS.filter((f) => (!filtro.rubro || f.rubro === filtro.rubro) && (!filtro.ambiente || f.ambiente === filtro.ambiente)).map((f) => f.categoria))].sort((a, b) => ct.categoria(a).localeCompare(ct.categoria(b))), [filtro.rubro, filtro.ambiente, ct]);

  // Coincide por texto (en español y en el idioma activo) o por código; un código de modelo (TB-HN-AL03-60) encuentra su familia (TB-HN-AL03).
  const matches = (f: (typeof FAMILIAS)[number], q: string) => {
    if (!q || q.startsWith(norm(f.codigo))) return true;
    const tr = ct.fam(f);
    return norm(`${f.nombre} ${f.subtitulo ?? ''} ${f.codigo} ${f.categoria} ${f.rubro} ${tr.nombre} ${tr.subtitulo ?? ''} ${ct.categoria(f.categoria)} ${ct.rubro(f.rubro)}`).includes(q);
  };

  const results = useMemo(() => {
    const q = norm(query.trim());
    return FAMILIAS.filter((f) =>
      (!filtro.ambiente || f.ambiente === filtro.ambiente) &&
      (!filtro.rubro || f.rubro === filtro.rubro) &&
      (!filtro.categoria || f.categoria === filtro.categoria) &&
      (!color || f.colores.includes(color)) &&
      (!ancho || f.muebles.includes(Number(ancho))) &&
      matches(f, q));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro, color, ancho, query, ct]);

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
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="h2">{t.title}</h1>
        <p className="lead">{t.lead}</p>
        {CATALOGO.prueba && <p className="b-note">{t.testData(CATALOGO.generado.split('-').reverse().join('/'))}</p>}
      </div>

      <div className="wrap cat-grid">
        <div className="cat-stage">
          <div className="cat-stage-in" onClick={onStageClick}>
            <BuildingSVG ref={bldRef} cat={activeAmb} className="up" />
          </div>
          <p className="b-ind" aria-live="polite">
            {activeAmb ? <><b>{ct.amb(activeAmb).nombre}</b> · {floorsLabel(activeAmb, tb, common.and)}</> : t.stageHint}
          </p>
        </div>

        <div className="cat-main" id="cat-results">
          <div className="cat-tools">
            <div className="cat-chips" role="group" aria-label={t.byTrade}>
              <button type="button" className="cat-chip" aria-pressed={!filtro.rubro} onClick={() => setFiltro({ ambiente: filtro.ambiente })}>
                {t.all}<small>{countBy((f) => !filtro.ambiente || f.ambiente === filtro.ambiente)}</small>
              </button>
              {RUBROS.map((r) => (
                <button key={r} type="button" className="cat-chip" aria-pressed={filtro.rubro === r} onClick={() => setFiltro({ ambiente: filtro.ambiente, rubro: r })}>
                  {ct.rubro(r)}<small>{countBy((f) => f.rubro === r && (!filtro.ambiente || f.ambiente === filtro.ambiente))}</small>
                </button>
              ))}
            </div>
            <div className="cat-row">
              <label className="cat-sel">
                <span>{t.category}</span>
                <select value={filtro.categoria ?? ''} onChange={(e) => setFiltro({ ...filtro, categoria: e.target.value || undefined })}>
                  <option value="">{t.allF}</option>
                  {categorias.map((c) => <option key={c} value={c}>{ct.categoria(c)}</option>)}
                </select>
              </label>
              <label className="cat-sel">
                <span>{t.width}</span>
                <select value={ancho} onChange={(e) => setAncho(e.target.value)}>
                  <option value="">{t.all}</option>
                  {ALL_WIDTHS.map((w) => <option key={w} value={w}>{w} mm</option>)}
                </select>
              </label>
              <label className="cat-search">
                <span>{t.search}</span>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh} />
              </label>
            </div>
            <div className="cat-colors" role="group" aria-label={t.byColor}>
              {ALL_COLORS.map((c) => (
                <button key={c} type="button" className="cat-color" aria-pressed={color === c} title={ct.color(c)} aria-label={ct.color(c)} onClick={() => setColor(color === c ? '' : c)}>
                  <span style={{ background: COLOR_HEX[c] }} />
                </button>
              ))}
              {color && <span className="cat-color-name">{ct.color(color)}</span>}
            </div>
          </div>

          <div className="cat-meta">
            <span>{common.families(results.length)} · {common.models(results.reduce((n, f) => n + f.modelos, 0))} · {common.priceOnRequest}</span>
            {filtro.ambiente && <button type="button" className="cat-pill" onClick={() => setFiltro({ ...filtro, ambiente: undefined })}>{ct.amb(filtro.ambiente).nombre} ×</button>}
            {anyFilter && <button type="button" className="tbtn" onClick={() => { setFiltro({}); setColor(''); setAncho(''); setQuery(''); }}>{t.clear}</button>}
          </div>

          {results.length ? (
            <>
              <ul className="cat-cards">
                {results.slice(0, limit).map((f) => {
                  const k = inSel(f.codigo);
                  const tr = ct.fam(f);
                  return (
                    <li key={f.codigo}>
                      {/* Enlace a la página de la familia (buscadores, abrir en otra pestaña); el clic común abre el configurador. */}
                      <Link className={`pcard${k ? ' in' : ''}`} href={familyPath(locale, f.codigo)} prefetch={false}
                        onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; e.preventDefault(); openConfigurator(f.codigo); }}
                        onMouseEnter={() => highlight(f)} onMouseLeave={() => highlight(null)} onFocus={() => highlight(f)} onBlur={() => highlight(null)}>
                        <ModelPreview className="pcard-pv" familia={f} color={color || undefined} />
                        <span className="pcard-k">{ct.categoria(f.categoria)}</span>
                        <span className="pcard-nm">{tr.nombre}</span>
                        {tr.subtitulo && <span className="pcard-sub">{tr.subtitulo}</span>}
                        <span className="pcard-cd">{f.codigo} · {common.models(f.modelos)}{f.colores.length ? ` · ${common.colors(f.colores.length)}` : ''}</span>
                        {f.colores.length > 0 && (
                          <span className="pcard-sw" aria-hidden="true">{f.colores.slice(0, 6).map((c) => <i key={c} style={{ background: COLOR_HEX[c] ?? '#ccc' }} />)}</span>
                        )}
                        <span className="pcard-st">{k ? t.inQuote(k) : t.configure}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {results.length > limit && (
                <div className="cat-more"><button type="button" className="btn btn-ghost" onClick={() => setLimit((l) => l + PAGE)}>{t.more(results.length - limit)}</button></div>
              )}
            </>
          ) : (
            <div className="cat-empty">
              {enTodo > 0 ? (
                <>
                  <p>{t.notInFilters(query.trim(), enTodo)}</p>
                  <button type="button" className="tbtn" onClick={() => { setFiltro({}); setColor(''); setAncho(''); }}>{t.searchAll}</button>
                </>
              ) : (
                <>
                  <p>{t.none}</p>
                  <button type="button" className="tbtn" onClick={() => { setFiltro({}); setColor(''); setAncho(''); setQuery(''); }}>{t.seeAll}</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

