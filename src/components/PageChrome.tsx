'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSelection } from '@/state/selection';
import { useI18n } from '@/i18n/I18nProvider';
import { LOCALES, ROUTES } from '@/i18n/config';

type Tone = 'dark' | 'light';
export type ChapterId = 'quienes' | 'origen' | 'responsable' | 'edificio' | 'empresas' | 'dudas' | 'contacto';
export type Chapters = readonly ChapterId[];

interface Props {
  page: 'home' | 'catalog';
  /** Índice lateral de capítulos (desktop). Solo la página de quiénes somos lo usa. */
  chapters?: Chapters;
}

/** Encabezado + índice de capítulos. El tono de ambos sigue a la sección que tienen debajo. */
export function PageChrome({ page, chapters = [] }: Props) {
  const { selection, setSummaryOpen, pulseKey } = useSelection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hdrTone, setHdrTone] = useState<Tone>('dark');
  const [chTone, setChTone] = useState<Tone>('dark');
  const [chapter, setChapter] = useState<string | null>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const n = selection.size;
  const { locale, t: { chrome: t, common }, href } = useI18n();
  // Toggle ES | EN: el idioma activo queda marcado; el otro lleva a la misma página en ese idioma.
  const langToggle = (cls: string) => (
    <div className={`lang-toggle ${cls}`} role="group" aria-label={t.langGroup}>
      {LOCALES.map((l) => l === locale
        ? <span key={l} className="on" aria-current="true" lang={l}>{l.toUpperCase()}</span>
        : <Link key={l} href={ROUTES[l][page]} hrefLang={l} lang={l} aria-label={t.langAria}>{l.toUpperCase()}</Link>)}
    </div>
  );

  useEffect(() => {
    const secs = [...document.querySelectorAll<HTMLElement>('main [data-tone]')];
    let ticking = false;
    const at = (y: number) => secs.find((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const frame = () => {
      ticking = false;
      const top = at(32), mid = at(innerHeight * 0.5);
      setHdrTone((top?.dataset.tone as Tone) ?? 'dark');
      setChTone((mid?.dataset.tone as Tone) ?? 'light');
      setChapter(mid?.dataset.ch ?? null);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    frame();
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
  }, []);

  // Menú mobile: se cierra con Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Pulso del contador cuando se suma un modelo
  useEffect(() => {
    const el = countRef.current;
    if (!el || !pulseKey) return;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  }, [pulseKey]);

  return (
    <>
      <header className="hdr" data-tone={hdrTone}>
        <div className="wrap hdr-in">
          <Link className="logo" href={href('home')} aria-label={t.homeAria}>TECNO<span className="dot">.</span>BUILD</Link>
          <nav className="hdr-nav" aria-label={t.navAria}>
            <Link href={href('home')} aria-current={page === 'home' ? 'page' : undefined}>{t.about}</Link>
            <Link href={href('catalog')} aria-current={page === 'catalog' ? 'page' : undefined}>{t.catalog}</Link>
          </nav>
          <div className="hdr-actions">
            {langToggle('lang')}
            <button className={`sel-btn${n ? ' has' : ''}`} type="button" aria-haspopup="dialog"
              aria-label={t.selectionAria(n)} onClick={() => setSummaryOpen(true)}>
              <span className="sel-label">{common.yourSelection}</span>
              <span className="sel-count" id="selCount" ref={countRef}>{n}</span>
            </button>
            {page === 'home' && <Link className="btn btn-ghost btn-sm hdr-cat" href={href('catalog')}>{t.seeCatalog}</Link>}
            <Link className="btn btn-primary btn-sm" href={href('catalog', 'cotizar')}>{t.quote}</Link>
            <button className="hdr-menu" type="button" aria-expanded={menuOpen} aria-controls="hdr-drawer"
              aria-label={menuOpen ? t.closeMenu : t.openMenu} onClick={() => setMenuOpen((o) => !o)}>
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="hdr-drawer" id="hdr-drawer" aria-label={t.menuAria} onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setMenuOpen(false); }}>
            <Link href={href('home')} aria-current={page === 'home' ? 'page' : undefined}>{t.about}</Link>
            {page === 'home' && chapters.length > 0 && (
              <ul>{chapters.filter((id) => id !== 'quienes').map((id) => <li key={id}><a href={`#${id}`}>{t.chapters[id]}</a></li>)}</ul>
            )}
            <Link href={href('catalog')} aria-current={page === 'catalog' ? 'page' : undefined}>{t.catalog}</Link>
            {langToggle('drawer-lang')}
          </nav>
        )}
      </header>

      {chapters.length > 0 && (
        <nav className={`chapters${chapter ? ' show' : ''}`} aria-label={t.chaptersAria} data-tone={chTone}>
          <ol>
            {chapters.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={chapter === id ? 'on' : undefined} aria-current={chapter === id ? 'step' : undefined}>
                  <span>{t.chapters[id]}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
