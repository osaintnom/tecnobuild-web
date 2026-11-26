// Site copy in English. Same keys as es.tsx (checked by the Dict type).
// Plain, factual English: short sentences, active voice, no superlatives. Same claims as the Spanish site.
import { EtgLink } from '@/components/EtgLink';
import type { Dict } from './es';

const pl = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const en: Dict = {
  meta: {
    homeTitle: 'TECNO.BUILD · We build with the world.',
    homeDesc: 'Building finishes: flooring and wall tiles, doors, kitchens and bathrooms. We choose at the source, import, and take care of installation in Greater Buenos Aires.',
    catalogTitle: 'Catalog · TECNO.BUILD',
    catalogDesc: 'Choose the finishes for your project on the building section, configure them and request your quote.',
    ogLocale: 'en_US',
  },

  common: {
    buildYourProject: 'Build your project',
    contactUs: 'Contact us',
    priceOnRequest: 'Price on request',
    yourSelection: 'Your selection',
    requestQuote: 'Request a quote',
    keepBrowsing: 'Keep browsing',
    optional: '(optional)',
    models: (n: number) => pl(n, 'model', 'models'),
    families: (n: number) => pl(n, 'family', 'families'),
    colors: (n: number) => pl(n, 'color', 'colors'),
    levels: (n: number | string) => `${n} levels`,
    and: 'and',
  },

  chrome: {
    homeAria: 'TECNO.BUILD, home',
    navAria: 'Main',
    about: 'About us',
    catalog: 'Catalog',
    selectionAria: (n: number) => `Your selection: ${pl(n, 'model', 'models')}`,
    seeCatalog: 'See catalog',
    quote: 'Get a quote',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuAria: 'Menu',
    chaptersAria: 'Chapters',
    langLabel: 'ES',
    langAria: 'Ver en español',
    chapters: {
      quienes: 'About us', origen: 'Route', responsable: 'One partner',
      edificio: 'Building', empresas: 'Clients', dudas: 'Questions', contacto: 'Contact',
    },
  },

  hero: {
    title: ['We build', 'with the world.'],
    kicker: 'Imported building finishes:',
    cats: ['Flooring and wall tiles', 'Doors', 'Kitchens', 'Bathrooms'],
    more: '+ More',
  },

  offices: [
    { city: 'Hong Kong', role: 'Factory sourcing' },
    { city: 'Shenzhen', role: 'Factory area' },
    { city: 'Miami', role: 'Administration' },
    { city: 'Buenos Aires', role: 'Sales and installation · Greater Buenos Aires' },
  ],

  about: {
    eyebrow: 'About us',
    title: 'We import the finishes for your project.',
    lead: (
      <>
        TECNO.BUILD is part of <EtgLink />, a group that has been importing for more than ten years.
        We work with developers and builders: flooring and wall tiles, doors, kitchens, bathrooms and more.
      </>
    ),
    pillars: [
      { k: 'Source', title: 'We choose the factories', body: 'From Hong Kong we look for factories, and we visit them in Shenzhen. We test samples before buying in volume.' },
      { k: 'Import', title: 'We bring the material', body: 'We buy at the source and the material ships straight from the factory to Argentina. We handle the import and the paperwork.' },
      { k: 'Site', title: 'We install it', body: 'We deliver to your site and take care of installation in Greater Buenos Aires. One partner from start to finish.' },
    ],
    placesAria: 'Where we are',
  },

  origin: {
    eyebrow: 'Source',
    title: 'From the factory to your site.',
    lead: 'Every order follows this route. We track it stage by stage and let you know at each one.',
    signK: 'Tracking',
    sign: 'One contact for the whole route: you always know where your material is.',
    notice: 'Client update',
    imgPending: 'Image pending',
    stops: [
      { place: 'Hong Kong', coord: '22.32°N 114.17°E', title: 'Factory sourcing', body: 'We find and assess factories for each finish. We test samples before buying in volume.', estado: 'Samples approved', img: 'sample review' },
      { place: 'Shenzhen, China', coord: '22.54°N 114.06°E', title: 'Production', body: 'Many of the factories we work with are in Shenzhen. We visit them and coordinate the production of your order with each one.', estado: 'In production', img: 'factory area, Shenzhen' },
      { place: 'Port of origin', coord: 'China', title: 'Shipping', body: 'We coordinate loading and shipping. The material ships straight from the factory to Argentina.', estado: 'Shipped', img: 'container loading' },
      { place: 'In transit', coord: 'Ocean', title: 'Tracking', body: 'We follow the shipment for the whole trip. You have one contact who tells you what stage your material is at.', estado: 'In transit', img: 'sea route' },
      { place: 'Buenos Aires', coord: '34.60°S 58.38°W', title: 'Import and customs', body: 'We handle the import and the customs paperwork. You don’t deal with any of it.', estado: 'Cleared', img: 'customs clearance' },
    ],
    arriveTop: 'Hong Kong → Shenzhen → Buenos Aires · straight from the factory',
    arrivePlace: 'Your site\u00a0 · \u00a0Greater Buenos Aires',
    arriveTitle: 'We get to your site.',
    arriveSub: 'We deliver on the agreed plan and take care of installation.',
  },

  responsible: {
    eyebrow: 'One partner',
    title: 'Every finish. One partner.',
    manyTitle: 'With several suppliers',
    many: ['One quote per trade', 'One schedule per trade', 'One crew per trade', 'Nobody answers for the whole'],
    oneTitle: 'With TECNO.BUILD',
    one: ['1 quote', '1 delivery plan', 'Installation included', 'One partner from start to finish'],
    price: 'And because we buy at the source, the price-to-quality ratio works in your project’s favor.',
    lines: ['Floors', 'Doors', 'Kitchens', 'Bathrooms', '+ More'],
    supplier: (n: number) => `Supplier ${n}`,
    figAria: 'One line per category, each going to a different supplier, joining into a single orange line: TECNO.BUILD.',
  },

  showcase: {
    stageAria: 'Open the catalog to build your project',
    eyebrow: 'Build your project',
    title: 'Your building, floor by floor.',
    lead: 'In the catalog you choose each finish on the building section, configure it and add it to your quote.',
    cta: 'Build your quote',
  },

  clients: {
    eyebrow: 'Companies that trusted us',
    title: 'Already building with us.',
    tagsAria: 'What we supplied',
  },

  faq: {
    eyebrow: 'Your questions',
    items: [
      {
        q: 'I don’t know you.',
        a: (
          <>
            Fair enough: we are a new company. <b>TECNO.BUILD comes from <EtgLink />, a group that has been importing for more than ten years</b>,
            with one goal: to make finding suppliers and importing simpler, and so lower the cost of building.
            We choose the factories, test the samples and bring you <b>excellent-quality finishes at the best price</b>,
            straight from the source to your site.
          </>
        ),
      },
      {
        q: 'What if it’s late?',
        a: <>We track every order from the factory to the site: production, shipping, transit and customs. <b>You have one contact</b> who tells you what stage your material is at.</>,
      },
      {
        q: 'What if something goes wrong?',
        a: <><b>You call us.</b> We sell and we install, so there is no product supplier and installer passing the blame to each other.</>,
      },
    ],
  },

  forms: {
    errName: 'Please enter your name.',
    errPhone: 'Leave us a phone or WhatsApp number so we can reach you.',
    errLocation: 'Tell us where the project is.',
    name: 'Name',
    phone: 'Phone or WhatsApp',
    company: 'Company',
    send: 'Send inquiry',
    protoNote: 'Test version: the form does not send data yet.',
    sentK: 'Inquiry sent',
    sentTitle: 'We received your inquiry. We will contact you.',
    sendAnother: 'Send another inquiry',
    preferWrite: 'Prefer to write to us?',
    copyMail: 'Copy email',
    mailCopied: 'Email copied.',
    copyMailFallback: (m: string) => `Copy the email: ${m}`,
    whatsapp: 'WhatsApp:',
    whatsappPending: 'number to be confirmed',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about your project.',
    lead: 'Leave your details and we will call you. If you already know which finishes you need, build your quote in the catalog.',
    toCatalog: 'Go to the catalog and build your project →',
    project: 'Your project',
    projectPh: 'Location, stage, unit types, which finishes you are looking for…',
  },

  quote: {
    eyebrow: 'Quote',
    title: 'Request a quote.',
    lead: 'With these details we prepare a quote for product and installation.',
    empty: <>You haven’t chosen any models yet. You can still ask for a quote or <a className="link" href="#catalogo">choose models in the catalog</a>.</>,
    phonePh: 'E.g. +54 11 5555 0000',
    location: 'Project location',
    locationPh: 'E.g. Palermo, Buenos Aires',
    size: 'Approximate size',
    sizeHint: '(units or m²)',
    sizePh: 'E.g. 24 units or 1,800 m²',
    rooms: 'Rooms you are interested in',
    msg: 'Anything else you want to tell us',
    msgPh: 'Project stage, dates, unit types…',
    sumSite: (ubic: string) => `Project in ${ubic}`,
    sumModels: (n: number, codes: string) => `${pl(n, 'model', 'models')}: ${codes}`,
    sumNoModels: 'No models chosen',
  },

  summary: {
    close: 'Close summary',
    intro: 'Check what you chose. We send it along with your inquiry.',
    empty: 'You haven’t chosen any models yet. Explore the building and configure what you like.',
    edit: 'Edit',
    remove: 'Remove',
    removeAria: (name: string, code: string) => `Remove ${name} ${code}`,
  },

  catalog: {
    eyebrow: 'Catalog',
    title: 'Build your project.',
    lead: 'Choose each finish, configure it down to the exact model and add it to your quote. Tap the building or use the filters.',
    testData: (date: string) => `Test data: the catalog is not confirmed yet. Updated ${date}.`,
    stageHint: 'Section · tap a room or an item',
    byTrade: 'Filter by trade',
    all: 'All',
    allF: 'All',
    category: 'Category',
    width: 'Cabinet width',
    search: 'Search',
    searchPh: 'Name or TB code',
    byColor: 'Filter by color',
    clear: 'Clear filters',
    inQuote: (k: number) => `✓ ${k} in your quote · Add another`,
    configure: 'Configure and add',
    more: (n: number) => `See more (${n})`,
    notInFilters: (q: string, n: number) => `“${q}” is not in the chosen filters, but there ${n === 1 ? 'is' : 'are'} ${pl(n, 'family', 'families')} in the whole catalog.`,
    searchAll: 'Search the whole catalog',
    none: 'No families match those filters.',
    seeAll: 'See the whole catalog',
  },

  configurator: {
    family: 'Family',
    close: 'Close configurator',
    update: 'Update in my quote',
    add: 'Add to my quote',
    added: (code: string, n: number) => `✓ ${code} added · ${pl(n, 'model', 'models')} in your selection`,
    seeSelection: 'See my selection',
    otherSize: 'Another size',
    code: 'Code',
    loadError: 'We couldn’t load the models. Check your connection and open the family again.',
    loading: 'Loading models…',
    step1: 'Size or model',
    searchPh: 'Search size, detail or code',
    searchAria: 'Search size',
    variants: (n: number) => `${n} variants`,
    noMatch: (q: string) => `No size matches “${q}”.`,
    step2: 'Options',
    attrs: { niveles: 'Levels', color: 'Color', variante: 'Variant' },
    materials: 'Materials:',
    note: 'Need something different? Tell us',
    notePh: 'E.g. another size, another color or quantities per unit type.',
  },

  building: {
    aria: 'Section of a building with a ground floor, seven floors and a roof. Each pair of floors shows a room: balconies and stairs at the bottom, then kitchens, bathrooms and walk-in closets at the top.',
    ground: 'GF',
    floor: (n: number) => `L${n}`,
    roof: 'RF',
    decimal: '.',
  },
};
