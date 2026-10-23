import path from 'path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL, PUBLIC_PATHS } from './site.config';
import { buildRobots, buildSitemap } from './lib/seo';

// Fills %SITE_URL% in the HTML pages and emits robots.txt and sitemap.xml at build time,
// so switching to a custom domain is a one-line change in site.config.ts.
const siteUrlPlugin = (): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL.replace(/\/+$/, '')),
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(SITE_URL) });
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(SITE_URL, PUBLIC_PATHS) });
  },
  // Vercel serves /ugc from ugc.html (cleanUrls); mirror that in the dev server.
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/ugc' || req.url?.startsWith('/ugc?')) req.url = req.url.replace('/ugc', '/ugc.html');
      next();
    });
  },
});

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), siteUrlPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        ugc: path.resolve(__dirname, 'ugc.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
