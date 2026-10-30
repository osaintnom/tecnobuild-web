'use client';
import { useEffect, useRef, useState } from 'react';
import { useSelection } from '@/state/selection';

const CHAPTERS = [
  ['origen', 'Origen'], ['edificio', 'Edificio'], ['responsable', 'Responsable'],
  ['proceso', 'Proceso'], ['dudas', 'Dudas'], ['cotizar', 'Cotizar'],
] as const;

type Tone = 'dark' | 'light';

/** Encabezado + índice de capítulos. El tono de ambos sigue a la sección que tienen debajo. */
export function PageChrome() {
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
          <a className="logo" href="#top" aria-label="TECNO.BUILD, inicio">TECNO<span className="dot">.</span>BUILD</a>
          <nav className="hdr-nav" aria-label="Principal">
            <a href="#top" aria-current="page">Quiénes somos</a>
            <a href="#edificio" onClick={() => showToast('La página de Catálogo usa este mismo configurador, con todos los modelos.')}>Catálogo</a>
            <a href="#proceso">Cómo trabajamos</a>
          </nav>
          <div className="hdr-actions">
            <button className="lang" type="button" aria-label="English version for suppliers"
              onClick={() => showToast('La versión en inglés para fábricas tiene su propia página, más corta. Se arma en la próxima etapa.')}>EN</button>
            <button className={`sel-btn${n ? ' has' : ''}`} type="button" aria-haspopup="dialog"
              aria-label={`Tu selección: ${n} ${n === 1 ? 'modelo' : 'modelos'}`} onClick={() => setSummaryOpen(true)}>
              <span className="sel-label">Tu selección</span>
              <span className="sel-count" id="selCount" ref={countRef}>{n}</span>
            </button>
            <a className="btn btn-primary btn-sm" href="#cotizar">Pedí tu cotización</a>
          </div>
        </div>
      </header>

      <nav className={`chapters${chapter ? ' show' : ''}`} aria-label="Capítulos" data-tone={chTone}>
        <ol>
          {CHAPTERS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className={chapter === id ? 'on' : undefined} aria-current={chapter === id ? 'step' : undefined}>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
