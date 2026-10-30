import { OFFICES } from '@/content/site';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="offices">
          {OFFICES.map((o) => (
            <div className="office" key={o.city}>
              <h3>{o.city}</h3>
              <p>{o.role}</p>
              <p className="coord">{o.coord}</p>
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <span><span className="lg">TECNO.BUILD</span>&nbsp; by Eurotechnologie Group</span>
          <span>Quiénes Somos · textos y modelos de ejemplo</span>
          <span>© {new Date().getFullYear()} TECNO.BUILD</span>
        </div>
      </div>
    </footer>
  );
}
