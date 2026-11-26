'use client';
import { useI18n } from '@/i18n/I18nProvider';
import { OFFICES } from '@/content/site';

/** Quiénes somos: qué hacemos, quién nos respalda y dónde estamos. Textos en el diccionario (about). */
export function About() {
  const { t: { about: t, offices } } = useI18n();
  const PILLARS = t.pillars;
  const PLACES = OFFICES.map((o, i) => ({ ...o, ...offices[i] }));
  return (
    <section className="about tone-dark" id="quienes" data-tone="dark" data-ch="quienes">
      <div className="wrap">
        <div className="ab-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 rv">{t.title}</h2>
          <p className="lead">{t.lead}</p>
        </div>

        <ol className="ab-pillars">
          {PILLARS.map((p, i) => (
            <li key={p.k}>
              <p className="ab-k"><b>{String(i + 1).padStart(2, '0')}</b> {p.k}</p>
              <h3 className="h3">{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>

        <ul className="ab-places" aria-label={t.placesAria}>
          {PLACES.map((p) => (
            <li key={p.city}>
              <span className="ab-city">{p.city}</span>
              <span className="ab-role">{p.role}</span>
              <span className="coord">{p.coord}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
