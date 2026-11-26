import type { Locale } from './config';
import { AMBIENTE_EN, CATEGORIA_EN, COLOR_EN, FAMILIA_EN, RUBRO_EN } from './catalog-en';
import { ambById, type AmbId, type Familia } from '@/content/catalog';

/** Textos visibles del catálogo en el idioma activo (los datos y los filtros siguen en español). */
export function catalogText(locale: Locale) {
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
