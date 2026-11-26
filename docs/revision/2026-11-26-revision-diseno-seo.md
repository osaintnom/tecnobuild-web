# Revisión de diseño, SEO y búsqueda con IA — 26/11/2026

Sitio revisado: https://osaintnom.github.io/tecnobuild-web/ (quiénes somos y catálogo, ES; EN solo HTML).
Visto en navegador a 1440 px y 375 px. **No revisado todavía:** tablet (768 px), navegación solo con teclado, catálogo en mobile, versión en inglés en pantalla, métricas de velocidad.

## Hay que arreglar

1. **El dominio no está conectado.** Canonical, hreflang y og:url apuntan a `https://tecno.build/`, que hoy es una página de estacionamiento (redirige a `/lander`). Google recibe la orden de indexar una página vacía en lugar del sitio.
   *Arreglo:* archivo `CNAME` con `tecno.build`, DNS del registrador apuntando a GitHub Pages (lo hace TECNO.BUILD), y quitar `PAGES_BASE_PATH` del workflow.
2. **Ningún formulario envía datos.** Contacto y cotización muestran «Versión de prueba: el formulario todavía no envía datos»; WhatsApp figura «a confirmar». El único canal que funciona es copiar el mail.
   *Arreglo:* servicio de formularios para sitios estáticos (a definir) + número de WhatsApp.
3. **El catálogo casi no existe para buscadores e IA.** El HTML publicado de `/catalogo/` trae solo las primeras 24 familias (el resto aparece con «Ver más») y ninguna familia tiene una URL propia. *(Corregido: la primera versión de este informe decía 0 familias por un error al contarlas.)*
   *Arreglo:* una página por familia (`/catalogo/<familia>/`), con su versión en inglés, enlazada desde las tarjetas y en el sitemap. **Hecho el 26/11/2026.**
4. **Faltan lo básico:** `robots.txt` (404), `sitemap.xml` (404), favicon (404), imagen para compartir (la tarjeta de redes sale sin imagen) y datos estructurados (0 bloques JSON-LD).
   *Arreglo:* generar los cuatro en el build; schema `Organization` con `parentOrganization` Eurotechnologie Group, `areaServed` AMBA y `sameAs`; `FAQPage` para «Tus dudas».

## Conviene arreglar (se ve sin terminar o genérico)

5. **Cinco cajas rayadas «Imagen pendiente»** en «De la fábrica a tu obra». Es lo que más hace ver el sitio a medio hacer.
   *Arreglo:* reemplazarlas por dibujos en el mismo lenguaje del edificio (línea, cotas, coordenadas): mapa del recorrido, contenedor, despacho. No usar IA para fábricas ni personas.
6. **El hero no dice para quién ni dónde.** Arriba del pliegue no aparece «desarrolladoras y constructoras» ni «AMBA». Además el título tarda cerca de un segundo en aparecer por la animación de entrada (empeora la primera carga).
   *Decisión de TECNO.BUILD:* CLAUDE.md pide la tagline sin bajada; la opción es sumar el dato al rótulo («Importación de terminaciones para desarrolladoras del AMBA:») o a la línea de lugares.
7. **El título del hero se lee pegado:** el `<br>` sin espacio hace que buscadores e IA lean «We buildwith the world.» / «Construimoscon el mundo.».
8. **Texto mono muy chico:** muchos rótulos a 11,5 px (pie, cotas, rótulos de sección). El contraste está bien; el tamaño cansa en mobile.

## Detalle

9. «Ya construyen con nosotros.» sobre una sola tarjeta se siente vacío; volver a «Empresas que confiaron en nosotros» o dejarlo en singular hasta tener más.
10. `llms.txt` opcional: una guía corta con qué es TECNO.BUILD y links a quiénes somos, catálogo y preguntas.

## Lo que ya está bien

- Identidad propia: carbón y naranja, Archivo expandida, cotas en mono, dibujo del edificio. No tiene la cara típica de sitio hecho con IA (sin degradados, sin tarjetas iguales con íconos, sin testimonios inventados).
- Copy con hechos y sin adjetivos vacíos.
- Sin scroll horizontal en mobile; formularios con labels; imágenes con alt; un solo H1 por página; títulos y descripciones propios en ES y EN; hreflang correcto.
