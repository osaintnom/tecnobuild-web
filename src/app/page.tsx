import { SelectionProvider } from '@/state/selection';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Reveals } from '@/components/Reveals';
import { PageChrome } from '@/components/PageChrome';
import { Configurator } from '@/components/Configurator';
import { SelectionSummary } from '@/components/SelectionSummary';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { Hero } from '@/sections/Hero';
import { Origin } from '@/sections/Origin';
import { Building } from '@/sections/Building';
import { Responsible } from '@/sections/Responsible';
import { Process } from '@/sections/Process';
import { Faq } from '@/sections/Faq';
import { Quote } from '@/sections/Quote';

// Quiénes somos — concepto "Corte": 8 secciones en 4 actos (ver CLAUDE.md).
export default function Page() {
  return (
    <SelectionProvider>
      <SmoothScroll />
      <Reveals />
      <PageChrome />
      <main>
        <Hero />
        <Origin />
        <Building />
        <Responsible />
        <Process />
        <Faq />
        {/* 7 · Obras: oculto hasta tener la primera obra con fotos. */}
        <Quote />
      </main>
      <Footer />
      <Configurator />
      <SelectionSummary />
      <Toast />
    </SelectionProvider>
  );
}
