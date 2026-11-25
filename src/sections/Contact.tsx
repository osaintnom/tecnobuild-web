'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { CONTACT } from '@/content/site';
import { useSelection } from '@/state/selection';

/** Contacto de quiénes somos: una consulta corta. La cotización detallada se arma en el catálogo. Todavía no envía datos. */
export function Contact() {
  const { showToast } = useSelection();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [sent, setSent] = useState(false);

  const RULES: Record<string, string> = { nombre: 'Escribí tu nombre.', tel: 'Dejanos un teléfono o WhatsApp para contactarte.' };
  const val = (n: string) => (formRef.current?.elements.namedItem(n) as HTMLInputElement | null)?.value.trim() ?? '';
  const check = (n: string) => { const ok = val(n).length > 1; setErrors((e) => ({ ...e, [n]: ok ? undefined : RULES[n] })); return ok; };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad = Object.keys(RULES).filter((n) => !check(n));
    if (bad.length) { (formRef.current?.elements.namedItem(bad[0]) as HTMLElement).focus(); return; }
    setSent(true);
  }

  async function copyMail() {
    try { await navigator.clipboard.writeText(CONTACT.email); showToast('Mail copiado.'); }
    catch { showToast(`Copiá el mail: ${CONTACT.email}`); }
  }

  return (
    <section className="quote tone-dark" id="contacto" data-tone="dark" data-ch="contacto">
      <div className="wrap q-grid">
        <div className="q-side">
          <p className="eyebrow">Contacto</p>
          <h2 className="h2 rv">Contanos tu obra.</h2>
          <p className="lead">Dejanos tus datos y te llamamos. Si ya sabés qué terminaciones necesitás, armá tu cotización en el catálogo.</p>
          <div><Link className="link" href="/catalogo/">Ir al catálogo y armar tu obra →</Link></div>
          <div className="q-alt">
            <span>¿Preferís escribirnos?</span>
            <div className="row"><span className="val">{CONTACT.email}</span><button className="copy" type="button" onClick={copyMail}>Copiar mail</button></div>
            <div className="row"><span>WhatsApp:</span><span className="val">{CONTACT.whatsapp ?? 'número a confirmar'}</span></div>
          </div>
        </div>

        <div>
          <form className="form" ref={formRef} noValidate onSubmit={onSubmit} hidden={sent}>
            <div className="f-row">
              {(['nombre', 'tel'] as const).map((n) => (
                <div className="field" key={n}>
                  <label htmlFor={`c-${n}`}>{n === 'nombre' ? 'Nombre' : 'Teléfono o WhatsApp'}</label>
                  <input id={`c-${n}`} name={n} required type={n === 'tel' ? 'tel' : 'text'} autoComplete={n === 'tel' ? 'tel' : 'name'}
                    aria-describedby={`ce-${n}`} aria-invalid={errors[n] ? true : undefined}
                    onBlur={(e) => { if (e.target.value) check(n); }} onInput={() => { if (errors[n]) check(n); }} />
                  <p className="err" id={`ce-${n}`}>{errors[n] ?? ''}</p>
                </div>
              ))}
            </div>
            <div className="field">
              <label htmlFor="c-empresa">Empresa <span className="opt">(opcional)</span></label>
              <input id="c-empresa" name="empresa" autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="c-msg">Tu obra <span className="opt">(opcional)</span></label>
              <textarea id="c-msg" name="msg" placeholder="Ubicación, etapa, tipologías, qué terminaciones buscás…" />
            </div>
            <div className="f-send">
              <span className="send-wrap">
                <button className="btn btn-primary" type="submit">Enviar consulta</button>
                <span className="end-line" aria-hidden="true" />
              </span>
              <p className="proto-note">Versión de prueba: el formulario todavía no envía datos.</p>
            </div>
          </form>
          <div className="sent" hidden={!sent}>
            <p className="eyebrow">Consulta enviada</p>
            <h3 className="h3">Recibimos tu consulta. Te vamos a contactar.</h3>
            <div><button className="btn btn-ghost" type="button" onClick={() => { formRef.current?.reset(); setSent(false); }}>Enviar otra consulta</button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
