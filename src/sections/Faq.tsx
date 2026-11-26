import { EtgLink } from '@/components/EtgLink';

/**
 * Tus dudas: las tres objeciones, como desplegables (<details>, sin JS: funciona con teclado y lector de pantalla).
 * Todas cerradas de entrada para que la sección ocupe poco, sobre todo en mobile.
 */
export function Faq() {
  return (
    <section className="faq-sec" id="dudas" data-tone="light" data-ch="dudas">
      <div className="wrap">
        <p className="eyebrow">Tus dudas</p>
        <div className="faq">
          <details className="faq-item">
            <summary><q className="rv">No los conozco.</q><span className="faq-ic" aria-hidden="true" /></summary>
            <p>
              Es razonable: somos una empresa nueva. <b>TECNO.BUILD nace de <EtgLink />, un grupo que importa hace más de diez años</b>,
              con un objetivo: simplificar la búsqueda de proveedores y la importación para bajar el costo de construir.
              Elegimos las fábricas, probamos las muestras y te traemos <b>terminaciones de excelente calidad al mejor precio</b>,
              directo de origen a tu obra.
            </p>
          </details>
          <details className="faq-item">
            <summary><q className="rv">¿Y si se atrasa?</q><span className="faq-ic" aria-hidden="true" /></summary>
            <p>Seguimos cada pedido de la fábrica a la obra: producción, embarque, tránsito y despacho. <b>Tenés un solo contacto</b> que te avisa en qué etapa está tu material.</p>
          </details>
          <details className="faq-item">
            <summary><q className="rv">¿Y si algo falla?</q><span className="faq-ic" aria-hidden="true" /></summary>
            <p><b>Nos llamás a nosotros.</b> Vendemos e instalamos, así que no hay un proveedor del producto y otro de la instalación pasándose la responsabilidad.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
