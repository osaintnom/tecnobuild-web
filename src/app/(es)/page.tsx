import { HomePage, homeMetadata } from '@/views/HomePage';

export const metadata = homeMetadata('es');
export default function Page() { return <HomePage locale="es" />; }
