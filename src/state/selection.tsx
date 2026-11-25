'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { famById, type AmbId } from '@/content/catalog';

/** Un modelo elegido: el código TB exacto viaja en el pedido de cotización. */
export interface SelItem { codigo: string; familia: string; nombre: string; detalle: string; ambiente: AmbId; nota: string }
/** Filtro del catálogo compartido entre la grilla, el edificio y el configurador. */
export interface Filtro { ambiente?: AmbId; rubro?: string; categoria?: string }

interface Ctx {
  selection: Map<string, SelItem>;
  upsert: (item: SelItem) => void;
  remove: (codigo: string) => void;
  clear: () => void;
  filtro: Filtro;
  setFiltro: (f: Filtro) => void;
  // Hojas (configurador y resumen) y avisos. El configurador abre una familia; `cfgCodigo` preselecciona un modelo.
  cfgFamilia: string | null;
  cfgCodigo: string | null;
  openConfigurator: (familia: string, codigo?: string) => void;
  closeConfigurator: () => void;
  summaryOpen: boolean;
  setSummaryOpen: (v: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  pulseKey: number;
  pulse: () => void;
}

const SelectionContext = createContext<Ctx | null>(null);
const STORE = 'tb-seleccion-v2';

// La selección se guarda en el navegador para que siga ahí al pasar de una página a otra.
function load(): Map<string, SelItem> {
  try {
    const raw = localStorage.getItem(STORE);
    const items: SelItem[] = raw ? JSON.parse(raw) : [];
    return new Map(items.filter((s) => s.codigo && famById[s.familia]).map((s) => [s.codigo, s]));
  } catch { return new Map(); }
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Map<string, SelItem>>(() => new Map());
  const [filtro, setFiltro] = useState<Filtro>({});
  const [cfgFamilia, setCfgFamilia] = useState<string | null>(null);
  const [cfgCodigo, setCfgCodigo] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const loaded = useRef(false);

  useEffect(() => { setSelection(load()); loaded.current = true; }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORE, JSON.stringify([...selection.values()])); } catch { /* sin almacenamiento: queda en memoria */ }
  }, [selection]);

  const upsert = useCallback((item: SelItem) => setSelection((s) => new Map(s).set(item.codigo, item)), []);
  const remove = useCallback((id: string) => setSelection((s) => { const n = new Map(s); n.delete(id); return n; }), []);
  const clear = useCallback(() => setSelection(new Map()), []);
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const value = useMemo<Ctx>(() => ({
    selection, upsert, remove, clear,
    filtro, setFiltro,
    cfgFamilia, cfgCodigo,
    openConfigurator: (fam, codigo) => { setSummaryOpen(false); setCfgCodigo(codigo ?? null); setCfgFamilia(fam); },
    closeConfigurator: () => setCfgFamilia(null),
    summaryOpen, setSummaryOpen,
    toast, showToast,
    pulseKey, pulse: () => setPulseKey((k) => k + 1),
  }), [selection, upsert, remove, clear, filtro, cfgFamilia, cfgCodigo, summaryOpen, toast, showToast, pulseKey]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection debe usarse dentro de <SelectionProvider>');
  return ctx;
}
