'use client';
import { catById, cfgText, modelById } from '@/content/catalog';
import { useSelection } from '@/state/selection';
import { ModelPreview } from './ModelPreview';

export function SelectionList({ editable = true }: { editable?: boolean }) {
  const { selection, remove, openConfigurator } = useSelection();
  if (!selection.size) return null;
  return (
    <ul className="sel-list">
      {[...selection.values()].map((s) => {
        const m = modelById[s.modelId], c = catById[m.cat];
        return (
          <li className="sel-item" key={m.id}>
            <ModelPreview className="thumb" model={m} cfg={s.cfg} />
            <span>
              <span className="k">{c.nombre}</span>
              <span className="nm">{m.nombre} · {m.codigo}</span>
              <span className="cf">{cfgText(m, s.cfg)}</span>
              {s.nota && <span className="nt">“{s.nota}”</span>}
            </span>
            {editable && (
              <span className="acts">
                <button className="tbtn" type="button" onClick={() => openConfigurator(m.id)}>Editar</button>
                <button className="tbtn" type="button" onClick={() => remove(m.id)} aria-label={`Quitar ${m.nombre}`}>Quitar</button>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
