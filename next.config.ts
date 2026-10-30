import type { NextConfig } from 'next';

// Sitio estático: `npm run build` genera la carpeta out/, lista para cualquier hosting.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
