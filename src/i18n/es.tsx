// Textos del sitio en español (rioplatense, con vos). Fuente de verdad del copy: ver CLAUDE.md.
// en.tsx tiene que tener exactamente las mismas claves (lo controla el tipo Dict).
import { EtgLink } from '@/components/EtgLink';

const pl = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const es = {
  meta: {
    homeTitle: 'TECNO.BUILD · Construimos con el mundo.',
    homeDesc: 'Terminaciones de edificios: pisos y revestimientos, puertas, cocinas y baños. Elegimos en origen, importamos y nos hacemos cargo de la instalación en el AMBA.',
    catalogTitle: 'Catálogo · TECNO.BUILD',
    catalogDesc: 'Elegí las terminaciones de tu obra sobre el corte del edificio, configuralas y pedí tu cotización.',
    ogLocale: 'es_AR',
  },

  common: {
    buildYourProject: 'Armá tu cotización',
    contactUs: 'Contactanos',
    priceOnRequest: 'Precio a cotizar',
    yourSelection: 'Tu selección',
    requestQuote: 'Pedí tu cotización',
    keepBrowsing: 'Seguir eligiendo',
    optional: '(opcional)',
    models: (n: number) => pl(n, 'modelo', 'modelos'),
    families: (n: number) => pl(n, 'familia', 'familias'),
    colors: (n: number) => pl(n, 'color', 'colores'),
    levels: (n: number | string) => `${n} niveles`,
    and: 'y',
  },

  chrome: {
    homeAria: 'TECNO.BUILD, inicio',
    navAria: 'Principal',
    about: 'Quiénes somos',
    catalog: 'Catálogo',
    selectionAria: (n: number) => `Tu selección: ${pl(n, 'modelo', 'modelos')}`,
    seeCatalog: 'Ver catálogo',
    quote: 'Cotizar',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    menuAria: 'Menú',
    chaptersAria: 'Capítulos',
    langGroup: 'Idioma',
    langAria: 'Read in English',
    chapters: {
      quienes: 'Quiénes somos', origen: 'Recorrido', responsable: 'Responsable',
      edificio: 'Edificio', empresas: 'Empresas', dudas: 'Dudas', contacto: 'Contacto',
    },
  },

  hero: {
    title: ['Construimos', 'con el mundo.'],
    lead: 'Traemos las terminaciones de tu obra directo de fábrica, con un solo responsable desde la compra hasta la instalación en el AMBA.',
    kicker: 'Importación de terminaciones de obra:',
    cats: ['Pisos y revestimientos', 'Puertas', 'Cocinas', 'Baños'],
    more: '+ Más',
  },

  offices: [
    { city: 'Hong Kong', role: 'Búsqueda de fábricas' },
    { city: 'Shenzhen', role: 'Zona de fábricas' },
    { city: 'Miami', role: 'Administración' },
    { city: 'Buenos Aires', role: 'Venta e instalación · AMBA' },
  ],

  about: {
    eyebrow: 'Quiénes somos',
    title: 'Importamos las terminaciones de tu obra.',
    lead: (
      <>
        TECNO.BUILD es parte de <EtgLink />, un grupo que importa hace más de diez años.
        Trabajamos con desarrolladoras y constructoras: pisos y revestimientos, puertas, cocinas, baños y más.
      </>
    ),
    pillars: [
      { k: 'Origen', title: 'Elegimos las fábricas', body: 'Desde Hong Kong buscamos fábricas y en Shenzhen las visitamos. Probamos muestras antes de comprar en volumen.' },
      { k: 'Importación', title: 'Traemos el material', body: 'Compramos en origen y el material viaja directo de la fábrica a la Argentina. Nos ocupamos de la importación y de los trámites.' },
      { k: 'Obra', title: 'Lo instalamos', body: 'Entregamos en tu obra y nos hacemos cargo de la instalación en el AMBA. Un solo responsable de punta a punta.' },
    ],
    placesAria: 'Dónde estamos',
  },

  origin: {
    eyebrow: 'Origen',
    title: 'De la fábrica a tu obra.',
    lead: 'Cada pedido hace este recorrido. Lo seguimos etapa por etapa y te avisamos en cada una.',
    signK: 'Seguimiento',
    sign: 'Un solo contacto para todo el recorrido: sabés siempre dónde está tu material.',
    notice: 'Aviso al cliente',
    imgPending: 'Imagen pendiente',
    stops: [
      { place: 'Hong Kong', title: 'Búsqueda de fábricas', body: 'Buscamos y evaluamos fábricas para cada terminación. Probamos muestras antes de comprar en volumen.', estado: 'Muestras aprobadas', img: 'evaluación de muestras' },
      { place: 'Shenzhen, China', title: 'Producción', body: 'Muchas de las fábricas con las que trabajamos están en Shenzhen. Las visitamos y coordinamos con cada una la producción de tu pedido.', estado: 'En producción', img: 'zona de fábricas, Shenzhen' },
      { place: 'Puerto de origen', coord: 'China', title: 'Embarque', body: 'Coordinamos la carga y el embarque. El material viaja directo de la fábrica a la Argentina.', estado: 'Embarcado', img: 'carga del contenedor' },
      { place: 'En tránsito', coord: 'Océano', title: 'Seguimiento', body: 'Seguimos el envío durante todo el viaje. Tenés un solo contacto que te dice en qué etapa está tu material.', estado: 'En tránsito', img: 'ruta marítima' },
      { place: 'Buenos Aires', title: 'Importación y despacho', body: 'Nos ocupamos de la importación y de los trámites de aduana. Vos no hacés trámites.', estado: 'Despachado', img: 'despacho en destino' },
    ],
    arriveTop: 'Hong Kong → Shenzhen → Buenos Aires · directo de fábrica',
    arrivePlace: 'Tu obra\u00a0 · \u00a0AMBA',
    arriveTitle: 'Llegamos a tu obra.',
    arriveSub: 'Entregamos según el plan acordado y nos hacemos cargo de la instalación.',
  },

  responsible: {
    eyebrow: 'Un solo responsable',
    title: 'Todas las terminaciones. Un solo responsable.',
    manyTitle: 'Con varios proveedores',
    many: ['Una cotización por rubro', 'Un plazo por rubro', 'Un equipo por rubro', 'Nadie responde por el conjunto'],
    oneTitle: 'Con TECNO.BUILD',
    one: ['1 cotización', '1 plan de entrega', 'Instalación incluida', 'Un responsable de punta a punta'],
    price: 'Y como compramos en origen, la relación entre precio y calidad juega a favor de tu obra.',
    lines: ['Pisos', 'Puertas', 'Cocinas', 'Baños', '+ Más'],
    supplier: (n: number) => `Proveedor ${n}`,
    figAria: 'Una línea por categoría, cada una hacia un proveedor distinto, que se unen en una sola línea naranja: TECNO.BUILD.',
  },

  showcase: {
    stageAria: 'Abrir el catálogo para armar tu cotización',
    eyebrow: 'Catálogo',
    title: 'Tu edificio, piso por piso.',
    lead: 'En el catálogo elegís cada terminación sobre el corte del edificio, la configurás y la sumás a tu cotización.',
    cta: 'Armá tu cotización',
  },

  clients: {
    eyebrow: 'Empresas que confiaron en nosotros',
    title: 'Ya construyen con nosotros.',
    tagsAria: 'Qué les trajimos',
  },

  faq: {
    eyebrow: 'Tus dudas',
    items: [
      {
        q: 'No los conozco.',
        a: (
          <>
            Es razonable: somos una empresa nueva. <b>TECNO.BUILD nace de <EtgLink />, un grupo que importa hace más de diez años</b>,
            con un objetivo: simplificar la búsqueda de proveedores y la importación para bajar el costo de construir.
            Elegimos las fábricas, probamos las muestras y te traemos <b>terminaciones de excelente calidad al mejor precio</b>,
            directo de origen a tu obra.
          </>
        ),
      },
      {
        q: '¿Y si se atrasa?',
        a: <>Seguimos cada pedido de la fábrica a la obra: producción, embarque, tránsito y despacho. <b>Tenés un solo contacto</b> que te avisa en qué etapa está tu material.</>,
      },
      {
        q: '¿Y si algo falla?',
        a: <><b>Nos llamás a nosotros.</b> Vendemos e instalamos, así que no hay un proveedor del producto y otro de la instalación pasándose la responsabilidad.</>,
      },
    ],
  },

  forms: {
    errName: 'Escribí tu nombre.',
    errPhone: 'Dejanos un teléfono o WhatsApp para contactarte.',
    errLocation: 'Indicá dónde está la obra.',
    name: 'Nombre',
    phone: 'Teléfono o WhatsApp',
    company: 'Empresa',
    send: 'Enviar consulta',
    protoNote: 'Versión de prueba: el formulario todavía no envía datos.',
    sentK: 'Consulta enviada',
    sentTitle: 'Recibimos tu consulta. Te contactamos para responder tus dudas y armar tu cotización.',
    sendAnother: 'Enviar otra consulta',
    preferWrite: '¿Preferís escribirnos?',
    copyMail: 'Copiar mail',
    mailCopied: 'Mail copiado.',
    copyMailFallback: (m: string) => `Copiá el mail: ${m}`,
    whatsapp: 'WhatsApp:',
    whatsappPending: 'número a confirmar',
  },

  contact: {
    eyebrow: 'Contacto',
    title: 'Contanos tu obra.',
    lead: 'Dejanos tus datos: te contactamos para responder tus dudas y armamos una cotización. Si ya sabés qué terminaciones necesitás, podés armarla vos en el catálogo.',
    toCatalog: 'Armá tu cotización en el catálogo →',
    project: 'Tu obra',
    projectPh: 'Ubicación, etapa, tipologías, qué terminaciones buscás…',
  },

  quote: {
    eyebrow: 'Cotización',
    title: 'Pedí tu cotización.',
    lead: 'Con estos datos te preparamos una cotización de producto e instalación.',
    empty: <>Todavía no elegiste modelos. Podés cotizar igual o <a className="link" href="#catalogo">elegir modelos en el catálogo</a>.</>,
    phonePh: 'Ej.: 11 5555 0000',
    location: 'Ubicación de la obra',
    locationPh: 'Ej.: Palermo, CABA',
    size: 'Tamaño aproximado',
    sizeHint: '(unidades o m²)',
    sizePh: 'Ej.: 24 unidades o 1.800 m²',
    rooms: 'Ambientes que te interesan',
    msg: 'Algo más que quieras contarnos',
    msgPh: 'Etapa de la obra, fechas, tipologías…',
    sumSite: (ubic: string) => `Obra en ${ubic}`,
    sumModels: (n: number, codes: string) => `${pl(n, 'modelo', 'modelos')}: ${codes}`,
    sumNoModels: 'Sin modelos elegidos',
  },

  summary: {
    close: 'Cerrar resumen',
    intro: 'Revisá lo que elegiste. Lo enviamos junto con tu consulta.',
    empty: 'Todavía no elegiste modelos. Recorré el edificio y configurá lo que te interese.',
    edit: 'Editar',
    remove: 'Quitar',
    removeAria: (name: string, code: string) => `Quitar ${name} ${code}`,
  },

  catalog: {
    eyebrow: 'Catálogo',
    title: 'Armá tu cotización.',
    lead: 'Elegí cada terminación, configurala hasta el modelo exacto y sumala a tu cotización. Tocá el edificio o usá los filtros.',
    testData: (date: string) => `Datos de prueba: el catálogo todavía no está confirmado. Actualizado el ${date}.`,
    stageHint: 'Corte · tocá un ambiente o un elemento',
    byTrade: 'Filtrar por rubro',
    all: 'Todos',
    allF: 'Todas',
    category: 'Categoría',
    width: 'Ancho de mueble',
    search: 'Buscar',
    searchPh: 'Nombre o código TB',
    byColor: 'Filtrar por color',
    clear: 'Limpiar filtros',
    inQuote: (k: number) => `✓ ${k} en tu cotización · Agregar otro`,
    configure: 'Configurar y agregar',
    more: (n: number) => `Ver más (${n})`,
    notInFilters: (q: string, n: number) => `“${q}” no está en los filtros elegidos, pero hay ${pl(n, 'familia', 'familias')} en todo el catálogo.`,
    searchAll: 'Buscar en todo el catálogo',
    none: 'No encontramos familias con esos filtros.',
    seeAll: 'Ver todo el catálogo',
  },

  configurator: {
    family: 'Familia',
    close: 'Cerrar configurador',
    update: 'Actualizar en mi cotización',
    add: 'Agregar a mi cotización',
    added: (code: string, n: number) => `✓ ${code} sumado · ${pl(n, 'modelo', 'modelos')} en tu selección`,
    seeSelection: 'Ver mi selección',
    otherSize: 'Otra medida',
    code: 'Código',
    loadError: 'No pudimos cargar los modelos. Revisá la conexión y volvé a abrir la familia.',
    loading: 'Cargando modelos…',
    step1: 'Medida o modelo',
    searchPh: 'Buscar medida, detalle o código',
    searchAria: 'Buscar medida',
    variants: (n: number) => `${n} variantes`,
    noMatch: (q: string) => `Ninguna medida coincide con «${q}».`,
    step2: 'Opciones',
    attrs: { niveles: 'Niveles', color: 'Color', variante: 'Variante' },
    materials: 'Materiales:',
    note: '¿Necesitás algo distinto? Contanos',
    notePh: 'Ej.: otra medida, otro color o cantidades por tipología.',
  },

  family: {
    crumbsAria: 'Ruta',
    facts: { code: 'Código TB', category: 'Categoría', room: 'Ambiente', models: 'Modelos', colors: 'Colores', widths: 'Anchos de mueble' },
    configure: 'Configurar y sumar a mi cotización',
    toCatalog: 'Ver todo el catálogo',
    modelsTitle: 'Modelos',
    modelsLead: 'Cada modelo tiene su código TB. Elegilo en el configurador o nombralo en tu pedido de cotización.',
    dataLang: '',
    cols: { code: 'Código TB', size: 'Medida o modelo', dims: 'Medidas (mm)', options: 'Opciones', detail: 'Detalle' },
    related: 'Más de esta categoría',
    metaTitle: (name: string, cat: string) => `${name} · ${cat} · TECNO.BUILD`,
    metaDesc: (desc: string, n: number) => `${desc} ${pl(n, 'modelo', 'modelos')} con código TB. Importación directa de fábrica. Precio a cotizar.`.trim(),
  },

  building: {
    aria: 'Corte de un edificio de planta baja, siete pisos y azotea. Cada par de pisos muestra un ambiente: balcones y escaleras abajo, después cocinas, baños y vestidores arriba.',
    ground: 'PB',
    floor: (n: number) => `P${n}`,
    roof: 'AZ',
    decimal: ',',
  },
};

export type Dict = typeof es;
