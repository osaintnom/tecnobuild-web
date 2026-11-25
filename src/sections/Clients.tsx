/**
 * Empresas que ya confiaron en nosotros. Los nombres y logos los pasa TECNO.BUILD: hasta tenerlos,
 * los espacios quedan rotulados. No inventar empresas.
 */
const CLIENTS: { name: string; logo?: string }[] = [];
const SLOTS = 6;

export function Clients() {
  const items = CLIENTS.length ? CLIENTS : Array.from({ length: SLOTS }, () => null);
  return (
    <section className="clients" id="empresas" data-tone="light" data-ch="empresas">
      <div className="wrap">
        <div className="cl-head">
          <p className="eyebrow">Empresas que confiaron en nosotros</p>
          <h2 className="h2 rv">Ya construyen con nosotros.</h2>
        </div>
        <ul className="cl-grid">
          {items.map((c, i) =>
            c ? (
              <li key={c.name}>{c.logo ? <img src={c.logo} alt={c.name} /> : <span className="cl-name">{c.name}</span>}</li>
            ) : (
              <li key={i} className="cl-ph"><span>Logo pendiente</span></li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
