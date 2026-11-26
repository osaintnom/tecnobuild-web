import { isValidElement, type ReactNode } from 'react';
import { CONTACT, EUROTECHNOLOGIE_URL, SITE_URL } from '@/content/site';
import { ROUTES, type Locale } from '@/i18n/config';
import { es } from '@/i18n/es';
import { en } from '@/i18n/en';

// Datos estructurados (schema.org, JSON-LD) para buscadores y asistentes de IA.
// Solo hechos que ya están en la página (ver CLAUDE.md: nada de garantías, plazos ni cifras).

/** Texto plano de un fragmento del diccionario (las respuestas de «Tus dudas» tienen <b> y links). */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    const { type, props } = node;
    // Componentes simples (EtgLink): se renderizan para sacar su texto.
    if (typeof type === 'function') return textOf((type as (p: object) => ReactNode)(props));
    return textOf(props.children);
  }
  return '';
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

function graph(locale: Locale, withFaq: boolean) {
  const t = locale === 'en' ? en : es;
  const nodes: object[] = [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'TECNO.BUILD',
      url: SITE_URL + '/',
      logo: `${SITE_URL}/apple-icon.png`,
      email: CONTACT.email,
      description: t.meta.homeDesc,
      slogan: t.hero.title.join(' '),
      knowsAbout: t.hero.cats,
      areaServed: { '@type': 'AdministrativeArea', name: locale === 'en' ? 'Greater Buenos Aires (AMBA), Argentina' : 'Área Metropolitana de Buenos Aires (AMBA), Argentina' },
      address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressCountry: 'AR' },
      parentOrganization: { '@type': 'Organization', name: 'Eurotechnologie Group', url: EUROTECHNOLOGIE_URL },
    },
    { '@type': 'WebSite', '@id': SITE_ID, url: SITE_URL + '/', name: 'TECNO.BUILD', inLanguage: ['es-AR', 'en'], publisher: { '@id': ORG_ID } },
  ];
  if (withFaq) {
    nodes.push({
      '@type': 'FAQPage',
      url: SITE_URL + ROUTES[locale].home,
      inLanguage: locale === 'en' ? 'en' : 'es-AR',
      mainEntity: t.faq.items.map((i) => ({
        '@type': 'Question',
        name: clean(textOf(i.q)),
        acceptedAnswer: { '@type': 'Answer', text: clean(textOf(i.a)) },
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Bloque JSON-LD. «<» escapado para que el JSON nunca cierre el <script>. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function StructuredData({ locale, page }: { locale: Locale; page: 'home' | 'catalog' }) {
  return <JsonLd data={graph(locale, page === 'home')} />;
}
