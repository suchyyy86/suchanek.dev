// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://suchanek.dev',
  // Jedna adresa na stránku: /cv, ne /cv/ ani /cv.html. Na Vercelu to dotahuje vercel.json
  // (cleanUrls + trailingSlash: false), který ostatní varianty přesměruje 308.
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
});
