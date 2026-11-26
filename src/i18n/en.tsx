// Site copy in English. Same keys as es.tsx (checked by the Dict type).
// Written as English copy, not translated line by line: natural phrasing, confident and factual,
// no superlatives. Same claims and limits as the Spanish site (see CLAUDE.md).
// Vocabulary: "fit-out" for "terminaciones"; "site" or "project" for "obra"; "Greater Buenos Aires" for AMBA.
import { EtgLink } from '@/components/EtgLink';
import type { Dict } from './es';

const pl = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const en: Dict = {
  meta: {
    homeTitle: 'TECNO.BUILD · Built with the world.',
    homeDesc: 'Imported fit-out for developers and builders: flooring, doors, kitchens and bathrooms. Sourced at the factory, shipped direct and installed across Greater Buenos Aires.',
    catalogTitle: 'Catalog · TECNO.BUILD',
    catalogDesc: 'Specify the fit-out for your building floor by floor, configure each product and request a quote.',
    ogLocale: 'en_US',
  },

  common: {
    buildYourProject: 'Plan your fit-out',
    contactUs: 'Get in touch',
    priceOnRequest: 'Price on request',
    yourSelection: 'Your selection',
    requestQuote: 'Request a quote',
    keepBrowsing: 'Keep browsing',
    optional: '(optional)',
    models: (n: number) => pl(n, 'model', 'models'),
    families: (n: number) => pl(n, 'product line', 'product lines'),
    colors: (n: number) => pl(n, 'color', 'colors'),
    levels: (n: number | string) => `${n} tiers`,
    and: 'and',
  },

  chrome: {
    homeAria: 'TECNO.BUILD, home',
    navAria: 'Main',
    about: 'About',
    catalog: 'Catalog',
    selectionAria: (n: number) => `Your selection: ${pl(n, 'model', 'models')}`,
    seeCatalog: 'View catalog',
    quote: 'Get a quote',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuAria: 'Menu',
    chaptersAria: 'Sections',
    langGroup: 'Language',
    langAria: 'Ver en español',
    chapters: {
      quienes: 'About', origen: 'Supply chain', responsable: 'Single source',
      edificio: 'The building', empresas: 'Clients', dudas: 'FAQ', contacto: 'Contact',
    },
  },

  hero: {
    title: ['Built with', 'the world.'],
    kicker: 'Imported fit-out for new developments:',
    cats: ['Flooring & wall cladding', 'Doors', 'Kitchens', 'Bathrooms'],
    more: '+ More',
  },

  offices: [
    { city: 'Hong Kong', role: 'Factory sourcing' },
    { city: 'Shenzhen', role: 'Manufacturing hub' },
    { city: 'Miami', role: 'Administration' },
    { city: 'Buenos Aires', role: 'Sales & installation · Greater Buenos Aires' },
  ],

  about: {
    eyebrow: 'About',
    title: 'Your building’s fit-out, sourced at the factory.',
    lead: (
      <>
        TECNO.BUILD is part of <EtgLink />, an importer with more than ten years in the trade.
        We supply developers and builders with flooring and wall cladding, doors, kitchens, bathrooms and more.
      </>
    ),
    pillars: [
      { k: 'Sourcing', title: 'We select the factories', body: 'Our Hong Kong team finds the factories; we visit them in Shenzhen and test samples before committing to volume.' },
      { k: 'Import', title: 'We ship it direct', body: 'We buy at the source and ship straight from the factory to Argentina, handling the import and every bit of paperwork.' },
      { k: 'Installation', title: 'We install it', body: 'We deliver to site and take care of installation across Greater Buenos Aires. One partner, start to finish.' },
    ],
    placesAria: 'Our offices',
  },

  origin: {
    eyebrow: 'Supply chain',
    title: 'From the factory floor to your site.',
    lead: 'Every order takes this route. We track each stage and keep you posted along the way.',
    signK: 'Tracking',
    sign: 'One point of contact for the whole journey, so you always know where your material is.',
    notice: 'Status update',
    imgPending: 'Image pending',
    stops: [
      { place: 'Hong Kong', coord: '22.32°N 114.17°E', title: 'Factory sourcing', body: 'We find and vet the right factory for each product, and test samples before buying in volume.', estado: 'Samples approved', img: 'sample review' },
      { place: 'Shenzhen, China', coord: '22.54°N 114.06°E', title: 'Production', body: 'Many of our factories are in Shenzhen. We visit them and coordinate production of your order with each one.', estado: 'In production', img: 'Shenzhen manufacturing hub' },
      { place: 'Port of origin', coord: 'China', title: 'Shipping', body: 'We coordinate loading and shipping. Your material travels straight from the factory to Argentina.', estado: 'Shipped', img: 'container loading' },
      { place: 'At sea', coord: 'Ocean', title: 'Tracking', body: 'We follow the shipment all the way. A single point of contact tells you exactly where your material is.', estado: 'In transit', img: 'shipping route' },
      { place: 'Buenos Aires', coord: '34.60°S 58.38°W', title: 'Import & customs', body: 'We handle the import and customs clearance. No paperwork on your side.', estado: 'Cleared', img: 'customs clearance' },
    ],
    arriveTop: 'Hong Kong → Shenzhen → Buenos Aires · factory direct',
    arrivePlace: 'Your site  ·  Greater Buenos Aires',
    arriveTitle: 'Delivered to your site.',
    arriveSub: 'We deliver on the agreed schedule and take care of installation.',
  },

  responsible: {
    eyebrow: 'Single source',
    title: 'Every product. One point of responsibility.',
    manyTitle: 'With several suppliers',
    many: ['A quote for every trade', 'A schedule for every trade', 'A crew for every trade', 'No one accountable for the whole'],
    oneTitle: 'With TECNO.BUILD',
    one: ['One quote', 'One delivery plan', 'Installation included', 'One partner, start to finish'],
    price: 'And because we buy at the source, the balance of price and quality works in your favor.',
    lines: ['Flooring', 'Doors', 'Kitchens', 'Bathrooms', '+ More'],
    supplier: (n: number) => `Supplier ${n}`,
    figAria: 'One line per category, each leading to a different supplier, converging into a single orange line: TECNO.BUILD.',
  },

  showcase: {
    stageAria: 'Open the catalog to plan your fit-out',
    eyebrow: 'Plan your fit-out',
    title: 'Your building, floor by floor.',
    lead: 'In the catalog you pick each product on a section of the building, configure it and add it to your quote.',
    cta: 'Start your quote',
  },

  clients: {
    eyebrow: 'Who we work with',
    title: 'Already building with us.',
    tagsAria: 'What we supplied',
  },

  faq: {
    eyebrow: 'FAQ',
    items: [
      {
        q: 'I haven’t heard of you.',
        a: (
          <>
            That’s fair: we’re a new company. <b>TECNO.BUILD was founded by <EtgLink />, an importer with more than ten years in the trade</b>,
            with a clear aim: take the work out of finding suppliers and importing, and bring down the cost of building.
            We select the factories, test the samples and deliver <b>excellent-quality fit-out at the best price</b>,
            straight from the source to your site.
          </>
        ),
      },
      {
        q: 'What if there are delays?',
        a: <>We track every order from factory to site: production, shipping, transit and customs. <b>You have a single point of contact</b> who keeps you updated at every stage.</>,
      },
      {
        q: 'What if something goes wrong?',
        a: <><b>You call us.</b> We supply and we install, so there’s no product supplier and installer blaming each other.</>,
      },
    ],
  },

  forms: {
    errName: 'Please enter your name.',
    errPhone: 'Please leave a phone or WhatsApp number so we can reach you.',
    errLocation: 'Please tell us where the project is.',
    name: 'Name',
    phone: 'Phone or WhatsApp',
    company: 'Company',
    send: 'Send',
    protoNote: 'Preview version: this form doesn’t send data yet.',
    sentK: 'Message sent',
    sentTitle: 'Thanks, we’ve received your message. We’ll be in touch.',
    sendAnother: 'Send another message',
    preferWrite: 'Prefer email?',
    copyMail: 'Copy email',
    mailCopied: 'Email copied.',
    copyMailFallback: (m: string) => `Copy our email: ${m}`,
    whatsapp: 'WhatsApp:',
    whatsappPending: 'number coming soon',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about your project.',
    lead: 'Leave your details and we’ll give you a call. If you already know what you need, put together your quote in the catalog.',
    toCatalog: 'Go to the catalog and plan your fit-out →',
    project: 'Your project',
    projectPh: 'Location, stage, unit types, the products you’re after…',
  },

  quote: {
    eyebrow: 'Quote',
    title: 'Request a quote.',
    lead: 'Share a few details and we’ll prepare a quote covering supply and installation.',
    empty: <>You haven’t picked any models yet. You can still request a quote, or <a className="link" href="#catalogo">browse the catalog first</a>.</>,
    phonePh: 'e.g. +54 11 5555 0000',
    location: 'Project location',
    locationPh: 'e.g. Palermo, Buenos Aires',
    size: 'Approximate size',
    sizeHint: '(units or m²)',
    sizePh: 'e.g. 24 units or 1,800 m²',
    rooms: 'Areas you’re interested in',
    msg: 'Anything else we should know',
    msgPh: 'Project stage, timeline, unit types…',
    sumSite: (ubic: string) => `Project in ${ubic}`,
    sumModels: (n: number, codes: string) => `${pl(n, 'model', 'models')}: ${codes}`,
    sumNoModels: 'No models selected',
  },

  summary: {
    close: 'Close summary',
    intro: 'Review your selection. We’ll send it along with your request.',
    empty: 'You haven’t picked any models yet. Explore the building and configure what you need.',
    edit: 'Edit',
    remove: 'Remove',
    removeAria: (name: string, code: string) => `Remove ${name} ${code}`,
  },

  catalog: {
    eyebrow: 'Catalog',
    title: 'Plan your fit-out.',
    lead: 'Pick each product, configure it down to the exact model and add it to your quote. Tap the building or use the filters.',
    testData: (date: string) => `Sample data: the catalog isn’t final yet. Last updated ${date}.`,
    stageHint: 'Section · tap an area or a product',
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
    configure: 'Configure & add',
    more: (n: number) => `Show more (${n})`,
    notInFilters: (q: string, n: number) => `No match for “${q}” with these filters, but there ${n === 1 ? 'is' : 'are'} ${pl(n, 'product line', 'product lines')} across the full catalog.`,
    searchAll: 'Search the full catalog',
    none: 'Nothing matches these filters.',
    seeAll: 'View the full catalog',
  },

  configurator: {
    family: 'Product line',
    close: 'Close configurator',
    update: 'Update in my quote',
    add: 'Add to my quote',
    added: (code: string, n: number) => `✓ ${code} added · ${pl(n, 'model', 'models')} in your selection`,
    seeSelection: 'View my selection',
    otherSize: 'Add another size',
    code: 'Code',
    loadError: 'We couldn’t load the models. Check your connection and try opening this product line again.',
    loading: 'Loading models…',
    step1: 'Size or model',
    searchPh: 'Search by size, detail or code',
    searchAria: 'Search sizes',
    variants: (n: number) => `${n} variants`,
    noMatch: (q: string) => `No sizes match “${q}”.`,
    step2: 'Options',
    attrs: { niveles: 'Tiers', color: 'Color', variante: 'Variant' },
    materials: 'Materials:',
    note: 'Need something different? Let us know',
    notePh: 'e.g. a different size or color, or quantities per unit type.',
  },

  building: {
    aria: 'Section of a building with a ground floor, seven upper floors and a roof. Each group of floors shows one area: balconies and stairs at the bottom, then kitchens, bathrooms and walk-in closets at the top.',
    ground: 'GF',
    floor: (n: number) => `L${n}`,
    roof: 'RF',
    decimal: '.',
  },
};
