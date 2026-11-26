import type { Metadata } from 'next';
import { alternates, type Locale } from '@/i18n/config';
import { I18nProvider } from '@/i18n/I18nProvider';
import { es } from '@/i18n/es';
import { en } from '@/i18n/en';
import { SelectionProvider } from '@/state/selection';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Reveals } from '@/components/Reveals';
import { PageChrome } from '@/components/PageChrome';
import { Configurator } from '@/components/Configurator';
import { SelectionSummary } from '@/components/SelectionSummary';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';
import { CatalogView } from '@/sections/CatalogView';
import { Quote } from '@/sections/Quote';

export const catalogMetadata = (locale: Locale): Metadata => {
  const t = (locale === 'en' ? en : es).meta;
  return { title: t.catalogTitle, description: t.catalogDesc, alternates: alternates(locale, 'catalog') };
};

// Catálogo: edificio interactivo + grilla filtrable + formulario de cotización con la selección precargada.
export function CatalogPage({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <StructuredData locale={locale} page="catalog" />
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
    </I18nProvider>
  );
}
