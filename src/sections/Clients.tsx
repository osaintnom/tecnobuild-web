'use client';
import { publicUrl } from '@/content/catalog';
import { useI18n } from '@/i18n/I18nProvider';

/**
 * Empresas que ya confiaron en nosotros. Los nombres, lo que les trajimos y los logos los pasa TECNO.BUILD.
 * No inventar empresas ni citas: el texto es nuestro, no una frase del cliente.
 * Sin espacios vacíos: se muestran solo las empresas reales.
 */
type ClientText = { tipo: string; trajimos: string[]; texto: string };
/** `en`: la misma ficha en inglés para /en/ (si falta, se muestra en español). */
type Client = ClientText & { name: string; url: string; logo?: string; en?: ClientText };

const CLIENTS: Client[] = [
  {
    name: 'Sentire',
    url: 'https://sentire.com.ar/',
    tipo: 'Desarrolladora · Buenos Aires',
    trajimos: ['Barandas', 'Puertas'],
    texto: 'Les trajimos barandas y puertas para su obra, y están muy conformes con el producto.',
    en: {
      tipo: 'Developer · Buenos Aires',
      trajimos: ['Railings', 'Doors'],
      texto: 'We supplied railings and doors for their project, and they are very satisfied with the product.',
    },
    // Logo de sentire.com.ar (original en blanco), pasado a carbón para verse sobre la tarjeta
    logo: '/clientes/sentire.svg',
  },
];

export function Clients() {
  const { locale, t: { clients: t } } = useI18n();
  return (
    <section className="clients" id="empresas" data-tone="light" data-ch="empresas">
      <div className="wrap">
        <div className="cl-head">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 rv">{t.title}</h2>
        </div>
        <ul className="cl-list">
          {CLIENTS.map((client) => { const c = { ...client, ...(locale === 'en' ? client.en : undefined) }; return (
            <li key={c.name} className="cl-card">
              <a className="cl-brand" href={c.url} target="_blank" rel="noopener noreferrer">
                {c.logo ? <img src={publicUrl(c.logo)} alt={c.name} width={284} height={103} /> : <span className="cl-name">{c.name}</span>}
                <span className="cl-tipo">{c.tipo}</span>
              </a>
              <div className="cl-body">
                <ul className="cl-tags" aria-label={t.tagsAria}>
                  {c.trajimos.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <p>{c.texto}</p>
              </div>
            </li>
          ); })}
        </ul>
      </div>
    </section>
  );
}
