import type { Metadata, Viewport } from 'next';
import { Archivo, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://tecno.build'),
  title: 'TECNO.BUILD · Construimos con el mundo.',
  description: 'Terminaciones de edificios: pisos y revestimientos, puertas, cocinas y baños. Elegimos en origen, importamos y nos hacemos cargo de la instalación en el AMBA.',
  openGraph: { type: 'website', locale: 'es_AR', siteName: 'TECNO.BUILD' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1C1C1C' };

// Aplica los modos de movimiento antes del primer pintado para evitar saltos de layout.
const modes = `(function(){var r=document.documentElement,m=function(q){return matchMedia(q).matches};
var red=m('(prefers-reduced-motion: reduce)');if(!red)r.classList.add('anim');
if(!red&&m('(min-width: 900px)'))r.classList.add('pin-on');})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modes }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
