import { ogImage } from '@/lib/og';

// Imagen para compartir en redes: se genera en el build como un archivo .png estático.
export const dynamic = 'force-static';

export function GET() { return ogImage('es'); }
