# TECNO.BUILD — Web "Quiénes Somos"

Contexto y decisiones del proyecto. Leer antes de modificar el sitio. Si una tarea contradice algo de acá, consultar antes de cambiarlo.

## La empresa (confirmado)

- **TECNO.BUILD by Eurotechnologie Group.** Proveedor de terminaciones de edificios: producto importado + instalación, con un solo responsable.
- **Categorías:** pisos y revestimientos, puertas, cocinas, baños.
- **Origen:** selección de fábricas en Asia. Visitan las fábricas y prueban muestras antes de comprar en volumen. No hay inspección pre-embarque ni certificaciones: no afirmarlas.
- **Oficinas:** Hong Kong (búsqueda de fábricas), Miami (compras y logística), Buenos Aires (venta e instalación).
- **Alcance:** AMBA.
- **Respaldo:** Eurotechnologie Group, grupo importador con más de 10 años (el año exacto está pendiente; usar "más de diez años").
- **Cliente principal:** desarrolladoras y constructoras. Decide el dueño o director.
- **Competencia:** fabricantes nacionales y distribuidores locales.
- **Objeciones a responder:** "no los conozco", "¿y si se atrasa?", "¿y si algo falla?".

## Mensaje y tono

- **Tagline:** "Construimos con el mundo." — va sola, sin bajada. En inglés: "We build with the world."
- **Rótulo de categoría en el hero:** "Terminaciones de edificios".
- **Esencia interna (no publicar como claim):** "Nos hacemos cargo."
- **Registro:** español rioplatense con **vos** ("Pedí tu cotización", "Contanos tu obra").
- **CTA principal:** "Pedí tu cotización" — usar siempre este texto. WhatsApp es canal secundario.
- **Estilo:** hechos antes que adjetivos, frases cortas, voz activa. Evitar "líderes del mercado", "soluciones integrales", "equipo altamente capacitado".

## Lo que NO se puede afirmar todavía

- Garantía con años definidos, plazos en contrato, equipo propio de instalación (hoy hay subcontratistas: decir "nos hacemos cargo de la instalación", nunca "nuestro equipo de instaladores").
- Obras, clientes, testimonios o cifras: no existen aún.
- Plazos concretos de cada etapa ("a definir").
- Confirmación del formulario: "Recibimos tu consulta. Te vamos a contactar." — **sin plazo**.
- "Mejor precio" solo con cautela, sin números.

## Identidad visual

- **Colores:** carbón `#1C1C1C`, naranja `#D16B21` (botones con texto blanco: `#BF5F1A` por contraste), hueso `#FAFAF5`, gris cálido `#ADADA8`.
- **Tipografía:** Archivo expandida (títulos), Inter (texto), IBM Plex Mono (rótulos, códigos, coordenadas, cotas).
- **Recurso de marca:** la barra/línea naranja del logo es el hilo de toda la página.
- **Imágenes:** casi no hay material. Los espacios de imagen quedan rotulados. Se puede usar IA para ambientes y texturas; **nunca** para obras, fábricas o personas presentadas como reales.

## Concepto y estructura (concepto "Corte", movimiento medio)

Página en español, 8 secciones en 4 actos:

1. **Hero** (carbón) — rótulo + "Construimos con el mundo." + línea naranja.
2. **Prólogo: el origen** (carbón, fijado, horizontal en desktop) — Asia → Hong Kong → Miami.
   - Transición "Llegada a la obra": la línea baja, se vuelve el suelo y el fondo pasa de carbón a hueso.
3. **El edificio** (hueso) — corte técnico transparente: PB + 7 pisos + azotea. Cada categoría ocupa sus propios pisos (hoy dos por categoría, de abajo hacia arriba: pisos y revestimientos PB–P1 → puertas P2–P3 → cocinas P4–P5 → baños P6–P7) para que los productos no se mezclen. Al bajar, los pisos de la categoría se encienden en naranja con glow y rótulos; el resto se atenúa. El reparto se edita en `FLOORS` (`src/content/catalog.ts`) y se ajusta cuando esté el catálogo real.
4. **Un solo responsable** (fijado) — cuatro líneas de proveedores convergen en una línea naranja.
5. **Cómo trabajamos** — 5 pasos: consulta, selección, importación, entrega, instalación.
6. **Tus dudas** — las tres objeciones con respuesta concreta.
7. **Obras** — módulo previsto, **oculto** hasta tener la primera obra con fotos.
8. **Pedí tu cotización** (carbón) — formulario con la selección precargada; la línea termina subrayando "Enviar consulta".

Elementos globales: encabezado con "Pedí tu cotización" siempre visible, contador "Tu selección (n)", índice de capítulos lateral (desktop), selector ES/EN.

## Configurador ("armá tu 0 km")

- Por categoría: **modelo → configuración con opciones acotadas** (2–3 atributos, máx. 6 opciones c/u, la vista previa cambia) **→ campo libre de personalización → "Agregar a mi cotización"** → siguiente categoría o cerrar.
- **Sin precios** ("Precio a cotizar") y **sin cantidades** (el volumen sale del tamaño de obra del formulario).
- Mismo componente en "Quiénes Somos" (modelos destacados, hasta 6 por categoría) y en la futura página de Catálogo (todos).
- **Los modelos actuales son de ejemplo.** Reemplazar por el catálogo 2026 estructurado: categoría, línea, modelo, código, atributos, opciones, muestra de color/textura e imagen.

## Formulario de cotización

Campos: nombre*, empresa, teléfono o WhatsApp*, ubicación de la obra*, tamaño aproximado (unidades o m²), categorías (precargadas desde la selección), mensaje. Hoy no envía datos: falta definir backend o servicio.

## Versión en inglés

No es una traducción. Es una página propia para **fábricas y proveedores chinos**, en inglés simple (frases cortas, sin modismos), 6 secciones: hero, quiénes somos, qué compramos, dónde vendemos, cómo trabajamos con fábricas, formulario de proveedores. Sin instalación ni cotización. Pendiente de construir.

## Motion y accesibilidad

- El movimiento acompaña la lectura, nunca la retiene. Tramos fijados máx. ~320 vh.
- Con `prefers-reduced-motion`: sin secciones fijadas ni animaciones sincronizadas; todo estático y legible.
- En mobile: sin scroll horizontal; edificio como miniatura fija arriba; configurador como hoja inferior.
- Sin WebGL ni video (no aportan hoy).

## Estado y pendientes

- `docs/referencia/prototipo-quienes-somos.html`: prototipo navegable en un solo archivo (HTML + CSS + JS sin dependencias). Referencia de experiencia, no código final.
- **Frontend (etapa 8) en curso:** Next.js + TypeScript + GSAP/ScrollTrigger + Lenis, export estático (`out/`). La página replica el prototipo; estructura en `README.md`.
- Próximas etapas: 6 design system · 7 copy definitivo · 8 frontend (stack recomendado: Next.js + TypeScript, GSAP/ScrollTrigger, Lenis para smooth scroll en desktop) · 9 responsive · 10 performance y accesibilidad.
- Datos pendientes: catálogo 2026 por modelo, año de inicio de Eurotechnologie, plazos por etapa, número de WhatsApp, logo en vector, fotos.

## Documentos de referencia (claude.ai)

- Estrategia (Etapa 2): https://claude.ai/artifact/WQTsMND4MLxDUPjSPjciLt
- Conceptos (Etapa 3): https://claude.ai/artifact/XrP2Pt1wV32LJ5nVg75SfR
- Arquitectura (Etapa 4): https://claude.ai/artifact/6mzaeuSzL5QWGA2mKVLior
- Guion de scroll (Etapa 5): https://claude.ai/artifact/CySNsb1sszENK9YAn19aq7
- Manual de marca Bases v1: https://claude.ai/artifact/Vt6EVoj48Go1CFP8YthbJF
