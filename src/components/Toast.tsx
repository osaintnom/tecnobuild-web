'use client';
import { useSelection } from '@/state/selection';

export function Toast() {
  const { toast } = useSelection();
  return <div className="toast" role="status" aria-live="polite" hidden={!toast}>{toast}</div>;
}
