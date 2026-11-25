'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSelection } from '@/state/selection';

type Tone = 'dark' | 'light';
export type Chapters = readonly (readonly [id: string, label: string])[];

interface Props {
  page: 'home' | 'catalog';
  /** Índice lateral de capítulos (desktop). Solo la página de quiénes somos lo usa. */
  chapters?: Chapters;
}

/** Encabezado + índice de capítulos. El tono de ambos sigue a la sección que tienen debajo. */
export function PageChrome({ page, chapters = [] }: Props) {
  const { selection, setSummaryOpen, showToast, pulseKey } = useSelection();
  const [hdrTone, setHdrTone] = useState<Tone>('dark');
  const [chTone, setChTone] = useState<Tone>('dark');
  const [chapter, setChapter] = useState<string | null>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const n = selection.size;

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
          <Link className="logo" href="/" aria-label="TECNO.BUILD, inicio">TECNO<span className="dot">.</span>BUILD</Link>
          <nav className="hdr-nav" aria-label="Principal">
            <Link href="/" aria-current={page === 'home' ? 'page' : undefined}>Quiénes somos</Link>
            <Link href="/catalogo/" aria-current={page === 'catalog' ? 'page' : undefined}>Catálogo</Link>
          </nav>
          <div className="hdr-actions">
            <button className="lang" type="button" aria-label="English version for suppliers"
              onClick={() => showToast('La versión en inglés para fábricas tiene su propia página, más corta. Se arma en la próxima etapa.')}>EN</button>
            <button className={`sel-btn${n ? ' has' : ''}`} type="button" aria-haspopup="dialog"
              aria-label={`Tu selección: ${n} ${n === 1 ? 'modelo' : 'modelos'}`} onClick={() => setSummaryOpen(true)}>
              <span className="sel-label">Tu selección</span>
              <span className="sel-count" id="selCount" ref={countRef}>{n}</span>
            </button>
            {page === 'home' && <Link className="btn btn-ghost btn-sm hdr-cat" href="/catalogo/">Ver catálogo</Link>}
            <Link className="btn btn-primary btn-sm" href="/catalogo/#cotizar">Cotizar</Link>
          </div>
        </div>
      </header>

      {chapters.length > 0 && (
        <nav className={`chapters${chapter ? ' show' : ''}`} aria-label="Capítulos" data-tone={chTone}>
          <ol>
            {chapters.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className={chapter === id ? 'on' : undefined} aria-current={chapter === id ? 'step' : undefined}>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
