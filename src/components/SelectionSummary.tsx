'use client';
import { useRouter } from 'next/navigation';
import { useSelection } from '@/state/selection';
import { useI18n } from '@/i18n/I18nProvider';
import { scrollToId } from '@/lib/smooth';
import { Sheet } from './Sheet';
import { SelectionList } from './SelectionList';

export function SelectionSummary() {
  const { selection, summaryOpen, setSummaryOpen } = useSelection();
  const router = useRouter();
  const { t: { summary: t, common }, href } = useI18n();
  const close = () => setSummaryOpen(false);
  // En el catálogo baja al formulario; desde quiénes somos lleva al catálogo.
  const goQuote = () => {
    close();
    if (document.getElementById('cotizar')) requestAnimationFrame(() => scrollToId('cotizar'));
    else router.push(href('catalog', 'cotizar'));
  };
  return (
    <Sheet
      open={summaryOpen}
      onClose={close}
      labelledBy="sumTitle"
      kickerId="sumTitle"
      kicker={common.yourSelection}
      closeLabel={t.close}
      footer={
        <div className="row">
          <button className="btn btn-primary" type="button" onClick={goQuote}>{common.requestQuote}</button>
          <button className="btn btn-ghost" type="button" onClick={close}>{common.keepBrowsing}</button>
        </div>
      }
    >
      {selection.size ? (
        <>
          <p className="sum-empty">{t.intro}</p>
          <SelectionList />
          <span className="price">{common.priceOnRequest}</span>
        </>
      ) : (
        <p className="sum-empty">{t.empty}</p>
      )}
    </Sheet>
  );
}
