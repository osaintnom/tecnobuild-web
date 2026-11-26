import { CatalogPage, catalogMetadata } from '@/views/CatalogPage';

export const metadata = catalogMetadata('es');
export default function Page() { return <CatalogPage locale="es" />; }
