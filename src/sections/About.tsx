/** Quiénes somos: qué hacemos, quién nos respalda y dónde estamos. */
const PILLARS = [
  { k: 'Origen', title: 'Elegimos las fábricas', body: 'Desde Hong Kong buscamos fábricas y en Shenzhen las visitamos. Probamos muestras antes de comprar en volumen.' },
  { k: 'Importación', title: 'Traemos el material', body: 'Compramos en origen y el material viaja directo de la fábrica a la Argentina. Nos ocupamos de la importación y de los trámites.' },
  { k: 'Obra', title: 'Lo instalamos', body: 'Entregamos en tu obra y nos hacemos cargo de la instalación en el AMBA. Un solo responsable de punta a punta.' },
];

const PLACES = [
  { city: 'Hong Kong', role: 'Búsqueda de fábricas', coord: '22.32°N 114.17°E' },
  { city: 'Shenzhen', role: 'Zona de fábricas', coord: '22.54°N 114.06°E' },
  { city: 'Miami', role: 'Administración', coord: '25.76°N 80.19°W' },
  { city: 'Buenos Aires', role: 'Venta e instalación · AMBA', coord: '34.60°S 58.38°W' },
];

export function About() {
  return (
    <section className="about tone-dark" id="quienes" data-tone="dark" data-ch="quienes">
      <div className="wrap">
        <div className="ab-head">
          <p className="eyebrow">Quiénes somos</p>
          <h2 className="h2 rv">Importamos las terminaciones de tu obra.</h2>
          <p className="lead">
            TECNO.BUILD es parte de Eurotechnologie Group, un grupo que importa hace más de diez años.
            Trabajamos con desarrolladoras y constructoras: pisos y revestimientos, puertas, cocinas, baños y más.
          </p>
        </div>

        <ol className="ab-pillars">
          {PILLARS.map((p, i) => (
            <li key={p.k}>
              <p className="ab-k"><b>{String(i + 1).padStart(2, '0')}</b> {p.k}</p>
              <h3 className="h3">{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>

        <ul className="ab-places" aria-label="Dónde estamos">
          {PLACES.map((p) => (
            <li key={p.city}>
              <span className="ab-city">{p.city}</span>
              <span className="ab-role">{p.role}</span>
              <span className="coord">{p.coord}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
