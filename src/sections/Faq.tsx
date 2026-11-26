import { EtgLink } from '@/components/EtgLink';

/**
 * Tus dudas: las tres objeciones, como acordeón (<details>, sin JS: funciona con teclado y lector de pantalla).
 * La primera queda abierta para que se entienda que el resto también se abre.
 */
export function Faq() {
  return (
    <section className="faq-sec" id="dudas" data-tone="light" data-ch="dudas">
      <div className="wrap">
        <p className="eyebrow">Tus dudas</p>
        <div className="faq">
          <details className="faq-item" open>
            <summary><q className="rv">No los conozco.</q><span className="faq-ic" aria-hidden="true" /></summary>
            <p>
              Es razonable: TECNO.BUILD es una empresa nueva. <b>Nace de <EtgLink />, un grupo que importa hace más de diez años</b>, para
              simplificar la parte más difícil de comprar afuera: encontrar buenas fábricas e importar. Las visitamos, probamos muestras
              antes de comprar en volumen y traemos cada terminación directo de la fábrica a tu obra. <b>Así bajás el costo de construir
              sin resignar calidad.</b>
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
