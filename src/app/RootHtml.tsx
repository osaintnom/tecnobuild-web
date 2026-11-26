import type { Metadata, Viewport } from 'next';
import { Archivo, Inter, IBM_Plex_Mono } from 'next/font/google';
import type { Locale } from '@/i18n/config';
import { es } from '@/i18n/es';
import { en } from '@/i18n/en';
import { SITE_URL } from '@/content/site';
import { OG_SIZE } from '@/lib/og';
import './globals.css';

// Documento raíz compartido. Cada idioma tiene su layout raíz ((es)/layout.tsx y (en)/layout.tsx)
// que solo fija el idioma: así el HTML estático ya sale con el <html lang> correcto.

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const rootMetadata = (locale: Locale): Metadata => {
  const t = (locale === 'en' ? en : es).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: t.homeTitle,
    description: t.homeDesc,
    openGraph: {
      type: 'website',
      locale: t.ogLocale,
      alternateLocale: locale === 'en' ? 'es_AR' : 'en_US',
      siteName: 'TECNO.BUILD',
      // La imagen la generan src/app/(es)/og.png y src/app/(en)/en/og.png en el build.
      images: [{ url: locale === 'en' ? '/en/og.png' : '/og.png', ...OG_SIZE, alt: t.homeTitle, type: 'image/png' }],
    },
    twitter: { card: 'summary_large_image' },
  };
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1C1C1C' };

// Aplica los modos de movimiento antes del primer pintado para evitar saltos de layout.
const modes = `(function(){var r=document.documentElement,m=function(q){return matchMedia(q).matches};
var red=m('(prefers-reduced-motion: reduce)');if(!red)r.classList.add('anim');
if(!red&&m('(min-width: 900px)'))r.classList.add('pin-on');})();`;

export function RootHtml({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modes }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
