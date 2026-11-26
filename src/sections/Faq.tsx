'use client';
import { useI18n } from '@/i18n/I18nProvider';

/**
 * Tus dudas: las tres objeciones (faq.items en el diccionario), como desplegables (<details>, sin JS: funciona con teclado y lector de pantalla).
 * Todas cerradas de entrada para que la sección ocupe poco, sobre todo en mobile.
 */
export function Faq() {
  const { t: { faq: t } } = useI18n();
  return (
    <section className="faq-sec" id="dudas" data-tone="light" data-ch="dudas">
      <div className="wrap">
        <p className="eyebrow">{t.eyebrow}</p>
        <div className="faq">
          {t.items.map((it) => (
            <details className="faq-item" key={it.q}>
              <summary><q className="rv">{it.q}</q><span className="faq-ic" aria-hidden="true" /></summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
