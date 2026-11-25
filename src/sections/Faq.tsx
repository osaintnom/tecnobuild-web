/** Tus dudas: las tres objeciones, con respuesta concreta. */
export function Faq() {
  return (
    <section className="faq-sec" id="dudas" data-tone="light" data-ch="dudas">
      <div className="wrap">
        <p className="eyebrow">Tus dudas</p>
        <ul className="faq">
          <li>
            <q className="rv">No los conozco.</q>
            <p>Es razonable. <b>TECNO.BUILD es parte de Eurotechnologie Group, un grupo que importa hace más de diez años</b>, con oficinas en Hong Kong, Miami y Buenos Aires. Y quien te cotiza es quien después responde por la obra.</p>
          </li>
          <li>
            <q className="rv">¿Y si se atrasa?</q>
            <p>Seguimos cada pedido de la fábrica a la obra: producción, embarque, tránsito y despacho. <b>Tenés un solo contacto</b> que te avisa en qué etapa está tu material.</p>
          </li>
          <li>
            <q className="rv">¿Y si algo falla?</q>
            <p><b>Nos llamás a nosotros.</b> Vendemos e instalamos, así que no hay un proveedor del producto y otro de la instalación pasándose la responsabilidad.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
