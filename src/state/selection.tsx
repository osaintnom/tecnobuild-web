'use client';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Cfg } from '@/content/catalog';

export interface SelItem { modelId: string; cfg: Cfg; nota: string }

interface Ctx {
  selection: Map<string, SelItem>;
  upsert: (item: SelItem) => void;
  remove: (modelId: string) => void;
  clear: () => void;
  // Hojas (configurador y resumen) y avisos
  cfgModel: string | null;
  openConfigurator: (modelId: string) => void;
  closeConfigurator: () => void;
  summaryOpen: boolean;
  setSummaryOpen: (v: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  pulseKey: number;
  pulse: () => void;
}

const SelectionContext = createContext<Ctx | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Map<string, SelItem>>(() => new Map());
  const [cfgModel, setCfgModel] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const upsert = useCallback((item: SelItem) => setSelection((s) => new Map(s).set(item.modelId, item)), []);
  const remove = useCallback((id: string) => setSelection((s) => { const n = new Map(s); n.delete(id); return n; }), []);
  const clear = useCallback(() => setSelection(new Map()), []);
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const value = useMemo<Ctx>(() => ({
    selection, upsert, remove, clear,
    cfgModel,
    openConfigurator: (id) => { setSummaryOpen(false); setCfgModel(id); },
    closeConfigurator: () => setCfgModel(null),
    summaryOpen, setSummaryOpen,
    toast, showToast,
    pulseKey, pulse: () => setPulseKey((k) => k + 1),
  }), [selection, upsert, remove, clear, cfgModel, summaryOpen, toast, showToast, pulseKey]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection debe usarse dentro de <SelectionProvider>');
  return ctx;
}
