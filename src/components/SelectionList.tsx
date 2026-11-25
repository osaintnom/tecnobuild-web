'use client';
import { ambById, famById } from '@/content/catalog';
import { useSelection } from '@/state/selection';
import { ModelPreview } from './ModelPreview';

export function SelectionList({ editable = true }: { editable?: boolean }) {
  const { selection, remove, openConfigurator } = useSelection();
  if (!selection.size) return null;
  return (
    <ul className="sel-list">
      {[...selection.values()].map((s) => {
        const f = famById[s.familia];
        return (
          <li className="sel-item" key={s.codigo}>
            {f && <ModelPreview className="thumb" familia={f} />}
            <span>
              <span className="k">{ambById[s.ambiente]?.nombre} · {s.codigo}</span>
              <span className="nm">{s.nombre}</span>
              {s.detalle && <span className="cf">{s.detalle}</span>}
              {s.nota && <span className="nt">“{s.nota}”</span>}
            </span>
            {editable && (
              <span className="acts">
                <button className="tbtn" type="button" onClick={() => openConfigurator(s.familia, s.codigo)}>Editar</button>
                <button className="tbtn" type="button" onClick={() => remove(s.codigo)} aria-label={`Quitar ${s.nombre} ${s.codigo}`}>Quitar</button>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
