import { RootHtml, rootMetadata } from '../RootHtml';
export { viewport } from '../RootHtml';

export const metadata = rootMetadata('es');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="es">{children}</RootHtml>;
}
