import { ImageResponse } from 'next/og';
import type { Locale } from '@/i18n/config';
import { es } from '@/i18n/es';
import { en } from '@/i18n/en';

// Imagen para compartir (Open Graph / redes), una por idioma. Se genera en el build con los
// colores y las tipografías de la marca; los textos salen del diccionario.

export const OG_SIZE = { width: 1200, height: 630 };

const C = { carbon: '#1C1C1C', orange: '#D16B21', bone: '#FAFAF5', grey: '#ADADA8' };

/** Baja una tipografía de Google Fonts en TTF (el generador de imágenes no lee woff2). */
async function googleFont(query: string): Promise<ArrayBuffer> {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${query}`, { headers: { 'User-Agent': 'Mozilla/4.0' } })).text();
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`Tipografía no encontrada: ${query}`);
  return (await fetch(url)).arrayBuffer();
}

export async function ogImage(locale: Locale) {
  const t = locale === 'en' ? en : es;
  const [display, mono] = await Promise.all([googleFont('Archivo:wdth,wght@115,600'), googleFont('IBM+Plex+Mono:wght@500')]);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: C.carbon, padding: '64px 72px', fontFamily: 'Plex' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontFamily: 'Archivo', fontSize: 34, color: C.bone, letterSpacing: '0.02em' }}>
            TECNO<span style={{ color: C.orange }}>.</span>BUILD
          </div>
          <div style={{ width: 52, height: 4, background: C.orange, marginTop: 8 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {t.hero.title.map((l) => (
            <div key={l} style={{ fontFamily: 'Archivo', fontSize: 112, lineHeight: 1, letterSpacing: '-0.035em', color: C.bone }}>{l}</div>
          ))}
          <div style={{ width: 200, height: 6, background: C.orange, marginTop: 40 }} />
          <div style={{ display: 'flex', marginTop: 28, fontSize: 24, color: C.bone, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.hero.kicker}</div>
          <div style={{ display: 'flex', marginTop: 10, fontSize: 24, color: C.grey, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t.hero.cats.join('  /  ')}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 20, color: C.grey, letterSpacing: '0.04em' }}>
          {t.offices.map((o) => o.city).join('  ·  ')}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Archivo', data: display, weight: 600, style: 'normal' },
        { name: 'Plex', data: mono, weight: 500, style: 'normal' },
      ],
    },
  );
}
