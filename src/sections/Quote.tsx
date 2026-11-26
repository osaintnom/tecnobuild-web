'use client';
import { useEffect, useRef, useState } from 'react';
import { AMBIENTES, type AmbId } from '@/content/catalog';
import { useI18n } from '@/i18n/I18nProvider';
import { CONTACT } from '@/content/site';
import { useSelection } from '@/state/selection';
import { SelectionList } from '@/components/SelectionList';

type Required = 'nombre' | 'tel' | 'ubic';

/** Pedí tu cotización: formulario con la selección precargada. Todavía no envía datos (falta backend). */
export function Quote() {
  const { selection, showToast } = useSelection();
  const { t: { quote: t, forms: f, common }, cat: ct } = useI18n();
  const RULES: Record<Required, string> = { nombre: f.errName, tel: f.errPhone, ubic: f.errLocation };
  const [cats, setCats] = useState<Set<AmbId>>(new Set());
  const [errors, setErrors] = useState<Partial<Record<Required, string>>>({});
  const [sent, setSent] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);

  // Las categorías de la selección quedan marcadas en el formulario.
  useEffect(() => {
    setCats((prev) => {
      const next = new Set(prev);
      selection.forEach((s) => next.add(s.ambiente));
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
      t.sumSite(valueOf('ubic')),
      valueOf('tam'),
      [...cats].map((c) => ct.amb(c).nombre).join(', '),
      n ? t.sumModels(n, [...selection.keys()].join(', ')) : t.sumNoModels,
    ].filter(Boolean);
    setSent(parts.join(' · ') + '.');
  }

  function again() {
    formRef.current?.reset();
    setCats(new Set([...selection.values()].map((s) => s.ambiente)));
    setErrors({});
    setSent(null);
    requestAnimationFrame(() => (formRef.current?.elements.namedItem('nombre') as HTMLElement | null)?.focus());
  }

  async function copyMail() {
    try { await navigator.clipboard.writeText(CONTACT.email); showToast(f.mailCopied); }
    catch { showToast(f.copyMailFallback(CONTACT.email)); }
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
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 rv">{t.title}</h2>
          <p className="lead">{t.lead}</p>
          <div className="q-sel">
            <h3>{common.yourSelection}</h3>
            {selection.size ? <SelectionList /> : (
              <p className="q-empty">{t.empty}</p>
            )}
          </div>
          <div className="q-alt">
            <span>{f.preferWrite}</span>
            <div className="row"><span className="val">{CONTACT.email}</span><button className="copy" type="button" onClick={copyMail}>{f.copyMail}</button></div>
            <div className="row"><span>{f.whatsapp}</span><span className="val">{CONTACT.whatsapp ?? f.whatsappPending}</span></div>
          </div>
        </div>

        <div>
          <form className="form" ref={formRef} noValidate onSubmit={onSubmit} hidden={!!sent}>
            <div className="f-row">
              {field('nombre', f.name, { autoComplete: 'name' })}
              <div className="field">
                <label htmlFor="q-empresa">{f.company} <span className="opt">{common.optional}</span></label>
                <input id="q-empresa" name="empresa" autoComplete="organization" />
              </div>
            </div>
            <div className="f-row">
              {field('tel', f.phone, { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: t.phonePh })}
              {field('ubic', t.location, { placeholder: t.locationPh })}
            </div>
            <div className="field">
              <label htmlFor="q-tam">{t.size} <span className="opt">{t.sizeHint}</span></label>
              <input id="q-tam" name="tam" placeholder={t.sizePh} />
            </div>
            <fieldset className="field">
              <legend>{t.rooms}</legend>
              <div className="chips">
                {AMBIENTES.map((c) => (
                  <label className="chip" key={c.id}>
                    <input type="checkbox" name="cats" value={c.id} checked={cats.has(c.id)}
                      onChange={(e) => setCats((s) => { const n = new Set(s); if (e.target.checked) n.add(c.id); else n.delete(c.id); return n; })} />
                    <span>{ct.amb(c.id).nombre}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="q-msg">{t.msg} <span className="opt">{common.optional}</span></label>
              <textarea id="q-msg" name="msg" placeholder={t.msgPh} />
            </div>
            <div className="f-send">
              <span className="send-wrap">
                <button className="btn btn-primary" type="submit">{f.send}</button>
                <span className="end-line" aria-hidden="true" />
              </span>
              <p className="proto-note">{f.protoNote}</p>
            </div>
          </form>

          <div className="sent" ref={sentRef} hidden={!sent} tabIndex={-1}>
            <p className="eyebrow">{f.sentK}</p>
            <h3 className="h3">{f.sentTitle}</h3>
            <p>{sent}</p>
            <div><button className="btn btn-ghost" type="button" onClick={again}>{f.sendAnother}</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
