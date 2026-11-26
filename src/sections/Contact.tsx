'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { CONTACT } from '@/content/site';
import { useSelection } from '@/state/selection';
import { useI18n } from '@/i18n/I18nProvider';

/** Contacto de quiénes somos: una consulta corta. La cotización detallada se arma en el catálogo. Todavía no envía datos. */
export function Contact() {
  const { showToast } = useSelection();
  const { t: { contact: t, forms: f, common }, href } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [sent, setSent] = useState(false);

  const RULES: Record<string, string> = { nombre: f.errName, tel: f.errPhone };
  const val = (n: string) => (formRef.current?.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? '';
  const check = (n: string) => { const ok = val(n).length > 1; setErrors((e) => ({ ...e, [n]: ok ? undefined : RULES[n] })); return ok; };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad = Object.keys(RULES).filter((n) => !check(n));
    if (bad.length) { (formRef.current?.elements.namedItem(bad[0]) as HTMLElement).focus(); return; }
    setSent(true);
  }

  async function copyMail() {
    try { await navigator.clipboard.writeText(CONTACT.email); showToast(f.mailCopied); }
    catch { showToast(f.copyMailFallback(CONTACT.email)); }
  }

  return (
    <section className="quote tone-dark" id="contacto" data-tone="dark" data-ch="contacto">
      <div className="wrap q-grid">
        <div className="q-side">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 rv">{t.title}</h2>
          <p className="lead">{t.lead}</p>
          <div><Link className="link" href={href('catalog')}>{t.toCatalog}</Link></div>
          <div className="q-alt">
            <span>{f.preferWrite}</span>
            <div className="row"><span className="val">{CONTACT.email}</span><button className="copy" type="button" onClick={copyMail}>{f.copyMail}</button></div>
            <div className="row"><span>{f.whatsapp}</span><span className="val">{CONTACT.whatsapp ?? f.whatsappPending}</span></div>
          </div>
        </div>

        <div>
          <form className="form" ref={formRef} noValidate onSubmit={onSubmit} hidden={sent}>
            <div className="f-row">
              {(['nombre', 'tel'] as const).map((n) => (
                <div className="field" key={n}>
                  <label htmlFor={`c-${n}`}>{n === 'nombre' ? f.name : f.phone}</label>
                  <input id={`c-${n}`} name={n} required type={n === 'tel' ? 'tel' : 'text'} autoComplete={n === 'tel' ? 'tel' : 'name'}
                    aria-describedby={`ce-${n}`} aria-invalid={errors[n] ? true : undefined}
                    onBlur={(e) => { if (e.target.value) check(n); }} onInput={() => { if (errors[n]) check(n); }} />
                  <p className="err" id={`ce-${n}`}>{errors[n] ?? ''}</p>
                </div>
              ))}
            </div>
            <div className="field">
              <label htmlFor="c-empresa">{f.company} <span className="opt">{common.optional}</span></label>
              <input id="c-empresa" name="empresa" autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="c-msg">{t.project} <span className="opt">{common.optional}</span></label>
              <textarea id="c-msg" name="msg" placeholder={t.projectPh} />
            </div>
            <div className="f-send">
              <span className="send-wrap">
                <button className="btn btn-primary" type="submit">{f.send}</button>
                <span className="end-line" aria-hidden="true" />
              </span>
              <p className="proto-note">{f.protoNote}</p>
            </div>
          </form>
          <div className="sent" hidden={!sent}>
            <p className="eyebrow">{f.sentK}</p>
            <h3 className="h3">{f.sentTitle}</h3>
            <div><button className="btn btn-ghost" type="button" onClick={() => { formRef.current?.reset(); setSent(false); }}>{f.sendAnother}</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
