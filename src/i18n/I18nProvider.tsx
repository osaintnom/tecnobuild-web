'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ROUTES, type Locale, type PageId } from './config';
import { es, type Dict } from './es';
import { en } from './en';
import { AMBIENTE_EN, CATEGORIA_EN, COLOR_EN, FAMILIA_EN, RUBRO_EN } from './catalog-en';
import { ambById, type AmbId, type Familia } from '@/content/catalog';

const DICTS: Record<Locale, Dict> = { es, en };

/** Textos visibles del catálogo en el idioma activo (los datos y los filtros siguen en español). */
function catalogText(locale: Locale) {
  const tr = (map: Record<string, string>) => (s: string) => (locale === 'en' ? map[s] ?? s : s);
  return {
    rubro: tr(RUBRO_EN),
    categoria: tr(CATEGORIA_EN),
    color: tr(COLOR_EN),
    amb: (id: AmbId) => (locale === 'en' ? AMBIENTE_EN[id] : undefined) ?? ambById[id],
    fam: (f: Familia) => {
      const t = locale === 'en' ? FAMILIA_EN[f.codigo] : undefined;
      return t ? { nombre: t[0], subtitulo: t[1] || f.subtitulo, descripcion: t[2] || f.descripcion } : f;
    },
  };
}

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

