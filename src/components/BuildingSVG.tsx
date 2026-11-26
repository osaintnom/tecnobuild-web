'use client';
import { forwardRef, useMemo } from 'react';
import { BUILDING_ES, buildingInner, type BuildingText } from '@/lib/building';
import { useI18n } from '@/i18n/I18nProvider';
import { CORTO_EN } from '@/i18n/catalog-en';
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
  const { locale, t: { building: t }, cat: ct } = useI18n();
  const svg = useMemo(() => {
    const tx: BuildingText = locale === 'es' ? BUILDING_ES : {
      ground: t.ground, floor: t.floor, roof: t.roof, decimal: t.decimal,
      label: ct.categoria, short: (c) => CORTO_EN[c] ?? ct.categoria(c), amb: (id) => ct.amb(id).corto,
    };
    return buildingInner(tx);
  }, [locale, t, ct]);
  return (
    <svg
      ref={ref}
      className={`bld ${className}`}
      viewBox="-20 100 760 880"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={t.aria}
      data-cat={cat}
      onClick={onClick}
      onMouseOver={onMouseOver}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
});
