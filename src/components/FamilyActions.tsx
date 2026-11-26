'use client';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';
import { useSelection } from '@/state/selection';

/** Botones de la página de una familia: abrir el configurador y volver al catálogo. */
export function FamilyActions({ codigo }: { codigo: string }) {
  const { selection, openConfigurator } = useSelection();
  const { t: { family: t, catalog }, href } = useI18n();
  const k = [...selection.values()].filter((s) => s.familia === codigo).length;
  return (
    <div className="fam-actions">
      <button type="button" className="btn btn-primary" onClick={() => openConfigurator(codigo)}>{t.configure}</button>
      <Link className="btn btn-ghost" href={href('catalog')}>{t.toCatalog}</Link>
      {k > 0 && <p className="fam-in">{catalog.inQuote(k)}</p>}
    </div>
  );
}
