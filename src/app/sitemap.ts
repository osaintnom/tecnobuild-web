import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/site';
import { familyPath, LOCALES, ROUTES, type PageId } from '@/i18n/config';
import { FAMILIAS } from '@/content/catalog';

// sitemap.xml: cada página y cada familia del catálogo en los dos idiomas, con sus alternativas (hreflang).
export const dynamic = 'force-static';

const PAGES: PageId[] = ['home', 'catalog'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: SITE_URL + ROUTES[locale][page],
      changeFrequency: page === 'catalog' ? ('weekly' as const) : ('monthly' as const),
      priority: page === 'home' ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, SITE_URL + ROUTES[l][page]])) },
    })),
  ).concat(
    FAMILIAS.flatMap((f) =>
      LOCALES.map((locale) => ({
        url: SITE_URL + familyPath(locale, f.codigo),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, SITE_URL + familyPath(l, f.codigo)])) },
      })),
    ),
  );
}
