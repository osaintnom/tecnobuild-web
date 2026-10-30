'use client';
import { useSelection } from '@/state/selection';
import { scrollToId } from '@/lib/smooth';
import { Sheet } from './Sheet';
import { SelectionList } from './SelectionList';

export function SelectionSummary() {
  const { selection, summaryOpen, setSummaryOpen } = useSelection();
  const close = () => setSummaryOpen(false);
  return (
    <Sheet
      open={summaryOpen}
      onClose={close}
      labelledBy="sumTitle"
      kickerId="sumTitle"
      kicker="Tu selección"
      closeLabel="Cerrar resumen"
      footer={
        <div className="row">
          <button className="btn btn-primary" type="button" onClick={() => { close(); requestAnimationFrame(() => scrollToId('cotizar')); }}>Pedí tu cotización</button>
          <button className="btn btn-ghost" type="button" onClick={close}>Seguir eligiendo</button>
        </div>
      }
    >
      {selection.size ? (
        <>
          <p className="sum-empty">Revisá lo que elegiste. Lo enviamos junto con tu consulta.</p>
          <SelectionList />
          <span className="price">Precio a cotizar</span>
        </>
      ) : (
        <p className="sum-empty">Todavía no elegiste modelos. Recorré el edificio y configurá lo que te interese.</p>
      )}
    </Sheet>
  );
}
