'use client';
import { famById } from '@/content/catalog';
import { useI18n } from '@/i18n/I18nProvider';
import { useSelection } from '@/state/selection';
import { ModelPreview } from './ModelPreview';

export function SelectionList({ editable = true }: { editable?: boolean }) {
  const { selection, remove, openConfigurator } = useSelection();
  const { t: { summary: t }, cat } = useI18n();
  if (!selection.size) return null;
  return (
    <ul className="sel-list">
      {[...selection.values()].map((s) => {
        const f = famById[s.familia];
        // El nombre se muestra en el idioma activo; el detalle queda como se eligió
        const nombre = f ? cat.fam(f).nombre : s.nombre;
        return (
          <li className="sel-item" key={s.codigo}>
            {f && <ModelPreview className="thumb" familia={f} />}
            <span>
              <span className="k">{cat.amb(s.ambiente)?.nombre} · {s.codigo}</span>
              <span className="nm">{nombre}</span>
              {s.detalle && <span className="cf">{s.detalle}</span>}
              {s.nota && <span className="nt">“{s.nota}”</span>}
            </span>
            {editable && (
              <span className="acts">
                <button className="tbtn" type="button" onClick={() => openConfigurator(s.familia, s.codigo)}>{t.edit}</button>
                <button className="tbtn" type="button" onClick={() => remove(s.codigo)} aria-label={t.removeAria(nombre, s.codigo)}>{t.remove}</button>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
