import { CatalogPage, catalogMetadata } from '@/views/CatalogPage';

export const metadata = catalogMetadata('en');
export default function Page() { return <CatalogPage locale="en" />; }
