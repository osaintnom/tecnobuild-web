'use client';
import { forwardRef, useMemo } from 'react';
import { buildingInner } from '@/lib/building';
import type { AmbId } from '@/content/catalog';

interface Props {
  /** Ambiente encendido (pisos con glow y rótulos); sin valor, el edificio queda neutro. */
  cat?: AmbId;
  className?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
  onMouseOver?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

/** Corte técnico del edificio (PB + 7 pisos + azotea). El dibujo sale de lib/building.ts. */
export const BuildingSVG = forwardRef<SVGSVGElement, Props>(function BuildingSVG({ cat, className = '', onClick, onMouseOver }, ref) {
  const svg = useMemo(buildingInner, []);
  return (
    <svg
      ref={ref}
      className={`bld ${className}`}
      viewBox="-20 100 760 880"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Corte de un edificio de planta baja, siete pisos y azotea. Cada par de pisos muestra un ambiente: balcones y escaleras abajo, después cocinas, baños y vestidores arriba."
      data-cat={cat}
      onClick={onClick}
      onMouseOver={onMouseOver}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
});
