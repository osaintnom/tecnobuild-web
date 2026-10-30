# TECNO.BUILD — sitio web

Página "Quiénes somos" (concepto **Corte**) en Next.js + TypeScript, con GSAP/ScrollTrigger y Lenis.
Contexto, tono y decisiones del proyecto: ver [`CLAUDE.md`](CLAUDE.md).

## Trabajar en local

Requiere Node 20 o superior.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # sitio estático en out/
```

## Estructura

| Carpeta | Qué hay |
|---|---|
| `src/app/` | Layout (fuentes, metadatos), página y estilos globales |
| `src/sections/` | Una sección por archivo: Hero, Origin (+ llegada), Building, Responsible, Process, Faq, Quote |
| `src/components/` | Encabezado e índice de capítulos, configurador, resumen de selección, hojas, pie |
| `src/content/` | Catálogo de ejemplo (`catalog.ts`) y datos de contacto/oficinas (`site.ts`) |
| `src/lib/` | Dibujos SVG (corte del edificio y vistas previas), helpers de motion y scroll |
| `src/state/` | Estado de la selección, configurador, resumen y avisos |
| `docs/referencia/` | Prototipo navegable original (referencia de experiencia) |

## Motion

- `html.pin-on`: tramos fijados (desktop ≥ 900 px, sin "reducir movimiento").
- `html.anim`: animaciones habilitadas. Con `prefers-reduced-motion` todo queda estático y legible.
- Lenis solo en desktop; cada sección crea sus `ScrollTrigger` con `gsap.matchMedia`.

## Pendientes

Catálogo 2026 real, backend del formulario, número de WhatsApp, logo en vector, fotos, página en inglés para proveedores.
