import { publicUrl } from '@/content/catalog';

/**
 * Empresas que ya confiaron en nosotros. Los nombres, lo que les trajimos y los logos los pasa TECNO.BUILD.
 * No inventar empresas ni citas: el texto es nuestro, no una frase del cliente.
 * Sin espacios vacíos: se muestran solo las empresas reales.
 */
type Client = { name: string; url: string; tipo: string; trajimos: string[]; texto: string; logo?: string };

const CLIENTS: Client[] = [
  {
    name: 'Sentire',
    url: 'https://sentire.com.ar/',
    tipo: 'Desarrolladora · Buenos Aires',
    trajimos: ['Barandas', 'Puertas'],
    texto: 'Les trajimos barandas y puertas para su obra, y están muy conformes con el producto.',
    // Logo de sentire.com.ar (original en blanco), pasado a carbón para verse sobre la tarjeta
    logo: '/clientes/sentire.svg',
  },
];

export function Clients() {
  return (
    <section className="clients" id="empresas" data-tone="light" data-ch="empresas">
      <div className="wrap">
        <div className="cl-head">
          <p className="eyebrow">Empresas que confiaron en nosotros</p>
          <h2 className="h2 rv">Ya construyen con nosotros.</h2>
        </div>
        <ul className="cl-list">
          {CLIENTS.map((c) => (
            <li key={c.name} className="cl-card">
              <a className="cl-brand" href={c.url} target="_blank" rel="noopener noreferrer">
                {c.logo ? <img src={publicUrl(c.logo)} alt={c.name} width={284} height={103} /> : <span className="cl-name">{c.name}</span>}
                <span className="cl-tipo">{c.tipo}</span>
              </a>
              <div className="cl-body">
                <ul className="cl-tags" aria-label="Qué les trajimos">
                  {c.trajimos.map((t) => <li key={t}>{t}</li>)}
                </ul>
                <p>{c.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
