import type { NextConfig } from 'next';

// Sitio estático: `npm run build` genera la carpeta out/, lista para cualquier hosting.
// En GitHub Pages el sitio vive en /<repo>/: el workflow pasa esa ruta en PAGES_BASE_PATH.
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
