'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { lockScroll } from '@/lib/smooth';

interface Props {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  kicker: ReactNode;
  kickerId?: string;
  closeLabel: string;
  footer: ReactNode;
  children: ReactNode;
  bodyRef?: React.Ref<HTMLDivElement>;
}

/** Hoja lateral (desktop) o inferior (mobile) sobre <dialog> nativo: foco atrapado y Esc sin código extra. */
export function Sheet({ open, onClose, labelledBy, kicker, kickerId, closeLabel, footer, children, bodyRef }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      lastFocus.current = document.activeElement;
      d.showModal();
      lockScroll(true);
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={labelledBy}
      onClose={() => {
        lockScroll(false);
        onClose();
        const el = lastFocus.current as HTMLElement | null;
        if (el && document.contains(el)) el.focus({ preventScroll: true });
      }}
      onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}
    >
      <div className="sheet-in">
        <div className="sheet-hd">
          <p id={kickerId}>{kicker}</p>
          <button className="x" type="button" aria-label={closeLabel} onClick={() => ref.current?.close()}>×</button>
        </div>
        <div className="sheet-body" ref={bodyRef}>{children}</div>
        <div className="sheet-ft">{footer}</div>
      </div>
    </dialog>
  );
}
