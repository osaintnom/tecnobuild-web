import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/site';
import { LOCALES, ROUTES, type PageId } from '@/i18n/config';

// sitemap.xml: cada página en los dos idiomas, con sus alternativas (hreflang).
export const dynamic = 'force-static';

const PAGES: PageId[] = ['home', 'catalog'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: SITE_URL + ROUTES[locale][page],
      changeFrequency: page === 'catalog' ? 'weekly' : 'monthly',
      priority: page === 'home' ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, SITE_URL + ROUTES[l][page]])) },
    })),
  );
}
