import { SelectionProvider } from '@/state/selection';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Reveals } from '@/components/Reveals';
import { PageChrome } from '@/components/PageChrome';
import { Configurator } from '@/components/Configurator';
import { SelectionSummary } from '@/components/SelectionSummary';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Origin } from '@/sections/Origin';
import { Responsible } from '@/sections/Responsible';
import { BuildingShowcase } from '@/sections/BuildingShowcase';
import { Clients } from '@/sections/Clients';
import { Faq } from '@/sections/Faq';
import { Contact } from '@/sections/Contact';

const CHAPTERS = [
  ['quienes', 'Quiénes somos'], ['origen', 'Recorrido'], ['responsable', 'Responsable'],
  ['edificio', 'Edificio'], ['empresas', 'Empresas'], ['dudas', 'Dudas'], ['contacto', 'Contacto'],
] as const;

// Quiénes somos: quiénes son, cómo importan y quiénes confiaron. El catálogo y la cotización viven en /catalogo.
export default function Page() {
  return (
    <SelectionProvider>
      <SmoothScroll />
      <Reveals />
      <PageChrome page="home" chapters={CHAPTERS} />
      <main>
        <Hero />
        <About />
        <Origin />
        <Responsible />
        <BuildingShowcase />
        <Clients />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Configurator />
      <SelectionSummary />
      <Toast />
    </SelectionProvider>
  );
}
