// Idiomas del sitio. El español es el idioma por defecto y vive en la raíz (/, /catalogo/);
// el inglés vive bajo /en/ (/en/, /en/catalog/). Cada idioma tiene su propio layout raíz
// (src/app/(es) y src/app/(en)) para que <html lang> sea el correcto desde el HTML estático.
export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export type PageId = 'home' | 'catalog';

/** Ruta de cada página en cada idioma (con barra final: el sitio usa trailingSlash). */
export const ROUTES: Record<Locale, Record<PageId, string>> = {
  es: { home: '/', catalog: '/catalogo/' },
  en: { home: '/en/', catalog: '/en/catalog/' },
};

/** canonical + hreflang de una página, para sus metadatos. */
export const alternates = (locale: Locale, page: PageId) => ({
  canonical: ROUTES[locale][page],
  languages: { es: ROUTES.es[page], en: ROUTES.en[page], 'x-default': ROUTES.es[page] },
});

/** Página de una familia del catálogo: /catalogo/tb-gr-be01/ y /en/catalog/tb-gr-be01/ (el código no cambia con el idioma). */
export const familySlug = (codigo: string) => codigo.toLowerCase();
export const familyPath = (locale: Locale, codigo: string) => `${ROUTES[locale].catalog}${familySlug(codigo)}/`;
export const familyAlternates = (locale: Locale, codigo: string) => ({
  canonical: familyPath(locale, codigo),
  languages: { es: familyPath('es', codigo), en: familyPath('en', codigo), 'x-default': familyPath('es', codigo) },
});
