/**
 * Íconos de línea para cada etapa del recorrido «De la fábrica a tu obra», mientras no haya fotos reales.
 * Mismo trazo que el corte del edificio; la parte en naranja (.ac) se enciende cuando la etapa está activa.
 * Orden: 0 búsqueda · 1 producción · 2 embarque · 3 tránsito · 4 importación y despacho.
 */
const PATHS: React.ReactNode[] = [
  // Búsqueda de fábricas: muestra bajo la lupa
  <>
    <rect x="6" y="30" width="22" height="16" />
    <path d="M6 38h22" />
    <circle className="ac" cx="34" cy="20" r="11" />
    <path className="ac" d="M42 28l12 12" />
  </>,
  // Producción: fábrica con chimenea
  <>
    <path d="M6 54V30l12 8v-8l12 8v-8l12 8V12h8v42z" />
    <path d="M4 54h52" />
    <path className="ac" d="M14 46h6M26 46h6M38 46h6" />
  </>,
  // Embarque: contenedor colgando de la grúa
  <>
    <path d="M10 56V8h40" />
    <path d="M10 14l8-6" />
    <path d="M40 8v14" />
    <rect className="ac" x="26" y="22" width="28" height="16" />
    <path className="ac" d="M33 22v16M40 22v16M47 22v16" />
    <path d="M4 56h52" />
  </>,
  // Tránsito: buque sobre el agua
  <>
    <path d="M8 36h44l-6 12H14z" />
    <path className="ac" d="M18 36V26h10v10M30 36V22h10v14" />
    <path d="M4 54c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3 4-3 8-3 4 3 8 3" />
  </>,
  // Importación y despacho: documento sellado
  <>
    <path d="M14 6h24l10 10v38H14z" />
    <path d="M38 6v10h10" />
    <path d="M20 24h18M20 31h22M20 38h12" />
    <circle className="ac" cx="40" cy="45" r="9" />
    <path className="ac" d="M36 45l3 3 5-6" />
  </>,
];

export function StageIcon({ i }: { i: number }) {
  return (
    <svg className="o-ic" viewBox="0 0 60 60" width="60" height="60" aria-hidden="true" focusable="false">
      {PATHS[i]}
    </svg>
  );
}
