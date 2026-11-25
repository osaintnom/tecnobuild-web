import type { Metadata } from 'next';
import { SelectionProvider } from '@/state/selection';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Reveals } from '@/components/Reveals';
import { PageChrome } from '@/components/PageChrome';
import { Configurator } from '@/components/Configurator';
import { SelectionSummary } from '@/components/SelectionSummary';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { CatalogView } from '@/sections/CatalogView';
import { Quote } from '@/sections/Quote';

export const metadata: Metadata = {
  title: 'Catálogo · TECNO.BUILD',
  description: 'Elegí las terminaciones de tu obra sobre el corte del edificio, configuralas y pedí tu cotización.',
};

// Catálogo: edificio interactivo + grilla filtrable + formulario de cotización con la selección precargada.
export default function CatalogPage() {
  return (
    <SelectionProvider>
      <SmoothScroll />
      <Reveals />
      <PageChrome page="catalog" />
      <main className="main-catalog">
        <CatalogView />
        <Quote />
      </main>
      <Footer />
      <Configurator />
      <SelectionSummary />
      <Toast />
    </SelectionProvider>
  );
}
