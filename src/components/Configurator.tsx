'use client';
import { useEffect, useRef, useState } from 'react';
import { CATS, MODELS, catById, cfgText, defaults, modelById, optValue, type Cfg } from '@/content/catalog';
import { useSelection } from '@/state/selection';
import { prefersReduced } from '@/lib/motion';
import { scrollToId } from '@/lib/smooth';
import { Sheet } from './Sheet';
import { ModelPreview } from './ModelPreview';

interface Draft { modelId: string; cfg: Cfg; nota: string }

/** Configurador: modelo → configuración acotada → nota libre → "Agregar a mi cotización". Sin precios ni cantidades. */
export function Configurator() {
  const { cfgModel, closeConfigurator, selection, upsert, pulse, setSummaryOpen } = useSelection();
  const [cur, setCur] = useState<Draft | null>(null);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const draftFor = (id: string, nota = ''): Draft => {
    const s = selection.get(id);
    return { modelId: id, cfg: s ? { ...s.cfg } : defaults(modelById[id]), nota: s ? s.nota : nota };
  };

  useEffect(() => {
    if (!cfgModel) return;
    setCur(draftFor(cfgModel));
    setDone(false);
    bodyRef.current?.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfgModel]);

  useEffect(() => { if (done) nextRef.current?.focus(); }, [done]);

  const m = cur ? modelById[cur.modelId] : null;
  const c = m ? catById[m.cat] : null;
  const idx = c ? CATS.findIndex((x) => x.id === c.id) : -1;
  const next = CATS[idx + 1];
  const n = selection.size;

  function setAttr(id: string, v: string) {
    setCur((d) => d && { ...d, cfg: { ...d.cfg, [id]: v } });
    setDone(false);
  }

  function add() {
    if (!cur) return;
    upsert({ modelId: cur.modelId, cfg: { ...cur.cfg }, nota: cur.nota.trim() });
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

  function goNext() {
    closeConfigurator();
    if (next) requestAnimationFrame(() => scrollToId(`nivel-${next.id}`));
    else setSummaryOpen(true);
  }

  const footer = !done ? (
    <div className="row">
      <button className="btn btn-primary" type="button" ref={addRef} onClick={add}>
        {m && selection.has(m.id) ? 'Actualizar en mi cotización' : 'Agregar a mi cotización'}
      </button>
      <span className="price">Precio a cotizar</span>
    </div>
  ) : (
    <div>
      <p className="done-msg">✓ Sumado a tu cotización · {n} {n === 1 ? 'modelo' : 'modelos'} en tu selección</p>
      <div className="row">
        <button className="btn btn-primary" type="button" ref={nextRef} onClick={goNext}>
          {next ? `Siguiente: ${next.nombre} ↓` : 'Ver mi selección'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={closeConfigurator}>Cerrar</button>
      </div>
    </div>
  );

  return (
    <Sheet
      open={!!cfgModel}
      onClose={closeConfigurator}
      labelledBy="cfgTitle"
      kicker={c ? `${c.nombre} · ${c.nivel} de 4` : 'Nivel'}
      closeLabel="Cerrar configurador"
      footer={footer}
      bodyRef={bodyRef}
    >
      {cur && m && (
        <>
          <ModelPreview className="pv" model={m} cfg={cur.cfg} />
          <div className="cfg-name">
            <h2 id="cfgTitle">{m.nombre}</h2>
            <p><b>{m.codigo}</b> · <span>{cfgText(m, cur.cfg)}</span></p>
          </div>

          <fieldset className="grp">
            <legend>1 · Modelo</legend>
            <div className="mlist">
              {MODELS.filter((x) => x.cat === m.cat).map((x) => (
                <label className="o" key={x.id}>
                  <input type="radio" name="model" value={x.id} checked={x.id === m.id}
                    onChange={() => { setCur(draftFor(x.id, cur.nota)); setDone(false); }} />
                  <span className="seg">{x.nombre}<small>{x.codigo}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="grp">
            <legend>2 · Configuración</legend>
            {m.attrs.map((a) => (
              <div className="grp" role="radiogroup" aria-label={a.label} key={a.id}>
                <p className="sub">{a.label}: <span>{cur.cfg[a.id]}</span></p>
                <div className="opts">
                  {a.opts.map((o) => {
                    const v = optValue(o), checked = cur.cfg[a.id] === v;
                    return typeof o !== 'string' ? (
                      <label className="o" title={v} key={v}>
                        <input type="radio" name={`a-${a.id}`} value={v} checked={checked} aria-label={v} onChange={() => setAttr(a.id, v)} />
                        <span className="sw" style={{ background: o.hex }} />
                      </label>
                    ) : (
                      <label className="o" key={v}>
                        <input type="radio" name={`a-${a.id}`} value={v} checked={checked} onChange={() => setAttr(a.id, v)} />
                        <span className="seg">{v}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          <div className="grp">
            <label className="sub cfg-nota-label" htmlFor="cfgNota">3 · ¿Necesitás algo distinto? Contanos</label>
            <textarea className="nota" id="cfgNota" placeholder="Ej.: otra medida, otro color o cantidades por tipología."
              value={cur.nota} onChange={(e) => setCur({ ...cur, nota: e.target.value })} />
          </div>
        </>
      )}
    </Sheet>
  );
}
