'use client';
import { useEffect, useRef, useState } from 'react';
import { CATS, catById, modelById, type CatId } from '@/content/catalog';
import { CONTACT } from '@/content/site';
import { useSelection } from '@/state/selection';
import { SelectionList } from '@/components/SelectionList';

const RULES = {
  nombre: 'Escribí tu nombre.',
  tel: 'Dejanos un teléfono o WhatsApp para contactarte.',
  ubic: 'Indicá dónde está la obra.',
} as const;
type Required = keyof typeof RULES;

/** Pedí tu cotización: formulario con la selección precargada. Todavía no envía datos (falta backend). */
export function Quote() {
  const { selection, showToast } = useSelection();
  const [cats, setCats] = useState<Set<CatId>>(new Set());
  const [errors, setErrors] = useState<Partial<Record<Required, string>>>({});
  const [sent, setSent] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  // Las categorías de la selección quedan marcadas en el formulario.
  useEffect(() => {
    setCats((prev) => {
      const next = new Set(prev);
      selection.forEach((s) => next.add(modelById[s.modelId].cat));
      return next;
    });
  }, [selection]);

  useEffect(() => { if (sent) sentRef.current?.focus(); }, [sent]);

  const valueOf = (name: string) => (formRef.current?.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? '';
  function check(name: Required) {
    const ok = valueOf(name).length > 1;
    setErrors((e) => ({ ...e, [name]: ok ? undefined : RULES[name] }));
    return ok;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad = (Object.keys(RULES) as Required[]).filter((k) => !check(k));
    if (bad.length) { (formRef.current?.elements.namedItem(bad[0]) as HTMLElement).focus(); return; }
    const n = selection.size;
    const parts = [
      `${valueOf('nombre')}${valueOf('empresa') ? ', ' + valueOf('empresa') : ''}`,
      `Obra en ${valueOf('ubic')}`,
      valueOf('tam'),
      [...cats].map((c) => catById[c].nombre).join(', '),
      `${n} ${n === 1 ? 'modelo seleccionado' : 'modelos seleccionados'}`,
    ].filter(Boolean);
    setSent(parts.join(' · ') + '.');
  }

  function again() {
    formRef.current?.reset();
    setCats(new Set([...selection.values()].map((s) => modelById[s.modelId].cat)));
    setErrors({});
    setSent(null);
    requestAnimationFrame(() => (formRef.current?.elements.namedItem('nombre') as HTMLElement | null)?.focus());
  }

  async function copyMail() {
    try { await navigator.clipboard.writeText(CONTACT.email); showToast('Mail copiado.'); }
    catch { showToast(`Copiá el mail: ${CONTACT.email}`); }
  }

  const field = (name: Required, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="field">
      <label htmlFor={`q-${name}`}>{label}</label>
      <input id={`q-${name}`} name={name} required aria-describedby={`e-${name}`} aria-invalid={errors[name] ? true : undefined}
        onBlur={(e) => { if (e.target.value) check(name); }}
        onInput={() => { if (errors[name]) check(name); }}
        {...props} />
      <p className="err" id={`e-${name}`}>{errors[name] ?? ''}</p>
    </div>
  );

  return (
    <section className="quote tone-dark" id="cotizar" data-tone="dark" data-ch="cotizar">
      <div className="wrap q-grid">
        <div className="q-side">
          <p className="eyebrow">Pedí tu cotización</p>
          <h2 className="h2 rv">Contanos tu obra.</h2>
          <p className="lead">Con estos datos te preparamos una cotización de producto e instalación.</p>
          <div className="q-sel">
            <h3>Tu selección</h3>
            {selection.size ? <SelectionList /> : (
              <p className="q-empty">Todavía no elegiste modelos. Podés cotizar igual o <a className="link" href="#edificio">armar tu selección en el edificio</a>.</p>
            )}
          </div>
          <div className="q-alt">
            <span>¿Preferís escribirnos?</span>
            <div className="row"><span className="val">{CONTACT.email}</span><button className="copy" type="button" onClick={copyMail}>Copiar mail</button></div>
            <div className="row"><span>WhatsApp:</span><span className="val">{CONTACT.whatsapp ?? 'número a confirmar'}</span></div>
          </div>
        </div>

        <div>
          <form className="form" ref={formRef} noValidate onSubmit={onSubmit} hidden={!!sent}>
            <div className="f-row">
              {field('nombre', 'Nombre', { autoComplete: 'name' })}
              <div className="field">
                <label htmlFor="q-empresa">Empresa <span className="opt">(opcional)</span></label>
                <input id="q-empresa" name="empresa" autoComplete="organization" />
              </div>
            </div>
            <div className="f-row">
              {field('tel', 'Teléfono o WhatsApp', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: 'Ej.: 11 5555 0000' })}
              {field('ubic', 'Ubicación de la obra', { placeholder: 'Ej.: Palermo, CABA' })}
            </div>
            <div className="field">
              <label htmlFor="q-tam">Tamaño aproximado <span className="opt">(unidades o m²)</span></label>
              <input id="q-tam" name="tam" placeholder="Ej.: 24 unidades o 1.800 m²" />
            </div>
            <fieldset className="field">
              <legend>Categorías que te interesan</legend>
              <div className="chips">
                {CATS.map((c) => (
                  <label className="chip" key={c.id}>
                    <input type="checkbox" name="cats" value={c.id} checked={cats.has(c.id)}
                      onChange={(e) => setCats((s) => { const n = new Set(s); if (e.target.checked) n.add(c.id); else n.delete(c.id); return n; })} />
                    <span>{c.nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="q-msg">Algo más que quieras contarnos <span className="opt">(opcional)</span></label>
              <textarea id="q-msg" name="msg" placeholder="Etapa de la obra, fechas, tipologías…" />
            </div>
            <div className="f-send">
              <span className="send-wrap">
                <button className="btn btn-primary" type="submit">Enviar consulta</button>
                <span className="end-line" aria-hidden="true" />
              </span>
              <p className="proto-note">Versión de prueba: el formulario todavía no envía datos.</p>
            </div>
          </form>

          <div className="sent" ref={sentRef} hidden={!sent} tabIndex={-1}>
            <p className="eyebrow">Consulta enviada</p>
            <h3 className="h3">Recibimos tu consulta. Te vamos a contactar.</h3>
            <p>{sent}</p>
            <div><button className="btn btn-ghost" type="button" onClick={again}>Enviar otra consulta</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
