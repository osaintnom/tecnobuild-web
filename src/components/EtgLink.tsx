import { EUROTECHNOLOGIE_URL } from '@/content/site';

/** "Eurotechnologie Group" siempre enlaza al sitio del grupo, en una pestaña nueva (ver CLAUDE.md). */
export function EtgLink({ children = 'Eurotechnologie Group' }: { children?: React.ReactNode }) {
  return <a className="etg" href={EUROTECHNOLOGIE_URL} target="_blank" rel="noopener noreferrer">{children}</a>;
}
