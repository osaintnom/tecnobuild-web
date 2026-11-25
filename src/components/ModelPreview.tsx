import { previewSVG } from '@/lib/preview';
import { COLOR_HEX, dibujoDe, publicUrl, type Familia } from '@/content/catalog';

/** Foto de la familia si existe; si no, el dibujo de su categoría (teñido con el color elegido). */
export function ModelPreview({ familia, color, className }: { familia: Familia; color?: string; className?: string }) {
  if (familia.foto) {
    return <span className={className}><img src={publicUrl(familia.foto)} alt={familia.nombre} loading="lazy" /></span>;
  }
  // El SVG se genera a partir de datos del catálogo, nunca de texto ingresado por el usuario.
  return <span className={className} dangerouslySetInnerHTML={{ __html: previewSVG(dibujoDe(familia), color ? COLOR_HEX[color] : undefined) }} />;
}
