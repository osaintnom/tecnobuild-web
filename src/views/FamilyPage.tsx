import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { familyAlternates, familyPath, LOCALES, ROUTES, type Locale } from '@/i18n/config';
import { I18nProvider } from '@/i18n/I18nProvider';
import { catalogText } from '@/i18n/catalog-text';
import { es } from '@/i18n/es';
import { en } from '@/i18n/en';
import { FAMILIAS, famById, type Familia, type Modelo } from '@/content/catalog';
import { SITE_URL } from '@/content/site';
import { SelectionProvider } from '@/state/selection';
import { SmoothScroll } from '@/components/SmoothScroll';
import { PageChrome } from '@/components/PageChrome';
import { Configurator } from '@/components/Configurator';
import { SelectionSummary } from '@/components/SelectionSummary';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { ModelPreview } from '@/components/ModelPreview';
import { FamilyActions } from '@/components/FamilyActions';
import { JsonLd } from '@/components/StructuredData';
import './family.css';

// Página propia de cada familia del catálogo, generada en el build: así buscadores y asistentes de IA
// pueden leer cada producto con sus modelos y códigos TB. La elección y la cotización siguen en el configurador.

const dict = (locale: Locale) => (locale === 'en' ? en : es);

/** Parámetros de las rutas estáticas: una página por familia. */
export const familyParams = () => FAMILIAS.map((f) => ({ familia: f.codigo.toLowerCase() }));

const findFamily = (slug: string) => famById[slug.toUpperCase()];

/** Modelos de la familia, leídos en el build del mismo JSON que usa el configurador. */
function modelosDe(codigo: string): Modelo[] {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), 'public/catalogo/modelos', `${codigo}.json`), 'utf8'));
  } catch {
    return [];
  }
}

export function familyMetadata(locale: Locale, slug: string): Metadata {
  const f = findFamily(slug);
  if (!f) return {};
  const t = dict(locale).family;
  const ct = catalogText(locale);
  const tr = ct.fam(f);
  return {
    title: t.metaTitle(tr.nombre, ct.categoria(f.categoria)),
    description: t.metaDesc(tr.descripcion ?? '', f.modelos),
    alternates: familyAlternates(locale, f.codigo),
  };
}

/** Otras familias para seguir navegando: primero la misma categoría, después el mismo rubro. */
function relacionadas(f: Familia): Familia[] {
  const otras = FAMILIAS.filter((x) => x.codigo !== f.codigo);
  const misma = otras.filter((x) => x.categoria === f.categoria);
  const rubro = otras.filter((x) => x.categoria !== f.categoria && x.rubro === f.rubro);
  return [...misma, ...rubro].slice(0, 4);
}

export function FamilyPage({ locale, slug }: { locale: Locale; slug: string }) {
  const f = findFamily(slug)!;
  const d = dict(locale);
  const t = d.family;
  const ct = catalogText(locale);
  const tr = ct.fam(f);
  const modelos = modelosDe(f.codigo);
  const cat = ct.categoria(f.categoria);
  const langHrefs = Object.fromEntries(LOCALES.map((l) => [l, familyPath(l, f.codigo)])) as Record<Locale, string>;
  const dims = (m: Modelo) => (m.dim?.some((x) => x != null) ? m.dim.map((x) => x ?? '—').join(' × ') : '');
  const opciones = (m: Modelo) => [m.niveles ? d.common.levels(m.niveles) : '', m.variante ?? '', m.color ? ct.color(m.color) : ''].filter(Boolean).join(' · ');
  const size = (m: Modelo) => m.medida ?? m.modelo ?? '';
  const showSize = modelos.some((m) => size(m));
  const showDims = modelos.some((m) => dims(m));
  const showOpts = modelos.some((m) => opciones(m));
  const showDetail = modelos.some((m) => m.detalle);

  const facts: [string, string][] = [
    [t.facts.code, f.codigo],
    [t.facts.category, `${ct.rubro(f.rubro)} · ${cat}`],
    [t.facts.room, ct.amb(f.ambiente).nombre],
    [t.facts.models, String(f.modelos)],
    ...(f.colores.length ? [[t.facts.colors, f.colores.map(ct.color).join(', ')] as [string, string]] : []),
    ...(f.muebles.length ? [[t.facts.widths, `${f.muebles.join(', ')} mm`] as [string, string]] : []),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemPage',
        url: SITE_URL + familyPath(locale, f.codigo),
        name: tr.nombre,
        description: tr.descripcion,
        inLanguage: locale === 'en' ? 'en' : 'es-AR',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        ...(f.foto ? { primaryImageOfPage: SITE_URL + f.foto } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: d.catalog.eyebrow, item: SITE_URL + ROUTES[locale].catalog },
          { '@type': 'ListItem', position: 2, name: tr.nombre, item: SITE_URL + familyPath(locale, f.codigo) },
        ],
      },
    ],
  };

  return (
    <I18nProvider locale={locale}>
      <JsonLd data={jsonLd} />
      <SelectionProvider>
        <SmoothScroll />
        <PageChrome page="catalog" langHrefs={langHrefs} />
        <main>
          <section className="fam wrap" data-tone="light">
            <nav className="fam-crumbs" aria-label={t.crumbsAria}>
              <Link href={ROUTES[locale].catalog}>{d.catalog.eyebrow}</Link>
              <span aria-hidden="true">/</span>
              <span>{ct.rubro(f.rubro)}</span>
              <span aria-hidden="true">/</span>
              <span>{cat}</span>
            </nav>

            <div className="fam-top">
              <ModelPreview className="fam-pv" familia={{ ...f, nombre: tr.nombre }} />
              <div className="fam-info">
                <p className="eyebrow">{cat}</p>
                <h1 className="h2">{tr.nombre}</h1>
                {tr.subtitulo && <p className="fam-sub">{tr.subtitulo}</p>}
                {tr.descripcion && <p className="lead">{tr.descripcion}</p>}
                <dl className="fam-facts">
                  {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <p className="fam-price">{d.common.priceOnRequest}</p>
                <FamilyActions codigo={f.codigo} />
              </div>
            </div>

            {modelos.length > 0 && (
              <section className="fam-models" aria-labelledby="fam-models-t">
                <h2 className="h3" id="fam-models-t">{t.modelsTitle} <span className="fam-n">{modelos.length}</span></h2>
                <p className="fam-note">{t.modelsLead}{t.dataLang && <> {t.dataLang}</>}</p>
                <div className="fam-table">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{t.cols.code}</th>
                        {showSize && <th scope="col">{t.cols.size}</th>}
                        {showDims && <th scope="col">{t.cols.dims}</th>}
                        {showOpts && <th scope="col">{t.cols.options}</th>}
                        {showDetail && <th scope="col">{t.cols.detail}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {modelos.map((m) => (
                        <tr key={m.codigo}>
                          <td className="mono" data-label={t.cols.code}>{m.codigo}</td>
                          {showSize && <td data-label={t.cols.size}>{size(m)}</td>}
                          {showDims && <td className="mono" data-label={t.cols.dims}>{dims(m)}</td>}
                          {showOpts && <td data-label={t.cols.options}>{opciones(m)}</td>}
                          {showDetail && <td data-label={t.cols.detail}>{m.detalle ?? ''}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {relacionadas(f).length > 0 && (
              <section className="fam-rel" aria-labelledby="fam-rel-t">
                <h2 className="h3" id="fam-rel-t">{t.related}</h2>
                <ul className="cat-cards">
                  {relacionadas(f).map((r) => {
                    const rt = ct.fam(r);
                    return (
                      <li key={r.codigo}>
                        <Link className="pcard" href={familyPath(locale, r.codigo)} prefetch={false}>
                          <ModelPreview className="pcard-pv" familia={{ ...r, nombre: rt.nombre }} />
                          <span className="pcard-k">{ct.categoria(r.categoria)}</span>
                          <span className="pcard-nm">{rt.nombre}</span>
                          {rt.subtitulo && <span className="pcard-sub">{rt.subtitulo}</span>}
                          <span className="pcard-cd">{r.codigo} · {d.common.models(r.modelos)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </section>
        </main>
        <Footer />
        <Configurator />
        <SelectionSummary />
        <Toast />
      </SelectionProvider>
    </I18nProvider>
  );
}
