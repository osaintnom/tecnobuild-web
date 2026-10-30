import { previewSVG } from '@/lib/preview';
import type { Cfg, Model } from '@/content/catalog';

// El SVG se genera a partir de datos del catálogo, nunca de texto ingresado por el usuario.
export function ModelPreview({ model, cfg, className }: { model: Model; cfg: Cfg; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: previewSVG(model, cfg) }} />;
}
