# TECNO.BUILD — Web "Quiénes Somos"

Contexto y decisiones del proyecto. Leer antes de modificar el sitio. Si una tarea contradice algo de acá, consultar antes de cambiarlo.

## La empresa (confirmado)

- **TECNO.BUILD by Eurotechnologie Group.** Proveedor de terminaciones de edificios: producto importado + instalación, con un solo responsable.
- **Categorías:** pisos y revestimientos, puertas, cocinas, baños.
- **Origen:** selección de fábricas en Asia. Shenzhen (China) es la zona donde están muchas de las fábricas con las que trabajan; no es una oficina. Visitan las fábricas y prueban muestras antes de comprar en volumen. No hay inspección pre-embarque ni certificaciones: no afirmarlas.
- **Oficinas:** Hong Kong (búsqueda de fábricas), Miami (administración; **no** es centro de compras ni de logística: no mencionar logística en Miami), Buenos Aires (venta e instalación). El producto viaja **directo de la fábrica a la Argentina**.
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
- **Llamados a la acción:** "Armá tu obra" (lleva al catálogo) y "Contactanos" (contacto en quiénes somos). En el encabezado: "Ver catálogo" y "Cotizar". En el catálogo, el formulario se titula "Pedí tu cotización." WhatsApp es canal secundario.
- **Estilo:** hechos antes que adjetivos, frases cortas, voz activa. Evitar "líderes del mercado", "soluciones integrales", "equipo altamente capacitado".

## Lo que NO se puede afirmar todavía

- Garantía con años definidos, plazos en contrato, equipo propio de instalación (hoy hay subcontratistas: decir "nos hacemos cargo de la instalación", nunca "nuestro equipo de instaladores").
- Obras, testimonios o cifras: no existen aún.
- **Empresas que confiaron:** la sección existe (`src/sections/Clients.tsx`) con espacios rotulados. Los nombres y logos los pasa TECNO.BUILD; nunca inventarlos.
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
1. **Hero** (carbón) — rótulo "Importación de terminaciones para obra" + "Construimos con el mundo." + categorías con "+ Más". Botones: "Armá tu obra" y "Contactanos". Fondo interactivo con TECNO.BUILD difuminado.
2. **Quiénes somos** (carbón) — qué hacen (origen, importación, obra) y dónde están: Hong Kong, Shenzhen (zona de fábricas), Miami (administración), Buenos Aires.
3. **De la fábrica a tu obra** (carbón, fijado y horizontal en desktop) — recorrido con seguimiento: Hong Kong (búsqueda) → Shenzhen (producción) → embarque en origen → tránsito → importación y despacho en Buenos Aires. Cada parada muestra el aviso que recibe el cliente. Llegada: "Llegamos a tu obra." (entrega e instalación).
4. **Todas las terminaciones. Un solo responsable.** (hueso, fijado) — categorías + "Más" convergen en TECNO.BUILD. Botones: "Armá tu obra" y "Contactanos".
5. **El edificio** (hueso, fijado, ~200 vh) — solo para mostrar: se arma piso por piso al bajar y cada piso aparece con sus productos ya marcados (el último agregado, con glow). Sin un tramo extra para encender categorías. Botón "Armá tu cotización" al catálogo.
6. **Empresas que confiaron en nosotros** — logos (pendientes).
7. **Tus dudas** — las tres objeciones.
8. **Contacto** (carbón) — consulta corta (nombre, teléfono, empresa, obra) + mail y WhatsApp.

### `/catalogo/` Catálogo
- **Edificio interactivo + grilla filtrable**, conectados: filtrar por categoría enciende sus pisos; pasar por una tarjeta marca el modelo en el corte; tocar el corte (o la llave de una categoría) abre el configurador o filtra. Búsqueda por nombre o código.
- Corte técnico: PB + 7 pisos + azotea, una categoría por par de pisos (PB–P1 pisos y revestimientos → P2–P3 puertas → P4–P5 cocinas → P6–P7 baños). El reparto se edita en `FLOORS` (`src/content/catalog.ts`).
- **Pedí tu cotización** al final, con la selección precargada.
- La selección se guarda en el navegador y sigue al pasar de una página a otra.

Elementos globales: encabezado con "Quiénes somos", "Catálogo", "Tu selección (n)" y "Cotizar"; índice lateral de capítulos solo en quiénes somos (desktop); selector ES/EN.

## Configurador ("armá tu 0 km")

- Por categoría: **modelo → configuración con opciones acotadas** (2–3 atributos, máx. 6 opciones c/u, la vista previa cambia) **→ campo libre de personalización → "Agregar a mi cotización"** → siguiente categoría o cerrar.
- **Sin precios** ("Precio a cotizar") y **sin cantidades** (el volumen sale del tamaño de obra del formulario).
- Vive en el catálogo; desde quiénes somos se llega con "Armá tu obra" o "Cotizar".
- **Los modelos actuales son de ejemplo.** Reemplazar por el catálogo 2026 estructurado: categoría, línea, modelo, código, atributos, opciones, muestra de color/textura e imagen.

## Formulario de cotización

- **Cotización (catálogo):** nombre*, empresa, teléfono o WhatsApp*, ubicación de la obra*, tamaño aproximado (unidades o m²), categorías (precargadas desde la selección), mensaje.
- **Contacto (quiénes somos):** nombre*, teléfono o WhatsApp*, empresa, obra.
- Hoy ninguno envía datos: falta definir backend o servicio.

## Versión en inglés

No es una traducción. Es una página propia para **fábricas y proveedores chinos**, en inglés simple (frases cortas, sin modismos), 6 secciones: hero, quiénes somos, qué compramos, dónde vendemos, cómo trabajamos con fábricas, formulario de proveedores. Sin instalación ni cotización. Pendiente de construir.

## Motion y accesibilidad

- El movimiento acompaña la lectura, nunca la retiene. Tramos fijados máx. ~320 vh.
- Con `prefers-reduced-motion`: sin secciones fijadas ni animaciones sincronizadas; todo estático y legible.
- En mobile: sin scroll horizontal; edificio como miniatura fija arriba; configurador como hoja inferior.
- Sin WebGL ni video (no aportan hoy).

## Estado y pendientes

- `docs/referencia/prototipo-quienes-somos.html`: prototipo navegable en un solo archivo (HTML + CSS + JS sin dependencias). Referencia de experiencia, no código final.
- **Frontend (etapa 8) en curso:** Next.js + TypeScript + GSAP/ScrollTrigger + Lenis, export estático (`out/`). Dos páginas (quiénes somos y catálogo); estructura en `README.md`.
- Próximas etapas: 6 design system · 7 copy definitivo · 8 frontend (stack recomendado: Next.js + TypeScript, GSAP/ScrollTrigger, Lenis para smooth scroll en desktop) · 9 responsive · 10 performance y accesibilidad.
- Datos pendientes: catálogo 2026 por modelo, año de inicio de Eurotechnologie, plazos por etapa, número de WhatsApp, logo en vector, fotos.

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
