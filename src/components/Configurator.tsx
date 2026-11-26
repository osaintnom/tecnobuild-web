'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COLOR_HEX, cargarModelos, describir, famById, type Modelo } from '@/content/catalog';
import { useSelection } from '@/state/selection';
import { prefersReduced } from '@/lib/motion';
import { useI18n } from '@/i18n/I18nProvider';
import { Sheet } from './Sheet';
import { ModelPreview } from './ModelPreview';

type Attr = 'niveles' | 'color' | 'variante';
const ATTRS: [Attr][] = [['niveles'], ['color'], ['variante']];
type Pick = Partial<Record<Attr, string>>;
const val = (m: Modelo, a: Attr) => (m[a] == null ? undefined : String(m[a]));
const dims = (m?: Modelo) => (m?.dim ? `${m.dim.map((d) => d ?? '—').join(' × ')} mm` : undefined);

/**
 * Configurador de una familia: medida o modelo → opciones de esa medida (niveles, color, variante) →
 * nota libre → "Agregar a mi cotización". El resultado es un código TB real. Sin precios ni cantidades.
 */
export function Configurator() {
  const { cfgFamilia, cfgCodigo, closeConfigurator, selection, upsert, pulse, setSummaryOpen } = useSelection();
  const fam = cfgFamilia ? famById[cfgFamilia] : undefined;
  const { t: { configurator: t, common }, cat: ct } = useI18n();
  const famTr = fam ? ct.fam(fam) : undefined;
  const [modelos, setModelos] = useState<Modelo[] | null>(null);
  const [error, setError] = useState(false);
  const [base, setBase] = useState<string | null>(null);
  const [pick, setPick] = useState<Pick>({});
  const [nota, setNota] = useState('');
  const [query, setQuery] = useState('');
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);

  // Al abrir: cargar los modelos y preseleccionar (el modelo a editar o el primero)
  useEffect(() => {
    if (!cfgFamilia) return;
    setModelos(null); setError(false); setDone(false); setQuery('');
    bodyRef.current?.scrollTo(0, 0);
    let alive = true;
    cargarModelos(cfgFamilia).then((ms) => {
      if (!alive) return;
      setModelos(ms);
      const m = ms.find((x) => x.codigo === cfgCodigo) ?? ms[0];
      setBase(m.base);
      setPick(Object.fromEntries(ATTRS.map(([a]) => [a, val(m, a)])));
      setNota((cfgCodigo && selection.get(cfgCodigo)?.nota) || '');
    }).catch(() => alive && setError(true));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfgFamilia, cfgCodigo]);

  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  // Medidas / modelos de la familia (un "código base" puede tener varias variantes)
  const bases = useMemo(() => {
    const seen = new Map<string, Modelo[]>();
    modelos?.forEach((m) => seen.set(m.base, [...(seen.get(m.base) ?? []), m]));
    return [...seen.entries()];
  }, [modelos]);
  const q = query.trim().toLowerCase();
  const shownBases = q ? bases.filter(([b, ms]) => `${b} ${ms[0].medida ?? ''} ${ms[0].detalle ?? ''}`.toLowerCase().includes(q)) : bases;
  const variants = bases.find(([b]) => b === base)?.[1] ?? [];

  // Opciones que cambian dentro de la medida elegida, y cuáles están disponibles con lo ya elegido
  const options = ATTRS.map(([a]) => ({ a, label: t.attrs[a], vals: [...new Set(variants.map((m) => val(m, a)).filter(Boolean))] as string[] }))
    .filter((o) => o.vals.length > 0);
  const available = (a: Attr, v: string) => variants.some((m) => val(m, a) === v && ATTRS.every(([b]) => b === a || !pick[b] || val(m, b) === pick[b]));
  const model = variants.find((m) => ATTRS.every(([a]) => !pick[a] || val(m, a) === pick[a])) ?? variants[0];

  function chooseBase(b: string) {
    const first = bases.find(([x]) => x === b)?.[1][0];
    setBase(b);
    if (first) setPick(Object.fromEntries(ATTRS.map(([a]) => [a, val(first, a)])));
    setDone(false);
  }
  function choose(a: Attr, v: string) {
    // Si la combinación no existe, se toma la primera variante que tenga ese valor
    const next = { ...pick, [a]: v };
    const exact = variants.find((m) => ATTRS.every(([b]) => !next[b] || val(m, b) === next[b]));
    const fallback = variants.find((m) => val(m, a) === v);
    setPick(exact ? next : Object.fromEntries(ATTRS.map(([b]) => [b, fallback ? val(fallback, b) : undefined])));
    setDone(false);
  }

  function add() {
    if (!fam || !model) return;
    upsert({ codigo: model.codigo, familia: fam.codigo, nombre: famTr!.nombre, detalle: describir(model, common.levels, ct.color), ambiente: fam.ambiente, nota: nota.trim() });
    fly();
    setDone(true);
  }

  // Un punto naranja vuela del botón al contador "Tu selección".
  function fly() {
    const from = addRef.current, to = document.getElementById('selCount'), dlg = from?.closest('dialog');
    if (!from || !to || !dlg || prefersReduced()) { pulse(); return; }
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    if (!b.width) { pulse(); return; }
    const d = document.createElement('div');
    d.className = 'fly';
    dlg.appendChild(d);
    const ax = a.left + 24, ay = a.top + a.height / 2, bx = b.left + b.width / 2, by = b.top + b.height / 2;
    d.animate([
      { transform: `translate(${ax}px,${ay}px) scale(1)` },
      { transform: `translate(${(ax + bx) / 2}px,${Math.min(ay, by) - 80}px) scale(1.3)`, offset: 0.45 },
      { transform: `translate(${bx}px,${by}px) scale(.6)`, opacity: 0.4 },
    ], { duration: 650, easing: 'cubic-bezier(.3,.6,.2,1)' }).onfinish = () => { d.remove(); pulse(); };
  }

  const n = selection.size;
  const inSel = model && selection.has(model.codigo);
  const footer = !done ? (
    <div className="row">
      <button className="btn btn-primary" type="button" ref={addRef} onClick={add} disabled={!model}>
        {inSel ? t.update : t.add}
      </button>
      <span className="price">{common.priceOnRequest}</span>
    </div>
  ) : (
    <div>
      <p className="done-msg">{t.added(model?.codigo ?? '', n)}</p>
      <div className="row">
        <button className="btn btn-primary" type="button" ref={doneRef} onClick={() => { closeConfigurator(); setSummaryOpen(true); }}>{t.seeSelection}</button>
        <button className="btn btn-ghost" type="button" onClick={() => setDone(false)}>{t.otherSize}</button>
        <button className="btn btn-ghost" type="button" onClick={closeConfigurator}>{common.keepBrowsing}</button>
      </div>
    </div>
  );

  return (
    <Sheet
      open={!!cfgFamilia}
      onClose={closeConfigurator}
      labelledBy="cfgTitle"
      kicker={fam ? `${ct.categoria(fam.categoria)} · ${fam.codigo}` : t.family}
      closeLabel={t.close}
      footer={footer}
      bodyRef={bodyRef}
    >
      {fam && (
        <>
          <ModelPreview className="pv" familia={fam} color={model?.color} />
          <div className="cfg-name">
            <h2 id="cfgTitle">{famTr!.nombre}</h2>
            {famTr!.descripcion && <p className="cfg-desc">{famTr!.descripcion}</p>}
            {model && <p>{t.code} <b>{model.codigo}</b>{dims(model) && <> · {dims(model)}</>}</p>}
          </div>

          {error && <p className="err">{t.loadError}</p>}
          {!modelos && !error && <p className="sum-empty">{t.loading}</p>}

          {modelos && (
            <>
              <fieldset className="grp">
                <legend>1 · {t.step1} <span className="cfg-count">{bases.length}</span></legend>
                {bases.length > 8 && (
                  <input className="cfg-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh} aria-label={t.searchAria} />
                )}
                <div className="mlist">
                  {shownBases.map(([b, ms]) => (
                    <label className="o" key={b}>
                      <input type="radio" name="base" value={b} checked={b === base} onChange={() => chooseBase(b)} />
                      <span className="seg">
                        <span className="seg-main">{ms[0].medida ?? ms[0].detalle ?? b}{ms[0].modelo && <em> · {ms[0].modelo}</em>}</span>
                        {ms[0].medida && ms[0].detalle && <span className="seg-sub">{ms[0].detalle}</span>}
                        <small>{b}{ms.length > 1 ? ` · ${t.variants(ms.length)}` : ''}</small>
                      </span>
                    </label>
                  ))}
                  {!shownBases.length && <p className="sum-empty">{t.noMatch(query)}</p>}
                </div>
              </fieldset>

              {options.length > 0 && (
                <fieldset className="grp">
                  <legend>2 · {t.step2}</legend>
                  {options.map(({ a, label, vals }) => (
                    <div className="grp" role="radiogroup" aria-label={label} key={a}>
                      <p className="sub">{label}: <span>{pick[a] ? (a === 'color' ? ct.color(pick[a]!) : pick[a]) : '—'}</span></p>
                      <div className="opts">
                        {vals.map((v) => {
                          const checked = pick[a] === v, off = !available(a, v) && !checked;
                          return a === 'color' && COLOR_HEX[v] ? (
                            <label className={`o${off ? ' off' : ''}`} title={ct.color(v)} key={v}>
                              <input type="radio" name={`a-${a}`} value={v} checked={checked} aria-label={ct.color(v)} onChange={() => choose(a, v)} />
                              <span className="sw" style={{ background: COLOR_HEX[v] }} />
                            </label>
                          ) : (
                            <label className={`o${off ? ' off' : ''}`} key={v}>
                              <input type="radio" name={`a-${a}`} value={v} checked={checked} onChange={() => choose(a, v)} />
                              <span className="seg">{a === 'niveles' ? common.levels(v) : a === 'color' ? ct.color(v) : v}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </fieldset>
              )}

              {model?.materiales && <p className="cfg-mat"><b>{t.materials}</b> {model.materiales}</p>}

              <div className="grp">
                <label className="sub cfg-nota-label" htmlFor="cfgNota">{options.length ? '3' : '2'} · {t.note}</label>
                <textarea className="nota" id="cfgNota" placeholder={t.notePh}
                  value={nota} onChange={(e) => { setNota(e.target.value); }} />
              </div>
            </>
          )}
        </>
      )}
    </Sheet>
  );
}
