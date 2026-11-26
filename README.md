# TECNO.BUILD — sitio web

Sitio en Next.js + TypeScript, con GSAP/ScrollTrigger y Lenis. Dos páginas: **quiénes somos** (`/`) y **catálogo** (`/catalogo/`, edificio interactivo, grilla filtrable y cotización), en español y en inglés (`/en/`, `/en/catalog/`).
Contexto, tono y decisiones del proyecto: ver [`CLAUDE.md`](CLAUDE.md).

## Trabajar en local

Requiere Node 20 o superior.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # sitio estático en out/
```

## Catálogo desde el maestro

El catálogo sale del maestro de modelos (Excel en Google Drive). El maestro tiene datos internos y **nunca** va al repo.

```sh
# 1. Bajar el maestro de Drive a data/TB-modelos-MAESTRO.xlsx
# 2. Generar el catálogo público (solo columnas publicables y lo activo)
npm run sync:catalogo
```

Genera `src/content/catalogo.json` y `public/catalogo/modelos/*.json`. Fotos opcionales en `public/catalogo/fotos/<FAMILIA>/principal.webp`.

## Estructura

| Carpeta | Qué hay |
|---|---|
| `src/app/` | Un layout raíz por idioma (`(es)/`, `(en)/`) sobre `RootHtml.tsx` (fuentes, metadatos), las rutas de cada página y estilos globales |
| `src/views/` | Las dos páginas (`HomePage`, `CatalogPage`), compartidas por los dos idiomas |
| `src/i18n/` | Idiomas y rutas (`config.ts`), diccionarios `es.tsx` / `en.tsx`, textos del catálogo en inglés (`catalog-en.ts`) y `useI18n()` |
| `src/sections/` | Una sección por archivo. Quiénes somos: Hero, About, Origin (+ llegada), Responsible, BuildingShowcase, Clients, Faq, Contact. Catálogo: CatalogView, Quote |
| `src/components/` | Encabezado e índice de capítulos, configurador, resumen de selección, hojas, pie |
| `src/content/` | Catálogo generado (`catalogo.json`), tipos y ambientes (`catalog.ts`), contacto y oficinas (`site.ts`) |
| `scripts/` | `sync-catalogo.mjs`: maestro → catálogo público |
| `src/lib/` | Dibujos SVG (corte del edificio y vistas previas), helpers de motion y scroll |
| `src/state/` | Estado de la selección, configurador, resumen y avisos |
| `docs/referencia/` | Prototipo navegable original (referencia de experiencia) |

## Motion

- `html.pin-on`: tramos fijados (desktop ≥ 900 px, sin "reducir movimiento").
- `html.anim`: animaciones habilitadas. Con `prefers-reduced-motion` todo queda estático y legible.
- Lenis solo en desktop; cada sección crea sus `ScrollTrigger` con `gsap.matchMedia`.

## Pendientes

Catálogo 2026 real, backend del formulario, número de WhatsApp, logo en vector, fotos, medidas y detalles de modelos en inglés (columnas en el maestro).
