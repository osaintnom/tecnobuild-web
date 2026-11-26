import { RootHtml, rootMetadata } from '../RootHtml';
export { viewport } from '../RootHtml';

export const metadata = rootMetadata('en');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="en">{children}</RootHtml>;
}
