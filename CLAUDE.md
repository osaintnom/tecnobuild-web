# TECNO.BUILD — Web "Quiénes Somos"

Contexto y decisiones del proyecto. Leer antes de modificar el sitio. Si una tarea contradice algo de acá, consultar antes de cambiarlo.

## La empresa (confirmado)

- **TECNO.BUILD by Eurotechnologie Group.** Proveedor de terminaciones de edificios: producto importado + instalación, con un solo responsable.
- **Categorías:** pisos y revestimientos, puertas, cocinas, baños.
- **Origen:** selección de fábricas en Asia. Shenzhen (China) es la zona donde están muchas de las fábricas con las que trabajan; no es una oficina. Visitan las fábricas y prueban muestras antes de comprar en volumen. No hay inspección pre-embarque ni certificaciones: no afirmarlas.
- **Oficinas:** Hong Kong (búsqueda de fábricas), Miami (administración; **no** es centro de compras ni de logística: no mencionar logística en Miami), Buenos Aires (venta e instalación). El producto viaja **directo de la fábrica a la Argentina**.
- **Alcance:** AMBA.
- **Respaldo:** Eurotechnologie Group, grupo importador con más de 10 años (el año exacto está pendiente; usar "más de diez años").
- **Link a Eurotechnologie Group:** cada vez que aparezca "Eurotechnologie Group" en el sitio (hero, quiénes somos, tus dudas, pie de las dos páginas y cualquier sección nueva) va como link a https://www.eurotechnologie.co/ en pestaña nueva. Usar el componente `EtgLink` (`src/components/EtgLink.tsx`); la URL está en `src/content/site.ts`.
- **Cliente principal:** desarrolladoras y constructoras. Decide el dueño o director.
- **Competencia:** fabricantes nacionales y distribuidores locales.
- **Objeciones a responder:** "no los conozco", "¿y si se atrasa?", "¿y si algo falla?".

## Mensaje y tono

- **Tagline:** "Construimos con el mundo." — va sola, sin bajada. En inglés: "Built with the world." (decidido el 26/11/2026; reemplaza "We build with the world.").
- **Rótulo de categoría en el hero:** "Importación de terminaciones de obra:", debajo del título y antes de las categorías.
- **Esencia interna (no publicar como claim):** "Nos hacemos cargo."
- **Registro:** español rioplatense con **vos** ("Pedí tu cotización", "Contanos tu obra").
- **Llamados a la acción:** "Armá tu obra" (lleva al catálogo) y "Contactanos" (contacto en quiénes somos). En el encabezado: "Ver catálogo" y "Cotizar". En el catálogo, el formulario se titula "Pedí tu cotización." WhatsApp es canal secundario.
- **Estilo:** hechos antes que adjetivos, frases cortas, voz activa. Evitar "líderes del mercado", "soluciones integrales", "equipo altamente capacitado".

## Lo que NO se puede afirmar todavía

- Garantía con años definidos, plazos en contrato, equipo propio de instalación (hoy hay subcontratistas: decir "nos hacemos cargo de la instalación", nunca "nuestro equipo de instaladores").
- Obras, testimonios o cifras: no existen aún, salvo el cliente de abajo. Nunca poner frases entre comillas como si las dijera un cliente.
- **Empresas que confiaron:** `src/sections/Clients.tsx`, una tarjeta por empresa, sin espacios vacíos. Primer y único cliente hasta ahora (26/11/2026): **Sentire** (desarrolladora, Buenos Aires, sentire.com.ar): les trajimos barandas y puertas y están muy conformes. Logo: `public/clientes/sentire.svg`, bajado de su sitio y pasado de blanco a carbón. Los nombres, lo que se les trajo y los logos los pasa TECNO.BUILD; nunca inventarlos.
- Plazos concretos de cada etapa ("a definir").
- Confirmación del formulario: "Recibimos tu consulta. Te vamos a contactar." — **sin plazo**.
- "Mejor precio" solo con cautela, sin números.

## Identidad visual

- **Colores:** carbón `#1C1C1C`, naranja `#D16B21` (botones con texto blanco: `#BF5F1A` por contraste), hueso `#FAFAF5`, gris cálido `#ADADA8`.
- **Tipografía:** Archivo expandida (títulos), Inter (texto), IBM Plex Mono (rótulos, códigos, coordenadas, cotas).
- **Recurso de marca:** la barra/línea naranja del logo es el hilo de toda la página.
- **Imágenes:** casi no hay material. Los espacios de imagen quedan rotulados. Se puede usar IA para ambientes y texturas; **nunca** para obras, fábricas o personas presentadas como reales.

## Estructura: dos páginas

El foco es el **servicio de importación**. Quiénes somos cuenta quiénes son y cómo trabajan; el catálogo es donde se elige y se cotiza.

### `/` Quiénes somos (corta)
1. **Hero** (carbón) — "Construimos con el mundo." y, debajo, "Importación de terminaciones de obra:" seguido de las categorías con "+ Más" (sin rótulo arriba del título). Botones: "Armá tu obra" y "Contactanos". Fondo interactivo con TECNO.BUILD difuminado.
2. **Quiénes somos** (carbón) — qué hacen (origen, importación, obra) y dónde están: Hong Kong, Shenzhen (zona de fábricas), Miami (administración), Buenos Aires. El pie de página muestra los mismos cuatro lugares.
3. **De la fábrica a tu obra** (carbón, fijado y horizontal en desktop) — recorrido con seguimiento: Hong Kong (búsqueda) → Shenzhen (producción) → embarque en origen → tránsito → importación y despacho en Buenos Aires. Cada parada muestra el aviso que recibe el cliente. Llegada: "Llegamos a tu obra." (entrega e instalación).
4. **Todas las terminaciones. Un solo responsable.** (hueso, fijado) — categorías + "Más" convergen en TECNO.BUILD. Botones: "Armá tu obra" y "Contactanos".
5. **El edificio** (hueso, fijado, ~200 vh) — solo para mostrar: se arma piso por piso al bajar y cada piso aparece con sus productos ya marcados (el último agregado, con glow). Sin un tramo extra para encender categorías. Botón "Armá tu cotización" al catálogo.
6. **Empresas que confiaron en nosotros** — tarjeta por empresa: nombre o logo, qué les trajimos y una línea nuestra.
7. **Tus dudas** — las tres objeciones, como desplegables, todas cerradas de entrada. "No los conozco": TECNO.BUILD es una empresa nueva que nace de Eurotechnologie Group para simplificar la búsqueda de proveedores y la importación, y bajar el costo de construir; trae "terminaciones de excelente calidad al mejor precio" (frase pedida por TECNO.BUILD el 26/11/2026, se usa solo ahí).
8. **Contacto** (carbón) — consulta corta (nombre, teléfono, empresa, obra) + mail y WhatsApp.

### `/catalogo/` Catálogo
- **Una tarjeta por FAMILIA** del maestro (`TB-XX01`). Si la familia tiene foto se muestra la foto; si no, el dibujo de su categoría (`src/lib/preview.ts`).
- **Filtros:** rubro, categoría, color y ancho de mueble, más buscador por nombre o código TB. Aviso visible de "Datos de prueba" mientras `prueba: true`.
- **Edificio interactivo por ambientes**, conectado con la grilla: PB–P1 balcones y escaleras → P2–P4 cocinas → P5–P6 baños → P7 vestidores. **Cada categoría aparece una sola vez** y cada piso es una escena con pocos elementos; los rótulos van en filas arriba de cada piso con una línea guía. Cada elemento del corte es una categoría real (tocarlo filtra esa categoría); la llave de un ambiente filtra el ambiente; pasar por una tarjeta marca su categoría en el corte. El dibujo está en `src/lib/building.ts`.
- **Configurador por familia:** medida o modelo → opciones de esa medida (niveles, color, variante) → nota. El resultado es un **código TB real**, que viaja en el pedido de cotización.
- **Pedí tu cotización** al final, con la selección precargada (códigos TB y ambientes).
- La selección se guarda en el navegador y sigue al pasar de una página a otra.

## Datos del catálogo

- **Fuente:** maestro de modelos `TB-modelos-MAESTRO.xlsx` en Google Drive (https://docs.google.com/spreadsheets/d/1vYpnhjEOooUanQZTBZ0ZnlMYpQCUTuNG/edit). Hojas: Familias (una fila por familia) y Modelos (una fila por código TB). Todavía no está confirmado: son todos los modelos.
- **El repo es público: el maestro nunca va al repo** (`data/*.xlsx` está en `.gitignore`). Tiene columnas internas que **jamás se publican**: proveedor, código de proveedor, costo y precio.
- **Sincronizar:** bajar el maestro a `data/TB-modelos-MAESTRO.xlsx` y correr `npm run sync:catalogo`. El script (`scripts/sync-catalogo.mjs`) copia solo una lista cerrada de columnas públicas y solo lo activo, y genera:
  - `src/content/catalogo.json`: índice de familias (va dentro de la página).
  - `public/catalogo/modelos/<FAMILIA>.json`: modelos de cada familia (se cargan al abrir el configurador).
- **Ambiente** de cada familia: columna "Ambiente" del maestro si existe; si no, sale de "Línea" (Cocina/Lavadero → cocinas, Baño → baños, Vestidor → vestidores, Barandas/Escaleras/Vidrio estructural/Puertas → balcones y escaleras).
- **Orden:** columna "Orden" del maestro si existe; si no, por categoría (bachas y grifería primero, accesorios al final).
- **Fotos:** `public/catalogo/fotos/<FAMILIA>/principal.(webp|jpg|png)`; el script las detecta. Sin foto se ve el dibujo.
- **Colores:** muestra aproximada en `COLOR_HEX` (`src/content/catalog.ts`) hasta que el maestro tenga una hoja Colores.
- **Mensaje de quiénes somos:** sigue nombrando pisos y revestimientos, puertas, cocinas y baños (categorías confirmadas). El maestro de prueba todavía no tiene pisos ni puertas: revisar cuando se confirme.

Elementos globales: encabezado con "Quiénes somos", "Catálogo", "Tu selección (n)" y "Cotizar"; índice lateral de capítulos solo en quiénes somos (desktop); selector ES/EN (ver "Versión en inglés").

## Configurador ("armá tu 0 km")

- Por familia: **medida o modelo → opciones de esa medida (niveles, color, variante; las combinaciones que no existen se ven apagadas) → campo libre de personalización → "Agregar a mi cotización"** → otra medida, ver la selección o seguir eligiendo.
- **Sin precios** ("Precio a cotizar") y **sin cantidades** (el volumen sale del tamaño de obra del formulario).
- Vive en el catálogo; desde quiénes somos se llega con "Armá tu obra" o "Cotizar".
- Los modelos salen del maestro (ver "Datos del catálogo").

## Formulario de cotización

- **Cotización (catálogo):** nombre*, empresa, teléfono o WhatsApp*, ubicación de la obra*, tamaño aproximado (unidades o m²), ambientes (precargados desde la selección), mensaje. Lleva los códigos TB elegidos.
- **Contacto (quiénes somos):** nombre*, teléfono o WhatsApp*, empresa, obra.
- Hoy ninguno envía datos: falta definir backend o servicio.

## Versión en inglés (i18n)

Decisión del 26/11/2026: **el sitio completo se traduce al inglés** (reemplaza la idea anterior de una página aparte para fábricas chinas, que queda como posible sección futura).

- **Rutas:** español en la raíz (`/`, `/catalogo/`), inglés bajo `/en/` (`/en/`, `/en/catalog/`). Cada idioma tiene su layout raíz (`src/app/(es)`, `src/app/(en)`) para que `<html lang>` salga bien en el HTML estático; canonical y hreflang en los metadatos.
- **Textos:** todo el copy vive en `src/i18n/es.tsx` y `src/i18n/en.tsx` (mismas claves, controladas por el tipo `Dict`). Los componentes lo leen con `useI18n()`. **No escribir textos sueltos en los componentes:** agregarlos a los dos diccionarios.
- **Catálogo:** el maestro está en español; los filtros usan los valores del maestro y solo se traduce lo que se ve (`src/i18n/catalog-en.ts`: rubros, categorías, colores, ambientes, rótulos del corte y nombre/subtítulo/descripción de cada familia). Familia o categoría nueva sin traducción → se ve en español hasta agregarla. Las medidas, detalles y variantes de cada modelo quedan en español (a futuro: columnas en inglés en el maestro).
- **Toggle ES | EN** en el encabezado (y en el menú mobile): el idioma activo queda relleno en naranja; el otro es el link a la misma página en ese idioma. La selección del catálogo sigue al cambiar de idioma.
- **Inglés:** escrito como copy en inglés, no traducido frase por frase. Inglés americano. Mismos hechos y mismas restricciones que en español (nada de garantías, plazos ni equipo propio).
  - Vocabulario: terminaciones → **fit-out** (nunca "finishes"); obra → site / project; AMBA → Greater Buenos Aires; niveles → tiers; grifería → faucets; mampara → shower enclosure; familia → product line.
  - Hero: "Built with the world." con el rótulo "Imported fit-out for new developments:". Botones: "Plan your fit-out" y "Get in touch"; en el encabezado "View catalog" y "Get a quote".
- Clientes (`src/sections/Clients.tsx`): cada empresa lleva su ficha `en`.

## Motion y accesibilidad

- El movimiento acompaña la lectura, nunca la retiene. Tramos fijados máx. ~320 vh.
- Con `prefers-reduced-motion`: sin secciones fijadas ni animaciones sincronizadas; todo estático y legible.
- En mobile: sin scroll horizontal; edificio como miniatura fija arriba; configurador como hoja inferior.
- Sin WebGL ni video (no aportan hoy).

## Estado y pendientes

- `docs/referencia/prototipo-quienes-somos.html`: prototipo navegable en un solo archivo (HTML + CSS + JS sin dependencias). Referencia de experiencia, no código final.
- **Frontend (etapa 8) en curso:** Next.js + TypeScript + GSAP/ScrollTrigger + Lenis, export estático (`out/`). Dos páginas (quiénes somos y catálogo); estructura en `README.md`.
- Próximas etapas: 6 design system · 7 copy definitivo · 8 frontend (stack recomendado: Next.js + TypeScript, GSAP/ScrollTrigger, Lenis para smooth scroll en desktop) · 9 responsive · 10 performance y accesibilidad.
- **SEO y búsqueda con IA (26/11/2026):** revisión en `docs/revision/2026-11-26-revision-diseno-seo.md`. Dominio final: **tecno.build** (`SITE_URL` en `src/content/site.ts`); canonical, sitemap y schema apuntan ahí. Hasta que el DNS apunte a GitHub Pages, el dominio muestra una página de estacionamiento. `robots.txt` y `sitemap.xml` salen de `src/app/robots.ts` y `src/app/sitemap.ts`; favicon `src/app/icon.svg` + `apple-icon.png`; imagen para compartir `og.png` por idioma (`src/lib/og.tsx`, se genera en el build y baja Archivo y Plex Mono de Google Fonts); JSON-LD en `src/components/StructuredData.tsx` (Organization con Eurotechnologie como `parentOrganization`, WebSite y FAQPage desde «Tus dudas»). Página o pregunta nueva → sumarla al sitemap o al schema.
- Datos pendientes: confirmar el maestro (qué se publica), hoja Colores, fotos por familia, año de inicio de Eurotechnologie, plazos por etapa, número de WhatsApp, logo en vector, fotos.

## Flujo de trabajo

- Cada cambio terminado y verificado se commitea y se sube a `main`: así se publica solo en GitHub Pages (https://osaintnom.github.io/tecnobuild-web/) y se revisa ahí.
- Antes de subir: `npm run build` sin errores y una revisión en el navegador (desktop y mobile).
- Después de subir: confirmar que el workflow "Publicar en GitHub Pages" terminó bien.

## Documentos de referencia (claude.ai)

- Estrategia (Etapa 2): https://claude.ai/artifact/WQTsMND4MLxDUPjSPjciLt
- Conceptos (Etapa 3): https://claude.ai/artifact/XrP2Pt1wV32LJ5nVg75SfR
- Arquitectura (Etapa 4): https://claude.ai/artifact/6mzaeuSzL5QWGA2mKVLior
- Guion de scroll (Etapa 5): https://claude.ai/artifact/CySNsb1sszENK9YAn19aq7
- Manual de marca Bases v1: https://claude.ai/artifact/Vt6EVoj48Go1CFP8YthbJF
