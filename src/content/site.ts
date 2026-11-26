// Datos de contacto y oficinas.
// Pendientes (ver CLAUDE.md): número de WhatsApp y año de inicio de Eurotechnologie.
/** Dominio final del sitio: canonical, hreflang, sitemap y datos estructurados apuntan acá. */
export const SITE_URL = 'https://tecno.build';

export const EUROTECHNOLOGIE_URL = 'https://www.eurotechnologie.co/';

export const CONTACT = {
  email: 'facundo@tecno.build',
  whatsapp: null as string | null, // número a confirmar
};

// Coordenadas de cada oficina, en el mismo orden que `offices` en los diccionarios (src/i18n), que tienen ciudad y rol.
export const OFFICES = [
  { coord: '22.32°N 114.17°E' },
  { coord: '22.54°N 114.06°E' },
  { coord: '25.76°N 80.19°W' },
  { coord: '34.60°S 58.38°W' },
];
