'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ROUTES, type Locale, type PageId } from './config';
import { es, type Dict } from './es';
import { en } from './en';
import { catalogText } from './catalog-text';

const DICTS: Record<Locale, Dict> = { es, en };

interface Ctx {
  locale: Locale;
  t: Dict;
  /** Ruta de una página en el idioma activo. */
  href: (page: PageId, hash?: string) => string;
  cat: ReturnType<typeof catalogText>;
}

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<Ctx>(() => ({
    locale,
    t: DICTS[locale],
    href: (page, hash) => ROUTES[locale][page] + (hash ? `#${hash}` : ''),
    cat: catalogText(locale),
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n debe usarse dentro de <I18nProvider>');
  return ctx;
}

