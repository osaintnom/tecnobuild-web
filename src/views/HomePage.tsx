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
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Origin } from '@/sections/Origin';
import { Responsible } from '@/sections/Responsible';
import { BuildingShowcase } from '@/sections/BuildingShowcase';
import { Clients } from '@/sections/Clients';
import { Faq } from '@/sections/Faq';
import { Contact } from '@/sections/Contact';

// Índice lateral de capítulos: ids de sección (los textos están en el diccionario, chrome.chapters).
const CHAPTERS = ['quienes', 'origen', 'responsable', 'edificio', 'empresas', 'dudas', 'contacto'] as const;

export const homeMetadata = (locale: Locale): Metadata => {
  const t = (locale === 'en' ? en : es).meta;
  return { title: t.homeTitle, description: t.homeDesc, alternates: alternates(locale, 'home') };
};

// Quiénes somos: quiénes son, cómo importan y quiénes confiaron. El catálogo y la cotización viven en /catalogo.
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <StructuredData locale={locale} page="home" />
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
    </I18nProvider>
  );
}
